import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import SubscribeDialog from "./SubscribeDialog";

const SCAN_COST = 10;

type Diagnosis = {
  crop: string;
  disease: string;
  confidence: number;
  severity: "low" | "medium" | "high" | "none";
  symptoms: string[];
  treatment: string[];
  prevention: string[];
  summary: string;
};

const severityClass: Record<Diagnosis["severity"], string> = {
  none: "text-primary border-primary/40",
  low: "text-primary border-primary/40",
  medium: "text-accent border-accent",
  high: "text-destructive border-destructive/60",
};

const AiScanner = () => {
  const { profile, refreshProfile } = useAuth();
  const [mode, setMode] = useState<"upload" | "camera">("upload");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const credits = profile?.credits ?? 0;
  const isSubscribed = !!profile?.is_subscribed;
  const canScan = isSubscribed || credits >= SCAN_COST;

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
    } catch (e) {
      console.error(e);
      toast.error("Unable to access camera. Check browser permissions.");
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setImage(dataUrl);
    setDiagnosis(null);
    stopCamera();
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setDiagnosis(null);
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!image) return;
    if (!canScan) {
      setSubOpen(true);
      toast.error("You need at least 10 credits per scan. Subscribe for unlimited scans.");
      return;
    }
    setLoading(true);
    setDiagnosis(null);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-crop", {
        body: { image },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setDiagnosis(data.diagnosis);
      if (!isSubscribed) {
        const { error: dErr } = await supabase.rpc("deduct_credits", { amount: SCAN_COST });
        if (dErr) console.error("deduct_credits", dErr);
        await refreshProfile();
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setDiagnosis(null);
    stopCamera();
  };

  return (
    <section id="scanner" className="max-w-7xl mx-auto px-6 py-24 border-b border-foreground/10">
      <div className="flex justify-between items-baseline mb-16">
        <div>
          <p className="eyebrow text-primary mb-4">Section I · AI Scanner</p>
          <h2 className="text-5xl md:text-6xl font-serif leading-tight max-w-2xl">
            Vision-based <span className="italic">diagnosis.</span>
          </h2>
        </div>
        <p className="hidden md:block eyebrow opacity-40 italic">Gemini vision</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Left: capture */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setMode("upload");
                stopCamera();
              }}
              className={`eyebrow px-4 py-2 border transition-colors ${
                mode === "upload"
                  ? "bg-foreground text-background border-foreground"
                  : "border-foreground/25 hover:border-foreground/60"
              }`}
            >
              Upload
            </button>
            <button
              onClick={() => setMode("camera")}
              className={`eyebrow px-4 py-2 border transition-colors ${
                mode === "camera"
                  ? "bg-foreground text-background border-foreground"
                  : "border-foreground/25 hover:border-foreground/60"
              }`}
            >
              Live Camera
            </button>
          </div>

          <div className="relative aspect-[16/10] bg-secondary overflow-hidden border border-foreground/10">
            {mode === "camera" && !image ? (
              <>
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${cameraOn ? "" : "hidden"}`}
                />
                {!cameraOn && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={startCamera}
                      className="eyebrow px-6 py-3 bg-primary text-primary-foreground hover:bg-foreground transition-colors"
                    >
                      Enable camera →
                    </button>
                  </div>
                )}
                {cameraOn && (
                  <button
                    onClick={capturePhoto}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 eyebrow px-6 py-3 bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Capture ⦿
                  </button>
                )}
              </>
            ) : image ? (
              <img src={image} alt="Specimen" className="w-full h-full object-cover" />
            ) : (
              <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/60 transition-colors">
                <span className="eyebrow mb-2 opacity-60">Upload crop image</span>
                <span className="font-serif text-2xl italic">Click to select a file</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              </label>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={analyze}
              disabled={!image || loading}
              className="eyebrow px-6 py-3 bg-primary text-primary-foreground hover:bg-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {loading ? "Analyzing…" : "Run AI Analysis →"}
            </button>
            {(image || cameraOn) && (
              <button
                onClick={reset}
                className="eyebrow px-4 py-3 border border-foreground/25 hover:border-foreground transition-colors"
              >
                Reset
              </button>
            )}
            {mode === "upload" && !image && (
              <label className="eyebrow px-4 py-3 border border-foreground/25 hover:border-foreground transition-colors cursor-pointer">
                Choose file
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              </label>
            )}
          </div>
        </div>

        {/* Right: diagnosis */}
        <div className="lg:col-span-5 space-y-8">
          <div className="grid grid-cols-2 gap-6 pb-6 border-b border-foreground/25">
            <div>
              <span className="eyebrow opacity-50 block mb-2">Model</span>
              <span className="font-serif text-2xl italic">Gemini 3</span>
            </div>
            <div>
              <span className="eyebrow opacity-50 block mb-2">Confidence</span>
              <span className="font-serif text-2xl italic">
                {diagnosis ? `${Math.round(diagnosis.confidence * 100)}%` : "—"}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="pt-4">
              <p className="eyebrow opacity-40 mb-4">Processing</p>
              <p className="font-serif text-3xl leading-tight text-foreground/70">
                Analyzing specimen imagery…
              </p>
            </div>
          ) : !diagnosis ? (
            <div className="pt-4">
              <p className="eyebrow opacity-40 mb-4">Awaiting scan</p>
              <p className="font-serif text-3xl leading-tight text-foreground/70">
                Upload or capture a crop image, then run AI analysis.
              </p>
            </div>
          ) : (
            <article className="pt-4 animate-fade-in-up">
              <div className="flex items-start justify-between mb-3 gap-4">
                <div>
                  <p className="eyebrow opacity-40 mb-2">Diagnosis</p>
                  <h3 className="font-serif text-3xl leading-tight">{diagnosis.disease}</h3>
                  <p className="text-xs text-foreground/60 italic mt-1">{diagnosis.crop}</p>
                </div>
                <span className={`px-3 py-1 border eyebrow ${severityClass[diagnosis.severity]}`}>
                  {diagnosis.severity}
                </span>
              </div>
              <p className="text-sm text-foreground/70 leading-relaxed mb-6">{diagnosis.summary}</p>

              {diagnosis.symptoms?.length > 0 && (
                <div className="mb-5">
                  <h4 className="eyebrow mb-3">Observed</h4>
                  <ul className="space-y-1.5">
                    {diagnosis.symptoms.map((s) => (
                      <li key={s} className="text-sm text-foreground/70 flex gap-3">
                        <span className="opacity-40">—</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {diagnosis.treatment?.length > 0 && (
                <div className="mb-5">
                  <h4 className="eyebrow text-accent mb-3">Treatment</h4>
                  <ul className="space-y-1.5">
                    {diagnosis.treatment.map((t) => (
                      <li key={t} className="text-sm text-foreground/70 flex gap-3">
                        <span className="text-accent">—</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {diagnosis.prevention?.length > 0 && (
                <div>
                  <h4 className="eyebrow text-primary mb-3">Prevention</h4>
                  <ul className="space-y-1.5">
                    {diagnosis.prevention.map((p) => (
                      <li key={p} className="text-sm text-foreground/70 flex gap-3">
                        <span className="text-primary">—</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          )}
        </div>
      </div>
    </section>
  );
};

export default AiScanner;
