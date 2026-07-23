import { Navigate } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AiScanner from "@/components/AiScanner";
import AgentSection from "@/components/AgentSection";
import HowItWorks from "@/components/HowItWorks";
import DiseaseDatabase from "@/components/DiseaseDatabase";
import PricingSection from "@/components/PricingSection";
import ContactSection from "@/components/ContactSection";
import ChatAgent from "@/components/ChatAgent";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="eyebrow opacity-60">Loading…</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <HeroSection />
        <AiScanner />
        <AgentSection />
        <HowItWorks />
        <DiseaseDatabase />
        <PricingSection />
        <ContactSection />
      </main>
      <footer className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-foreground/10">
        <div>
          <div className="font-serif text-xl uppercase tracking-tight">Green Health</div>
          <p className="text-xs opacity-50 mt-1">AI crop disease detection · Est. 2026</p>
        </div>
        <div className="eyebrow opacity-40 text-center">
          Global Agritech Standard · All Rights Reserved
        </div>
        <div className="flex gap-6 flex-wrap justify-center">
          <a href="#scanner" className="eyebrow gold-underline">Scanner</a>
          <a href="#agents" className="eyebrow gold-underline">Agents</a>
          <a href="#pricing" className="eyebrow gold-underline">Pricing</a>
          <a href="#contact" className="eyebrow gold-underline">Contact</a>
        </div>
      </footer>
      <ChatAgent />
    </div>
  );
};

export default Index;
