import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Leaf, Mail, Lock, User as UserIcon, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

function safeNext(raw: string | null): string {
  if (!raw) return "/";
  // Same-origin relative paths only.
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}

const Auth = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeNext(params.get("next"));
  const { user } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate(next, { replace: true });
  }, [user, navigate, next]);

  const returnUrl = window.location.origin + next;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: returnUrl,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast.success("Account created! Check your email to confirm.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate(next);
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: returnUrl,
    });
    if (result.error) {
      toast.error("Google sign-in failed");
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/40 to-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 font-serif text-2xl mb-8">
          <Leaf className="w-7 h-7 text-primary" />
          CropGuard
        </Link>

        <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-xl p-8 shadow-xl">
          <h1 className="font-serif text-3xl mb-2">
            {mode === "login" ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            {mode === "login"
              ? "Sign in to protect your crops smarter."
              : "Start detecting crop diseases in seconds."}
          </p>

          <button
            onClick={handleGoogle}
            disabled={busy}
            className="w-full flex items-center justify-center gap-3 rounded-lg border border-border bg-background px-4 py-3 font-medium hover:bg-secondary/50 transition-all disabled:opacity-50 mb-5"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="you@farm.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                placeholder="Password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground hover:opacity-90 transition-all disabled:opacity-50"
            >
              {mode === "login" ? "Sign in" : "Create account"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-6">
            {mode === "login" ? "New to CropGuard?" : "Already have an account?"}{" "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-primary font-medium hover:underline"
            >
              {mode === "login" ? "Create account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
