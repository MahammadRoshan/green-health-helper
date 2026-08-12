import heroFarm from "@/assets/hero-farm.jpg";
import { ArrowRight, ScanLine, ShieldCheck, Sparkles } from "lucide-react";

const stats = [
  { k: "Diagnostic accuracy", v: "99.4%" },
  { k: "Avg. scan time", v: "3.2s" },
  { k: "Diseases indexed", v: "6+" },
  { k: "Specialist agents", v: "4" },
];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 grid-lines pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="grid lg:grid-cols-12 gap-14 items-center">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="eyebrow text-foreground/80">AI vision · Live agronomy agents</span>
            </span>

            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.92] tracking-tight">
              Diagnose any crop
              <br />
              disease in <span className="italic text-gradient">seconds.</span>
            </h1>

            <p className="mt-7 text-lg md:text-xl text-foreground/65 max-w-xl leading-relaxed">
              Green Health scans a single leaf photo, identifies the pathogen and
              returns a treatment plan built for your field — before the damage spreads.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#scanner"
                className="group inline-flex items-center gap-3 rounded-full bg-primary text-primary-foreground px-7 py-4 text-sm font-semibold glow-primary transition-transform hover:scale-[1.03]"
              >
                <ScanLine className="w-4 h-4" />
                Scan a leaf now
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#pricing"
                className="inline-flex items-center gap-3 rounded-full glass glass-hover px-7 py-4 text-sm font-semibold"
              >
                View plans
              </a>
            </div>

            <div className="mt-8 flex items-center gap-3 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-primary" />
              100 free scan credits every month · No card required
            </div>
          </div>

          <div className="lg:col-span-5">
            <figure className="relative rounded-[1.5rem] overflow-hidden glass p-2">
              <img
                src={heroFarm}
                alt="Precision-farmed field at dawn analysed by Green Health"
                className="w-full h-[380px] md:h-[520px] object-cover rounded-[1.1rem]"
                fetchPriority="high"
                decoding="async"
                width={1920}
                height={1080}
              />
              <div className="absolute inset-2 rounded-[1.1rem] bg-gradient-to-t from-background via-background/10 to-transparent" />
              <figcaption className="absolute left-6 right-6 bottom-6 glass rounded-xl p-4">
                <p className="eyebrow text-primary mb-1">Live diagnosis</p>
                <p className="font-serif text-2xl leading-tight">Late Blight detected · 96% confidence</p>
                <p className="text-xs text-muted-foreground mt-1 font-mono">Treatment plan generated in 3.1s</p>
              </figcaption>
            </figure>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.k} className="glass glass-hover rounded-2xl p-6">
              <span className="font-serif text-4xl md:text-5xl text-gradient">{s.v}</span>
              <span className="eyebrow text-muted-foreground block mt-3">{s.k}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
