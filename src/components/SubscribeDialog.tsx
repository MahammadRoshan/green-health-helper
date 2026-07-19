import { Check, Sparkles, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const features = [
  "Unlimited AI disease scans",
  "Priority image analysis",
  "Personalized treatment plans",
  "Full diagnosis history & exports",
  "Early-access to new crop models",
];

const SubscribeDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { user, refreshProfile } = useAuth();

  if (!open) return null;

  const handleSubscribe = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({ is_subscribed: true })
      .eq("id", user.id);
    if (error) {
      toast.error("Could not update subscription");
      return;
    }
    toast.success("Welcome to CropGuard Pro!");
    await refreshProfile();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm animate-fade-in-up"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="bg-gradient-to-br from-primary via-primary to-accent p-8 text-primary-foreground">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/20 px-3 py-1 mb-4 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            CROPGUARD PRO
          </div>
          <h2 className="font-serif text-3xl mb-2">Grow smarter, faster</h2>
          <p className="text-primary-foreground/80 text-sm">
            You're using CropGuard a lot — unlock the pro tools farmers love.
          </p>
          <div className="mt-5 flex items-baseline gap-2">
            <span className="text-4xl font-bold">$9</span>
            <span className="text-primary-foreground/70 text-sm">/ month</span>
          </div>
        </div>

        <div className="p-8">
          <ul className="space-y-3 mb-6">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-success/15 flex items-center justify-center">
                  <Check className="w-3 h-3 text-success" />
                </span>
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={handleSubscribe}
            className="w-full rounded-lg bg-primary px-4 py-3 font-semibold text-primary-foreground hover:opacity-90 transition-all"
          >
            Subscribe now
          </button>
          <p className="text-xs text-center text-muted-foreground mt-3">
            Cancel anytime. No card required for this demo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscribeDialog;
