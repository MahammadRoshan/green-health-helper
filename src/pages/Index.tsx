import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import DiseaseDetector from "@/components/DiseaseDetector";
import HowItWorks from "@/components/HowItWorks";
import DiseaseDatabase from "@/components/DiseaseDatabase";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <DiseaseDetector />
      <HowItWorks />
      <DiseaseDatabase />
      <footer className="py-10 border-t border-border text-center text-sm text-muted-foreground">
        <p>© 2026 CropGuard — Smart Crop Disease Detection. Built for farmers.</p>
      </footer>
    </div>
  );
};

export default Index;
