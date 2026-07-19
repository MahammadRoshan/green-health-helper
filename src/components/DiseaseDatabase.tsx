import { diseases } from "@/data/diseases";

const severityDot = {
  low: "bg-primary",
  medium: "bg-accent",
  high: "bg-destructive",
};

const DiseaseDatabase = () => {
  return (
    <section id="database" className="max-w-7xl mx-auto px-6 py-24 border-b border-foreground/10">
      <div className="flex justify-between items-baseline mb-16">
        <div>
          <p className="eyebrow text-primary mb-4">Section III · Reference</p>
          <h2 className="text-5xl md:text-6xl font-serif leading-tight">
            The pathology <span className="italic">index.</span>
          </h2>
        </div>
        <p className="hidden md:block eyebrow opacity-40">{diseases.length} entries · updated 2026</p>
      </div>

      <div className="border-t border-foreground/25">
        {diseases.map((d, i) => (
          <article
            key={d.id}
            className="grid md:grid-cols-12 gap-6 py-10 border-b border-foreground/10 group"
          >
            <div className="md:col-span-1 font-mono text-[10px] text-foreground/40 tracking-wider">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="md:col-span-4">
              <h3 className="font-serif text-3xl leading-tight group-hover:italic transition-all">
                {d.name}
              </h3>
              <p className="text-xs text-foreground/60 italic mt-2">{d.crop}</p>
              <div className="flex items-center gap-2 mt-4 eyebrow">
                <span className={`w-1.5 h-1.5 rounded-full ${severityDot[d.severity]}`} />
                <span className="opacity-60">{d.severity} severity</span>
              </div>
            </div>
            <div className="md:col-span-4 text-sm text-foreground/70 leading-relaxed">
              {d.description}
            </div>
            <div className="md:col-span-3">
              <p className="eyebrow opacity-50 mb-3">Markers</p>
              <div className="flex flex-wrap gap-1.5">
                {d.symptoms.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-1 border border-foreground/20 text-[10px] tracking-wide"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <p className="eyebrow opacity-40 mt-4">
                {d.treatment.length} treatments · {d.prevention.length} preventions
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default DiseaseDatabase;
