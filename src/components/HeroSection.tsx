import heroFarm from "@/assets/hero-farm.jpg";
import { Leaf, Search, ShieldCheck } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroFarm}
          alt="Lush green farmland at sunrise"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-6 py-20">
        <div className="max-w-2xl space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 border border-primary/30 px-4 py-2 backdrop-blur-sm">
            <Leaf className="w-4 h-4 text-success" />
            <span className="text-sm font-medium text-primary-foreground">
              Smart Crop Protection
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif leading-tight text-primary-foreground">
            Detect Crop Diseases{" "}
            <span className="text-success">Early</span>
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-lg leading-relaxed">
            Upload a photo or describe symptoms to instantly identify crop diseases
            and get actionable treatment recommendations.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#detect"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:opacity-90 hover:scale-105"
            >
              <Search className="w-5 h-5" />
              Start Detection
            </a>
            <a
              href="#database"
              className="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/30 px-6 py-3 font-semibold text-primary-foreground backdrop-blur-sm transition-all hover:bg-primary-foreground/10"
            >
              <ShieldCheck className="w-5 h-5" />
              Browse Diseases
            </a>
          </div>

          {/* Stats */}
          <div className="flex gap-10 pt-4">
            {[
              { value: "6+", label: "Diseases" },
              { value: "12", label: "Symptoms" },
              { value: "100%", label: "Free" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-primary-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-primary-foreground/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
