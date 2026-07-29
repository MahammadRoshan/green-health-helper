import heroFarm from "@/assets/hero-farm.jpg";

const HeroSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-6">
      <div className="py-20 md:py-32 grid lg:grid-cols-12 gap-12 items-end border-b border-foreground/10">
        <div className="lg:col-span-8">
          <p className="eyebrow mb-6 text-primary">Agricultural Intelligence · Vol. 04</p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif leading-[0.85] tracking-tight">
            Protecting the <br />
            <span className="italic">Future of Harvest.</span>
          </h1>
        </div>
        <div className="lg:col-span-4 space-y-6">
          <p className="text-lg leading-relaxed text-foreground/70 max-w-sm">
            Advanced spectral analysis and predictive diagnostics for modern agronomy. Identify pathogens before they reach the yield.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#detect"
              className="eyebrow px-5 py-3 bg-foreground text-background hover:bg-primary transition-colors"
            >
              Launch Scanner
            </a>
            <a
              href="#database"
              className="eyebrow px-5 py-3 border border-foreground/25 hover:border-foreground transition-colors"
            >
              Read Index
            </a>
          </div>
        </div>
      </div>

      {/* Editorial cover image band */}
      <figure className="relative -mx-6 md:mx-0 border-b border-foreground/10">
        <img
          src={heroFarm}
          alt="Precision-farmed field at dawn"
          className="w-full h-[52vh] md:h-[68vh] object-cover grayscale-[0.15] contrast-[1.05]"
          width={1920}
          height={1080}
        />
        <figcaption className="absolute bottom-6 left-6 right-6 flex justify-between items-end text-background">
          <div className="max-w-md">
            <p className="eyebrow opacity-80 mb-1">Fig. 01 · Field Reconnaissance</p>
            <p className="font-serif text-2xl md:text-3xl italic">Latitude 44.7°N · Late season, temperate cereal grain.</p>
          </div>
          <span className="hidden md:inline font-mono text-[10px] tracking-widest opacity-80">REF_00-394-82</span>
        </figcaption>
      </figure>

      {/* Almanac stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-foreground/10">
        {[
          { k: "Diseases indexed", v: "6+" },
          { k: "Diagnostic symptoms", v: "12" },
          { k: "Clinical accuracy", v: "99.4%" },
          { k: "Farmer access", v: "Free" },
        ].map((s, i) => (
          <div
            key={s.k}
            className={`py-8 px-6 ${i > 0 ? "md:border-l border-foreground/10" : ""} ${i > 1 ? "border-t md:border-t-0" : ""} ${i === 1 ? "border-l" : ""}`}
          >
            <span className="eyebrow text-muted-foreground block mb-3">{s.k}</span>
            <span className="font-serif text-4xl italic">{s.v}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
