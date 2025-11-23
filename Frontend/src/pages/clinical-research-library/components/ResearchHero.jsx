import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ResearchHero = () => {
  const stats = [
    { number: "150+", label: "Peer-Reviewed Studies", icon: "FileText" },
    { number: "25+", label: "Clinical Trials", icon: "Activity" },
    { number: "12", label: "Partner Institutions", icon: "Building" },
    { number: "98%", label: "Evidence Validation", icon: "CheckCircle" }
  ];

  return (
    <div className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 lg:py-24">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3')] bg-cover bg-center opacity-5"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-primary/10 rounded-full mr-4">
              <Icon name="BookOpen" size={32} className="text-primary" />
            </div>
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Evidence-Based Research
            </span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-display font-bold text-text-primary mb-6">
            Clinical Research
            <span className="block text-primary">Library</span>
          </h1>
          
          <p className="text-xl text-text-secondary leading-relaxed mb-8">
            Comprehensive repository of peer-reviewed studies validating the integration of 
            Ayurvedic principles with modern nutritional science. Discover the evidence 
            behind personalized constitutional nutrition.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="default" 
              size="lg"
              iconName="Search"
              iconPosition="left"
              className="bg-primary hover:bg-primary/90"
            >
              Search Research
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              iconName="Download"
              iconPosition="left"
            >
              Download Summary
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats?.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                <Icon name={stat?.icon} size={24} className="text-primary" />
              </div>
              <div className="text-3xl lg:text-4xl font-display font-bold text-primary mb-2">
                {stat?.number}
              </div>
              <div className="text-sm text-text-secondary font-medium">
                {stat?.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResearchHero;