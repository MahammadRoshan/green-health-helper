import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Leaf, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type OAuthNamespace = {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: any }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: any }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: any }>;
};

function getOAuth(): OAuthNamespace | null {
  const anyAuth = (supabase.auth as unknown as { oauth?: OAuthNamespace });
  return anyAuth.oauth ?? null;
}

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Missing authorization_id in the request URL.");
        return;
      }
      const oauth = getOAuth();
      if (!oauth) {
        setError("OAuth is not available on this client build.");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/auth?next=" + encodeURIComponent(next);
        return;
      }
      const { data, error } = await oauth.getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (error) {
        setError(error.message ?? "Could not load this authorization request.");
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    const oauth = getOAuth();
    if (!oauth) return;
    setBusy(true);
    const { data, error } = approve
      ? await oauth.approveAuthorization(authorizationId)
      : await oauth.denyAuthorization(authorizationId);
    if (error) {
      setBusy(false);
      setError(error.message ?? "Something went wrong.");
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <Link to="/" className="flex items-center justify-center gap-2 font-serif text-2xl mb-8">
          <Leaf className="w-7 h-7 text-primary" />
          CropGuard
        </Link>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl">
          {error ? (
            <>
              <h1 className="font-serif text-2xl mb-3">Authorization error</h1>
              <p className="text-muted-foreground text-sm">{error}</p>
            </>
          ) : !details ? (
            <>
              <h1 className="font-serif text-2xl mb-3">Loading…</h1>
              <p className="text-muted-foreground text-sm">
                Verifying this authorization request.
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-4">
                <ShieldCheck className="w-4 h-4" />
                Authorization request
              </div>
              <h1 className="font-serif text-3xl mb-2">
                Connect {details.client?.name ?? "an app"} to CropGuard
              </h1>
              <p className="text-muted-foreground text-sm mb-6">
                This lets {details.client?.name ?? "the client"} use CropGuard as you. It will be
                able to call CropGuard tools on your behalf and read data your account can see.
                This does not bypass CropGuard's permissions or backend policies.
              </p>

              <div className="rounded-lg border border-border p-4 mb-6 text-sm space-y-1">
                <div className="text-muted-foreground">Redirect URI</div>
                <div className="font-mono break-all">
                  {details.client?.redirect_uri ?? details.redirect_uri ?? "—"}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  disabled={busy}
                  onClick={() => decide(true)}
                  className="flex-1 rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground hover:opacity-90 transition disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  disabled={busy}
                  onClick={() => decide(false)}
                  className="flex-1 rounded-lg border border-border px-4 py-3 font-semibold hover:bg-secondary/50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
