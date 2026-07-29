import { Check, Sparkles, Smartphone, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useState } from "react";

type Tier = "basic" | "pro";

const PLANS: Record<Tier, { name: string; price: number; features: string[]; tag: string }> = {
  basic: {
    name: "Green Health · Basic",
    price: 99,
    tag: "Everyday grower",
    features: [
      "100 AI scan credits refreshed every month",
      "Symptom chat with the Green Health agent",
      "Full disease almanac & prevention library",
      "Email support within 48 hours",
    ],
  },
  pro: {
    name: "Green Health · Pro",
    price: 299,
    tag: "Unlimited farm",
    features: [
      "Unlimited AI disease scans (photo + live)",
      "Priority Gemini vision analysis",
      "Personalized treatment & spray schedules",
      "Full diagnosis history & CSV export",
      "24/7 priority chat with the AI agronomist",
      "Early access to new crop models",
    ],
  },
};

// Merchant identity is masked — never expose the raw phone number in the UI.
const MERCHANT_NAME = "Green Health Payment";
const MERCHANT_VPA = "8688128769@ybl"; // PhonePe UPI handle (hidden from UI)

const buildUpiLink = (tier: Tier) => {
  const p = PLANS[tier];
  const params = new URLSearchParams({
    pa: MERCHANT_VPA,
    pn: MERCHANT_NAME,
    am: String(p.price),
    cu: "INR",
    tn: `${p.name} subscription`,
  });
  return `upi://pay?${params.toString()}`;
};

const SubscribeDialog = ({
  open,
  onClose,
  defaultTier = "pro",
}: {
  open: boolean;
  onClose: () => void;
  defaultTier?: Tier;
}) => {
  const { user } = useAuth();
  const [tier, setTier] = useState<Tier>(defaultTier);

  if (!open) return null;
  const plan = PLANS[tier];

  const handlePay = () => {
    if (!user) return;
    try {
      window.location.href = buildUpiLink(tier);
      toast.success(`Opening ${MERCHANT_NAME}…`, {
        description: "Complete the payment in your UPI app. Your plan activates within a minute.",
      });
    } catch {
      toast.error("Could not open UPI app. Please try from your phone.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-foreground/70 backdrop-blur-md animate-fade-in-up"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-background border border-foreground/15 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close subscription dialog"
          className="absolute top-4 right-4 text-background/70 hover:text-background z-10"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="bg-foreground text-background p-8">
          <div className="inline-flex items-center gap-2 border border-accent/60 text-accent px-3 py-1 mb-5 eyebrow">
            <Sparkles className="w-3.5 h-3.5" />
            Green Health Membership
          </div>
          <h2 className="font-serif text-4xl leading-tight mb-2">
            Choose your <span className="italic">plan</span>
          </h2>
          <p className="text-background/70 text-sm max-w-sm">
            Instant activation via UPI · secure payment through {MERCHANT_NAME}.
          </p>

          <div className="grid grid-cols-2 gap-2 mt-6">
            {(Object.keys(PLANS) as Tier[]).map((t) => (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={`p-4 border text-left transition-colors ${
                  tier === t
                    ? "border-accent bg-accent/10"
                    : "border-background/25 hover:border-background/60"
                }`}
              >
                <p className="eyebrow opacity-70 mb-1">{PLANS[t].tag}</p>
                <p className="font-serif text-2xl leading-none">
                  ₹{PLANS[t].price}
                  <span className="text-xs opacity-60 ml-1">/mo</span>
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="p-8">
          <div className="mb-5">
            <p className="eyebrow opacity-60 mb-1">You selected</p>
            <p className="font-serif text-2xl">{plan.name}</p>
          </div>
          <ul className="space-y-2.5 mb-6">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={handlePay}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 eyebrow hover:bg-foreground transition-colors"
          >
            <Smartphone className="w-4 h-4" />
            Pay ₹{plan.price} via UPI · {MERCHANT_NAME}
          </button>
          <p className="text-[11px] text-center text-muted-foreground mt-3">
            Opens PhonePe / Google Pay / any UPI app. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscribeDialog;
