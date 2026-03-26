import { diseases } from "@/data/diseases";
import { Bug, Shield, Sprout } from "lucide-react";

const severityBadge = {
  low: "bg-success/10 text-success",
  medium: "bg-warning/10 text-warning",
  high: "bg-destructive/10 text-destructive",
};

const DiseaseDatabase = () => {
  return (
    <section id="database" className="py-20 bg-muted/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif mb-4">
            Disease <span className="text-gradient-green">Database</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse our comprehensive database of common crop diseases, their symptoms,
            and recommended treatments.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {diseases.map((disease) => (
            <div
              key={disease.id}
              className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <Bug className="w-8 h-8 text-primary" />
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${severityBadge[disease.severity]}`}
                >
                  {disease.severity}
                </span>
              </div>

              <h3 className="font-serif text-xl mb-1">{disease.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{disease.crop}</p>

              <div className="flex flex-wrap gap-1 mb-4">
                {disease.symptoms.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <p className="text-sm text-muted-foreground line-clamp-3">
                {disease.description}
              </p>

              <div className="mt-4 pt-4 border-t border-border flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  {disease.treatment.length} treatments
                </span>
                <span className="flex items-center gap-1">
                  <Sprout className="w-3 h-3" />
                  {disease.prevention.length} preventions
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiseaseDatabase;
