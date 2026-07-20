import { Check, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const features = [
  "Unlimited AI disease scans",
  "Priority image analysis",
  "Personalized treatment plans",
  "Full diagnosis history & exports",
  "Early-access to new crop models",
];

const Paywall = () => {
  const { user, signOut } = useAuth();

  const handleSubscribe = () => {
    toast.info("Payments are not yet enabled. Checkout will be available soon.");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-16 bg-background">
      <div className="max-w-2xl w-full border border-foreground/15 bg-card">
        <div className="border-b border-foreground/15 p-8 flex items-center justify-between">
          <div>
            <div className="eyebrow opacity-60 mb-2">Members Only · Section 01</div>
            <h1 className="font-serif text-4xl leading-tight">Subscription required</h1>
          </div>
          <Lock className="w-8 h-8 text-accent" />
        </div>

        <div className="p-8 grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-sm opacity-75 leading-relaxed mb-6">
              Access to the CropGuard almanac, disease intelligence, and diagnostic engine
              is reserved for Pro subscribers. Signed in as{" "}
              <span className="font-medium">{user?.email}</span>.
            </p>
            <ul className="space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-foreground/15 p-6 flex flex-col">
            <div className="eyebrow opacity-60 mb-2">Pro Membership</div>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="font-serif text-5xl">$9</span>
              <span className="text-sm opacity-60">/ month</span>
            </div>
            <button
              onClick={handleSubscribe}
              className="w-full bg-accent text-accent-foreground py-3 eyebrow hover:bg-accent/90 transition-colors mb-3"
            >
              Subscribe now
            </button>
            <button
              onClick={signOut}
              className="w-full border border-foreground/20 py-3 eyebrow hover:bg-foreground hover:text-background transition-colors"
            >
              Sign out
            </button>
            <p className="text-[11px] text-center opacity-50 mt-4">
              Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Paywall;
