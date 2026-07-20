import { Navigate } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import DiseaseDetector from "@/components/DiseaseDetector";
import HowItWorks from "@/components/HowItWorks";
import DiseaseDatabase from "@/components/DiseaseDatabase";
import Paywall from "@/components/Paywall";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="eyebrow opacity-60">Loading…</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const isSubscribed = !!profile?.is_subscribed;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      {!isSubscribed ? (
        <Paywall />
      ) : (
        <>
          <main>
            <HeroSection />
            <DiseaseDetector />
            <HowItWorks />
            <DiseaseDatabase />
          </main>
          <footer className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-foreground/10">
            <div className="font-serif text-xl uppercase tracking-tight">CropGuard</div>
            <div className="eyebrow opacity-40 text-center">
              Est. 2026 · Global Agritech Standard · All Rights Reserved
            </div>
            <div className="flex gap-8">
              <a href="#database" className="eyebrow gold-underline">Index</a>
              <a href="#how-it-works" className="eyebrow gold-underline">Methodology</a>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default Index;
