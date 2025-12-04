import React, { useState } from 'react';
import Icon from '../../components/AppIcon';

// Import page modules
import DoshaVisualization from './components/DoshaVisualization';
import LearningPathCards from './components/LearningPathCards';
import InteractiveTools from './components/InteractiveTools';
import VideoLibrary from './components/VideoLibrary';
import ConceptInfographics from './components/ConceptInfographics';
import SearchAndFilter from './components/SearchAndFilter';

const IntelligenceCenterDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [searchResults, setSearchResults] = useState(null);

  const navigationSections = [
    { id: 'overview', name: 'Overview', icon: 'Home' },
    { id: 'learning', name: 'Learning Paths', icon: 'BookOpen' },
    { id: 'tools', name: 'Interactive Tools', icon: 'Calculator' },
    { id: 'videos', name: 'Video Library', icon: 'Play' },
    { id: 'concepts', name: 'Concept Guides', icon: 'Layers' },
    { id: 'search', name: 'Knowledge Search', icon: 'Search' }
  ];

  const handleSearch = (filters) => {
    const mockResults = [
      {
        title: "Vata Balancing Foods for Autumn",
        type: "Article",
        excerpt: "Discover grounding foods for balancing Vata...",
        relevance: 95
      }
    ];
    setSearchResults(mockResults);
  };

  // --- SECTION RENDERING ---
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection setActiveSection={setActiveSection} />;
      case 'learning':
        return <LearningPathCards />;
      case 'tools':
        return <InteractiveTools />;
      case 'videos':
        return <VideoLibrary />;
      case 'concepts':
        return <ConceptInfographics />;
      case 'search':
        return <SearchAndFilter onSearch={handleSearch} />;
      default:
        return <OverviewSection setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="pb-16">
      {/* Patient Dashboard Tabs Wrapper */}
      <div className="mb-8 flex justify-center">
        <div className="flex items-center space-x-1 bg-background/80 backdrop-blur-sm rounded-xl p-2 organic-shadow max-w-full overflow-x-auto">
          <div className="flex items-center space-x-6">
            {navigationSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg organic-transition whitespace-nowrap ${
                  activeSection === section.id
                    ? 'bg-brand-gold text-white elevated-shadow'
                    : 'text-text-secondary hover:text-primary hover:bg-muted/50'
                }`}
              >
                <Icon name={section.icon} size={18} />
                <span className="font-medium">{section.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Content */}
      <div className="min-h-[600px]">{renderActiveSection()}</div>

      {/* Search Results Inside Dashboard */}
      {searchResults && (
        <div className="mt-8 bg-background rounded-2xl p-6 organic-shadow">
          <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
            <Icon name="Search" size={20} className="mr-2" />
            Search Results ({searchResults.length})
          </h3>

          <div className="space-y-4">
            {searchResults.map((result, index) => (
              <div key={index} className="border border-border rounded-lg p-4 hover:bg-muted/30 organic-transition">
                <h4 className="font-semibold text-primary">{result.title}</h4>
                <p className="text-text-secondary text-sm">{result.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Reuse your same Overview section
const OverviewSection = ({ setActiveSection }) => (
  <div className="space-y-12">
    <div className="text-center bg-gradient-to-br from-brand-ivory via-brand-cream to-brand-sage/10 rounded-3xl p-12 border border-brand-gold/20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl lg:text-5xl font-display font-bold text-primary mb-6">
          Ayurvedic Intelligence Center
        </h1>

        <p className="text-xl text-text-secondary mb-8">
          Explore learning modules, expert insights & Ayurvedic tools.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setActiveSection('learning')}
            className="bg-brand-gold text-white px-6 py-3 rounded-lg"
          >
            Start Learning Journey
          </button>
          <button
            onClick={() => setActiveSection('tools')}
            className="border border-brand-gold px-6 py-3 rounded-lg text-brand-gold"
          >
            Try Interactive Tools
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default IntelligenceCenterDashboard;
