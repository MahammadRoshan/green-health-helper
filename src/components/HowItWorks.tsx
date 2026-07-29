const steps = [
  {
    code: "01/CAPT",
    title: "Capture & Sync",
    desc: "Photograph the affected crop with any mobile device or select observed symptoms from the diagnostic checklist.",
  },
  {
    code: "02/ANLYS",
    title: "Neural Interpretation",
    desc: "Symptoms are cross-referenced against our pathology database and matched against known biological markers.",
  },
  {
    code: "03/RESLV",
    title: "Clinical Resolution",
    desc: "Receive site-specific treatment prescriptions and prevention protocols to protect crop integrity and yield.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-24 border-b border-foreground/10">
      <div className="flex justify-between items-baseline mb-16">
        <h2 className="eyebrow">The Methodology</h2>
        <p className="eyebrow text-muted-foreground italic">Technical Documentation v.2.4</p>
      </div>
      <div className="grid md:grid-cols-3 gap-12">
        {steps.map((step) => (
          <div key={step.code} className="pt-8 border-t border-foreground/25">
            <span className="block font-mono text-[10px] mb-8 text-primary tracking-wider">{step.code}</span>
            <h3 className="text-2xl font-serif mb-4">{step.title}</h3>
            <p className="text-sm text-foreground/60 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
