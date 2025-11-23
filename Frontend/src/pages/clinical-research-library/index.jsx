import React from 'react';
import Header from '../../components/ui/Header';
import ResearchHero from './components/ResearchHero';
import FeaturedResearch from './components/FeaturedResearch';
import ResearchCategories from './components/ResearchCategories';
import ResearchTools from './components/ResearchTools';
import OngoingResearch from './components/OngoingResearch';
import ExpertCommentary from './components/ExpertCommentary';

const ClinicalResearchLibrary = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <ResearchHero />
        <FeaturedResearch />
        <ResearchCategories />
        <ResearchTools />
        <OngoingResearch />
        <ExpertCommentary />
      </main>
      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <svg width="32" height="32" viewBox="0 0 40 40" className="text-primary-foreground">
                    <circle cx="20" cy="20" r="18" fill="currentColor" className="opacity-10" />
                    <path
                      d="M20 8c-1.5 0-3 .5-4 1.5L12 14l4 4 4-4-4-4c1-.5 2.5-1 4-1s3 .5 4 1l-4 4 4 4 4-4.5c1-1 1.5-2.5 1.5-4s-.5-3-1.5-4S21.5 8 20 8z"
                      fill="currentColor"
                    />
                    <circle cx="20" cy="26" r="6" fill="var(--color-secondary)" className="opacity-80" />
                    <circle cx="20" cy="26" r="3" fill="currentColor" />
                  </svg>
                </div>
                <div>
                  <span className="text-xl font-display font-semibold">AyurNutri</span>
                  <div className="text-sm opacity-80">Ancient Wisdom • Modern Precision</div>
                </div>
              </div>
              <p className="text-sm opacity-80 leading-relaxed max-w-md">
                Advancing evidence-based Ayurvedic nutrition through rigorous scientific research 
                and clinical validation. Building bridges between ancient wisdom and modern healthcare.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Research Resources</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>Clinical Studies Database</li>
                <li>Research Methodology</li>
                <li>Statistical Analysis Tools</li>
                <li>Citation Guidelines</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Researchers</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li>Collaboration Opportunities</li>
                <li>Grant Information</li>
                <li>IRB Guidelines</li>
                <li>Publication Support</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
            <p className="text-sm opacity-80">
              © {new Date()?.getFullYear()} AyurNutri Research Library. All rights reserved. 
              Advancing integrative medicine through evidence-based research.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClinicalResearchLibrary;