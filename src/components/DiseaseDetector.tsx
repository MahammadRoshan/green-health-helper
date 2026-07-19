import { useState, useCallback } from "react";
import { symptoms as allSymptoms, detectDisease, type Disease } from "@/data/diseases";
import diseasedLeaf from "@/assets/diseased-leaf.jpg";

const severityLabel = {
  low: "text-primary border-primary/40",
  medium: "text-accent border-accent",
  high: "text-destructive border-destructive/60",
};

const DiseaseDetector = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [results, setResults] = useState<Disease[] | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
    setResults(null);
  };

  const handleDetect = () => setResults(detectDisease(selectedSymptoms));

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const clearAll = () => {
    setSelectedSymptoms([]);
    setResults(null);
    setUploadedImage(null);
  };

  return (
    <section id="detect" className="max-w-7xl mx-auto px-6 py-24 border-b border-foreground/10">
      <div className="flex justify-between items-baseline mb-16">
        <div>
          <p className="eyebrow text-primary mb-4">Section II · Diagnostics</p>
          <h2 className="text-5xl md:text-6xl font-serif leading-tight max-w-2xl">
            Instant pathogen <span className="italic">detection.</span>
          </h2>
        </div>
        <p className="hidden md:block eyebrow opacity-40 italic">Live instrument</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Left: image + symptoms */}
        <div className="lg:col-span-7 space-y-10">
          {/* Image capture */}
          <div className="relative aspect-[16/10] bg-secondary overflow-hidden border border-foreground/10">
            {uploadedImage ? (
              <img src={uploadedImage} alt="Uploaded crop" className="w-full h-full object-cover" />
            ) : (
              <img
                src={diseasedLeaf}
                alt="Sample specimen"
                className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1]"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end text-background">
              <div>
                <p className="eyebrow opacity-80 mb-1">Active Diagnostic</p>
                <h3 className="text-2xl font-serif">
                  {results && results[0] ? results[0].name : "Specimen ready"}
                </h3>
              </div>
              <span className="font-mono text-[10px] tracking-widest opacity-80">
                SCAN_STATE: {results ? (results.length ? "0.89" : "0.12") : "IDLE"}
              </span>
            </div>
            <label className="absolute top-4 right-4 cursor-pointer eyebrow bg-background text-foreground px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors">
              Upload specimen
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>

          {/* Symptom checklist */}
          <div className="pt-8 border-t border-foreground/25">
            <div className="flex justify-between items-baseline mb-6">
              <h3 className="eyebrow">Observed Symptoms</h3>
              <span className="eyebrow opacity-40">{selectedSymptoms.length} selected</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allSymptoms.map((s) => {
                const on = selectedSymptoms.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggleSymptom(s)}
                    className={`px-3 py-2 text-xs font-medium border transition-colors ${
                      on
                        ? "bg-foreground text-background border-foreground"
                        : "border-foreground/25 hover:border-foreground/60"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3 mt-8">
              <button
                onClick={handleDetect}
                disabled={selectedSymptoms.length === 0}
                className="eyebrow px-6 py-3 bg-primary text-primary-foreground hover:bg-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Run Analysis →
              </button>
              {(selectedSymptoms.length > 0 || uploadedImage) && (
                <button
                  onClick={clearAll}
                  className="eyebrow px-4 py-3 border border-foreground/25 hover:border-foreground transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: results */}
        <div className="lg:col-span-5 space-y-8">
          <div className="grid grid-cols-2 gap-6 pb-6 border-b border-foreground/25">
            <div>
              <span className="eyebrow opacity-50 block mb-2">Analysis Speed</span>
              <span className="font-serif text-2xl italic">1.2 sec</span>
            </div>
            <div>
              <span className="eyebrow opacity-50 block mb-2">Data Spectrum</span>
              <span className="font-serif text-2xl italic">4.2k strains</span>
            </div>
          </div>

          {results === null ? (
            <div className="pt-4">
              <p className="eyebrow opacity-40 mb-4">Awaiting sample</p>
              <p className="font-serif text-3xl leading-tight text-foreground/70">
                Select symptoms or upload a specimen to generate a diagnostic report.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="pt-4">
              <p className="eyebrow text-primary mb-4">Clean scan</p>
              <p className="font-serif text-3xl leading-tight">
                No known pathogen matches the observed symptoms.
              </p>
              <p className="mt-4 text-sm text-foreground/60">Try adjusting the selection or capture additional imagery.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {results.map((d, i) => (
                <article
                  key={d.id}
                  className="pt-6 border-t border-foreground/25 animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-3 gap-4">
                    <div>
                      <p className="eyebrow opacity-40 mb-2">Finding {String(i + 1).padStart(2, "0")}</p>
                      <h3 className="font-serif text-2xl leading-tight">{d.name}</h3>
                      <p className="text-xs text-foreground/60 italic mt-1">{d.crop}</p>
                    </div>
                    <span className={`px-3 py-1 border eyebrow ${severityLabel[d.severity]}`}>
                      {d.severity}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/70 leading-relaxed mb-6">{d.description}</p>

                  <div className="space-y-5">
                    <div>
                      <h4 className="eyebrow text-accent mb-3">Treatment</h4>
                      <ul className="space-y-1.5">
                        {d.treatment.map((t) => (
                          <li key={t} className="text-sm text-foreground/70 flex gap-3">
                            <span className="text-accent">—</span>
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="eyebrow text-primary mb-3">Prevention</h4>
                      <ul className="space-y-1.5">
                        {d.prevention.map((p) => (
                          <li key={p} className="text-sm text-foreground/70 flex gap-3">
                            <span className="text-primary">—</span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DiseaseDetector;
