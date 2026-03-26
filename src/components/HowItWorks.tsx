import { Camera, Cpu, FileText } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "Capture & Describe",
    desc: "Upload a photo of your affected crop or select observed symptoms from our checklist.",
  },
  {
    icon: Cpu,
    title: "AI Analysis",
    desc: "Our system cross-references symptoms against a comprehensive disease database to find matches.",
  },
  {
    icon: FileText,
    title: "Get Treatment Plan",
    desc: "Receive detailed treatment recommendations and prevention strategies for identified diseases.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-serif mb-4">
            How It <span className="text-gradient-green">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Three simple steps to protect your crops
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <div key={step.title} className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="text-sm font-semibold text-primary">Step {i + 1}</div>
              <h3 className="font-serif text-xl">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
