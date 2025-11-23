// src/pages/ayurvedic-intelligence-center/index.jsx
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// Import all components
import DoshaVisualization from './components/DoshaVisualization';
import LearningPathCards from './components/LearningPathCards';
import InteractiveTools from './components/InteractiveTools';
import VideoLibrary from './components/VideoLibrary';
import ConceptInfographics from './components/ConceptInfographics';
import SearchAndFilter from './components/SearchAndFilter';

const AyurvedicIntelligenceCenter = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigationSections = [
    { id: 'overview', name: 'Overview', icon: 'Home' },
    // { id: 'doshas', name: 'Dosha Explorer', icon: 'Brain' },
    { id: 'learning', name: 'Learning Paths', icon: 'BookOpen' },
    { id: 'tools', name: 'Interactive Tools', icon: 'Calculator' },
    { id: 'videos', name: 'Video Library', icon: 'Play' },
    { id: 'concepts', name: 'Concept Guides', icon: 'Layers' },
    { id: 'search', name: 'Knowledge Search', icon: 'Search' }
  ];

  const handleSearch = (filters) => {
    // Mock search functionality
    const mockResults = [
      {
        title: 'Vata Balancing Foods for Autumn',
        type: 'Article',
        excerpt: 'Discover warming, grounding foods that help balance Vata dosha during the dry, windy autumn season.',
        relevance: 95
      },
      {
        title: 'Understanding Agni: The Digestive Fire',
        type: 'Video',
        excerpt: 'Learn how to assess and strengthen digestive capacity according to Ayurvedic principles.',
        relevance: 88
      },
      {
        title: 'Turmeric: The Golden Healer',
        type: 'Research',
        excerpt: 'Clinical studies on turmeric\'s anti-inflammatory properties and traditional Ayurvedic applications.',
        relevance: 82
      }
    ];
    setSearchResults(mockResults);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection />;
      case 'doshas':
        return <DoshaVisualization />;
      case 'learning':
        return <LearningPathCards />;
      case 'tools':
        return <InteractiveTools />;
      case 'videos':
        return <VideoLibrary />;
      case 'concepts':
        return <ConceptInfographics />;
      case 'search':
        return <SearchAndFilter onSearch={handleSearch} onFilter={handleSearch} />;
      default:
        return <OverviewSection />;
    }
  };

  const OverviewSection = () => (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center bg-gradient-to-br from-brand-ivory via-brand-cream to-brand-sage/10 rounded-3xl p-12 border border-brand-gold/20">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-brand-gold to-brand-sage rounded-full flex items-center justify-center elevated-shadow">
                <Icon name="Brain" size={40} className="text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="Sparkles" size={16} className="text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-primary mb-6">
            Ayurvedic Intelligence Center
          </h1>
          <p className="text-xl text-text-secondary mb-8 leading-relaxed">
            with modern nutritional science. Explore interactive learning modules, expert insights, 
            and practical tools designed for healthcare professionals and wellness enthusiasts.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-brand-gold hover:bg-brand-gold/90"
              iconName="Play"
              iconPosition="left"
              onClick={() => setActiveSection('learning')}
            >
              Start Learning Journey
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              iconName="Calculator"
              iconPosition="left"
              onClick={() => setActiveSection('tools')}
            >
              Try Interactive Tools
            </Button>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[ /* same features */ ]?.map((feature, index) => (
          <div 
            key={index}
            className="bg-background rounded-xl p-6 organic-shadow hover:elevated-shadow organic-transition cursor-pointer"
            onClick={feature?.action}
          >
            <div className="w-12 h-12 bg-brand-sage/20 rounded-lg flex items-center justify-center mb-4">
              <Icon name={feature?.icon} size={24} className="text-brand-sage" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">{feature?.title}</h3>
            <p className="text-text-secondary text-sm mb-4">{feature?.description}</p>
            <div className="flex items-center text-brand-sage text-sm font-medium">
              <span>Explore</span>
              <Icon name="ArrowRight" size={16} className="ml-1" />
            </div>
          </div>
        ))}
      </div>

      {/* Learning Statistics */}
      <div className="bg-gradient-to-r from-primary/5 to-brand-sage/5 rounded-2xl p-8 border border-primary/10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-display font-semibold text-primary mb-3">
            Join Our Learning Community
          </h2>
          <p className="text-text-secondary">
            Thousands of healthcare professionals are already transforming their practice
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[ /* stats */ ]?.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name={stat?.icon} size={20} className="text-brand-gold" />
              </div>
              <div className="text-2xl font-bold text-primary mb-1">{stat?.number}</div>
              <div className="text-sm text-text-secondary">{stat?.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Ayurvedic Intelligence Center - AyurNutri Platform</title>
        <meta name="keywords" content="ayurveda, nutrition, dosha, learning, healthcare, holistic medicine, food energetics" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-background via-brand-ivory to-brand-cream/30">
        <Header />
        
        <main className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Navigation Tabs - CENTERED */}
            <div className="mb-8">
              {/* outer wrapper centers the inner tab container */}
              <div className="flex justify-center">
                <div className="flex items-center space-x-1 bg-background/80 backdrop-blur-sm rounded-xl p-2 organic-shadow max-w-full overflow-x-auto">
                  <div className="flex items-center space-x-6">
                    {navigationSections?.map((section) => (
                      <button
                        key={section?.id}
                        onClick={() => setActiveSection(section?.id)}
                        className={`flex items-center space-x-2 px-4 py-3 rounded-lg organic-transition whitespace-nowrap ${
                          activeSection === section?.id
                            ? 'bg-brand-gold text-white elevated-shadow'
                            : 'text-text-secondary hover:text-primary hover:bg-muted/50'
                        }`}
                      >
                        <Icon name={section?.icon} size={18} />
                        <span className="font-medium">{section?.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Active Section Content */}
            <div className="min-h-[600px]">
              {renderActiveSection()}
            </div>

            {/* Search Results */}
            {searchResults && (
              <div className="mt-8 bg-background rounded-2xl p-6 organic-shadow">
                <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                  <Icon name="Search" size={20} className="mr-2" />
                  Search Results ({searchResults?.length})
                </h3>
                <div className="space-y-4">
                  {searchResults?.map((result, index) => (
                    <div key={index} className="border border-border rounded-lg p-4 hover:bg-muted/30 organic-transition">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-primary">{result?.title}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="bg-brand-sage/20 text-brand-sage px-2 py-1 rounded-full text-xs">
                            {result?.type}
                          </span>
                          <span className="text-xs text-text-secondary">
                            {result?.relevance}% match
                          </span>
                        </div>
                      </div>
                      <p className="text-text-secondary text-sm">{result?.excerpt}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-primary text-white mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <p className="text-sm opacity-80">
                © {new Date()?.getFullYear()} AyurNutri Platform. Bridging Ancient Wisdom with Modern Precision.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default AyurvedicIntelligenceCenter;
