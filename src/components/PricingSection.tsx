import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import SubscribeDialog from "./SubscribeDialog";

type Tier = "basic" | "pro";

const plans: { id: Tier; name: string; price: number; tag: string; features: string[]; highlight?: boolean }[] = [
  {
    id: "basic",
    name: "Basic",
    price: 99,
    tag: "For everyday growers",
    features: [
      "100 AI scan credits every month",
      "Symptom chat with agent (unlimited)",
      "Full disease almanac access",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 299,
    tag: "For serious farms",
    highlight: true,
    features: [
      "Unlimited AI disease scans",
      "Priority vision analysis",
      "All 4 specialist AI agents",
      "Personalized treatment schedules",
      "Diagnosis history & CSV export",
      "24/7 priority support",
    ],
  },
];

const PricingSection = () => {
  const [open, setOpen] = useState<Tier | null>(null);

  return (
    <section id="pricing" className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <p className="eyebrow text-primary mb-4">Membership</p>
        <h2 className="font-serif text-4xl md:text-6xl leading-[0.95]">
          Simple, <span className="italic text-gradient">honest pricing.</span>
        </h2>
        <p className="text-foreground/60 mt-5 max-w-lg mx-auto">
          Pay securely through Green Health Payment on any UPI app. Cancel anytime — no lock-in.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`relative rounded-3xl p-8 flex flex-col glass glass-hover ${
              p.highlight ? "border-primary/40 glow-primary" : ""
            }`}
          >
            {p.highlight && (
              <span className="absolute -top-3 left-8 inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground eyebrow px-3 py-1">
                <Sparkles className="w-3 h-3" /> Most popular
              </span>
            )}
            <p className="eyebrow text-muted-foreground mb-2">{p.tag}</p>
            <h3 className="font-serif text-4xl mb-4">{p.name}</h3>
            <div className="flex items-baseline gap-1 mb-7">
              <span className={`font-serif text-6xl ${p.highlight ? "text-gradient" : ""}`}>₹{p.price}</span>
              <span className="text-sm text-muted-foreground">/ month</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-foreground/80">
                  <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${p.highlight ? "text-primary" : "text-accent"}`} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setOpen(p.id)}
              className={`w-full rounded-full py-3.5 text-sm font-semibold transition-transform hover:scale-[1.02] ${
                p.highlight
                  ? "bg-primary text-primary-foreground glow-primary"
                  : "border border-foreground/20 hover:border-primary/50 text-foreground"
              }`}
            >
              Subscribe to {p.name} →
            </button>
          </div>
        ))}
      </div>

      <SubscribeDialog open={!!open} onClose={() => setOpen(null)} defaultTier={open ?? "pro"} />
    </section>
  );
};

export default PricingSection;
