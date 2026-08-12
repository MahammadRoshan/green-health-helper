import { Camera, Cpu, Leaf } from "lucide-react";

const steps = [
  {
    code: "01",
    icon: Camera,
    title: "Capture",
    desc: "Photograph the affected crop with any phone, or tick the symptoms you can see in the field.",
  },
  {
    code: "02",
    icon: Cpu,
    title: "Analyse",
    desc: "Our vision model cross-references the leaf against a pathology database and known biological markers.",
  },
  {
    code: "03",
    icon: Leaf,
    title: "Treat",
    desc: "Get a site-specific treatment prescription and prevention protocol that protects yield and cuts pesticide waste.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="eyebrow text-primary mb-4">How it works</p>
        <h2 className="font-serif text-4xl md:text-6xl leading-[0.95]">
          Three steps from photo to <span className="italic text-gradient">prescription.</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((step) => (
          <div key={step.code} className="glass glass-hover rounded-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <span className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center">
                <step.icon className="w-5 h-5 text-primary" />
              </span>
              <span className="font-mono text-xs text-muted-foreground tracking-widest">{step.code}</span>
            </div>
            <h3 className="text-3xl font-serif mb-3">{step.title}</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
