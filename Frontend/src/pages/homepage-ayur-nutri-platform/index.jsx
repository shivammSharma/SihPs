import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import Header from "../../components/ui/Header";
import HeroSection from "./components/HeroSection";
import PlatformShowcase from "./components/PlatformShowcase";

import LiveDemo from "./components/LiveDemo";
import Footer from "./components/Footer";

const HomepageAyurNutriPlatform = () => {
  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>
          AyurNutri - Where Ancient Wisdom Meets Modern Precision |
          Ayurvedic-Nutrition Intelligence Platform
        </title>
        <meta
          name="description"
          content="Revolutionary healthcare platform bridging 5,000-year-old Ayurvedic wisdom with cutting-edge nutritional science. Generate personalized diet plans for doctors and patients with AI-powered constitutional analysis."
        />
        <meta
          name="keywords"
          content="Ayurveda, nutrition, healthcare, AI, personalized medicine, dosha, constitutional analysis, integrative medicine"
        />
        <meta
          property="og:title"
          content="AyurNutri - Ancient Wisdom Meets Modern Precision"
        />
        <meta
          property="og:description"
          content="The world's first comprehensive platform for personalized Ayurvedic-nutrition intelligence"
        />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/homepage-ayur-nutri-platform" />
      </Helmet>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section */}
        <HeroSection />

        {/* Platform Showcase */}
        <PlatformShowcase />

        

        {/* Live Demo */}
        <LiveDemo />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomepageAyurNutriPlatform;
