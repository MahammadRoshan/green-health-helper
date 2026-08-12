import { diseases } from "@/data/diseases";

const severityStyle: Record<string, string> = {
  low: "border-primary/40 text-primary bg-primary/10",
  medium: "border-accent/40 text-accent bg-accent/10",
  high: "border-destructive/40 text-destructive bg-destructive/10",
};

const DiseaseDatabase = () => {
  return (
    <section id="database" className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex flex-wrap justify-between items-end gap-6 mb-14">
        <div>
          <p className="eyebrow text-primary mb-4">Pathology index</p>
          <h2 className="text-4xl md:text-6xl font-serif leading-[0.95]">
            Every disease we <span className="italic text-gradient">recognise.</span>
          </h2>
        </div>
        <p className="font-mono text-xs text-muted-foreground">{diseases.length} entries · updated 2026</p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {diseases.map((d, i) => (
          <article key={d.id} className="glass glass-hover rounded-2xl p-7 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <span className="font-mono text-[10px] text-muted-foreground tracking-widest">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={`rounded-full border px-3 py-1 eyebrow ${severityStyle[d.severity]}`}
              >
                {d.severity}
              </span>
            </div>

            <h3 className="font-serif text-3xl leading-tight">{d.name}</h3>
            <p className="text-xs text-primary/80 mt-1.5 font-mono">{d.crop}</p>

            <p className="text-sm text-foreground/60 leading-relaxed mt-4 flex-1">{d.description}</p>

            <div className="mt-6">
              <p className="eyebrow text-muted-foreground mb-3">Markers</p>
              <div className="flex flex-wrap gap-1.5">
                {d.symptoms.slice(0, 5).map((s) => (
                  <span
                    key={s}
                    className="rounded-full px-2.5 py-1 border border-foreground/12 text-[10px] tracking-wide text-foreground/70"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <p className="eyebrow text-muted-foreground mt-5 pt-4 border-t border-foreground/10">
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
