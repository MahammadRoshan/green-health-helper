import { Navigate } from "react-router-dom";
import Seo, { SITE_URL } from "@/components/Seo";
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
import { diseases } from "@/data/diseases";

const homeJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Green Health",
    url: SITE_URL,
    description:
      "AI-powered crop disease detection and agronomy guidance for farmers.",
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+91-8500956337",
        email: "mahammadroshan72@gmail.com",
        contactType: "customer support",
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Green Health",
    url: SITE_URL,
    description:
      "Scan a crop leaf, get an instant AI diagnosis, treatment plan and prevention guide.",
  },
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Crop Disease Pathology Index",
    url: `${SITE_URL}/#database`,
    description:
      "Reference index of common crop diseases with their symptoms, treatments and prevention measures.",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: diseases.length,
      itemListElement: diseases.map((d, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "MedicalCondition",
          name: d.name,
          description: d.description,
        },
      })),
    },
  },
];


const Index = () => {
  const { user, loading } = useAuth();

  const seo = (
    <Seo
      title="Green Health — AI Crop Disease Detection for Farmers"
      description="Scan a crop leaf or describe symptoms and get an instant AI diagnosis, treatment plan and prevention guide, plus 24/7 specialist agronomy agents."
      path="/"
      jsonLd={homeJsonLd}
    />
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        {seo}
        <div className="eyebrow text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {seo}
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
