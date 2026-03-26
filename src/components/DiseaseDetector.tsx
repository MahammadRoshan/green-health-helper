import { useState, useCallback } from "react";
import { Upload, Search, X, AlertTriangle, CheckCircle, Leaf } from "lucide-react";
import { symptoms as allSymptoms, detectDisease, type Disease } from "@/data/diseases";
import diseasedLeaf from "@/assets/diseased-leaf.jpg";

const severityColors = {
  low: "bg-success/10 text-success border-success/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  high: "bg-destructive/10 text-destructive border-destructive/20",
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

  const handleDetect = () => {
    const detected = detectDisease(selectedSymptoms);
    setResults(detected);
  };

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
    <section id="detect" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif mb-4">
            Disease <span className="text-gradient-green">Detection</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Select the symptoms you observe on your crops, optionally upload a photo,
            and our system will identify potential diseases.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {/* Input Panel */}
          <div className="space-y-8">
            {/* Image Upload */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Upload Crop Photo
              </h3>
              <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="Uploaded crop"
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag a photo
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      JPG, PNG up to 10MB
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            {/* Symptom Selection */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-primary" />
                Select Symptoms
              </h3>
              <div className="flex flex-wrap gap-2">
                {allSymptoms.map((symptom) => (
                  <button
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedSymptoms.includes(symptom)
                        ? "bg-primary text-primary-foreground shadow-md scale-105"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {symptom}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleDetect}
                  disabled={selectedSymptoms.length === 0}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Search className="w-5 h-5" />
                  Detect Disease
                </button>
                {(selectedSymptoms.length > 0 || uploadedImage) && (
                  <button
                    onClick={clearAll}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-muted-foreground hover:bg-muted transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {results === null ? (
              <div className="rounded-xl border border-border bg-card p-10 flex flex-col items-center justify-center min-h-[400px] text-center">
                <img
                  src={diseasedLeaf}
                  alt="Crop disease example"
                  className="w-40 h-40 object-cover rounded-full mb-6 opacity-60"
                  loading="lazy"
                  width={800}
                  height={800}
                />
                <h3 className="font-serif text-xl mb-2">Waiting for Input</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Select symptoms from the list and click "Detect Disease" to see results.
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-10 flex flex-col items-center justify-center min-h-[400px] text-center">
                <CheckCircle className="w-16 h-16 text-success mb-4" />
                <h3 className="font-serif text-xl mb-2">No Diseases Found</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  The selected symptoms don't match any known diseases in our database.
                  Try selecting different symptoms.
                </p>
              </div>
            ) : (
              results.map((disease, i) => (
                <div
                  key={disease.id}
                  className="rounded-xl border border-border bg-card p-6 animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-serif text-xl">{disease.name}</h3>
                      <p className="text-sm text-muted-foreground">{disease.crop}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${severityColors[disease.severity]}`}
                    >
                      {disease.severity} severity
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {disease.description}
                  </p>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-accent" />
                        Treatment
                      </h4>
                      <ul className="space-y-1">
                        {disease.treatment.map((t) => (
                          <li
                            key={t}
                            className="text-sm text-muted-foreground flex items-start gap-2"
                          >
                            <span className="text-primary mt-1">•</span>
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        Prevention
                      </h4>
                      <ul className="space-y-1">
                        {disease.prevention.map((p) => (
                          <li
                            key={p}
                            className="text-sm text-muted-foreground flex items-start gap-2"
                          >
                            <span className="text-success mt-1">•</span>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiseaseDetector;
