import { useState } from "react";
import { Check } from "lucide-react";
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
    <section id="pricing" className="max-w-7xl mx-auto px-6 py-24 border-b border-foreground/10">
      <div className="text-center mb-16">
        <p className="eyebrow text-primary mb-4">Section V · Membership</p>
        <h2 className="font-serif text-5xl md:text-7xl leading-[0.9]">
          Simple, <span className="italic">honest pricing.</span>
        </h2>
        <p className="text-foreground/60 mt-5 max-w-lg mx-auto">
          Pay securely through Green Health Payment on any UPI app.
          Cancel anytime — no lock-in.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`relative border p-8 flex flex-col ${
              p.highlight
                ? "border-foreground bg-foreground text-background"
                : "border-foreground/20 bg-background"
            }`}
          >
            {p.highlight && (
              <span className="absolute -top-3 left-8 bg-accent text-accent-foreground eyebrow px-3 py-1">
                Most popular
              </span>
            )}
            <p className={`eyebrow mb-2 ${p.highlight ? "text-accent" : "opacity-60"}`}>{p.tag}</p>
            <h3 className="font-serif text-4xl mb-4">{p.name}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="font-serif text-6xl">₹{p.price}</span>
              <span className={`text-sm ${p.highlight ? "opacity-60" : "opacity-50"}`}>/ month</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${p.highlight ? "text-accent" : "text-primary"}`} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setOpen(p.id)}
              className={`w-full py-3.5 eyebrow transition-colors ${
                p.highlight
                  ? "bg-accent text-accent-foreground hover:bg-background hover:text-foreground"
                  : "bg-foreground text-background hover:bg-primary"
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
