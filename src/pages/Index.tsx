import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import DiseaseDetector from "@/components/DiseaseDetector";
import HowItWorks from "@/components/HowItWorks";
import DiseaseDatabase from "@/components/DiseaseDatabase";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
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
    </div>
  );
};

export default Index;
