import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ResearchCategories = () => {
  const [activeCategory, setActiveCategory] = useState('constitutional');

  const categories = [
    {
      id: 'constitutional',
      name: 'Constitutional Nutrition',
      icon: 'User',
      count: 42,
      description: 'Studies on dosha-based dietary interventions and personalized nutrition protocols',
      color: 'primary'
    },
    {
      id: 'disease',
      name: 'Disease Management',
      icon: 'Activity',
      count: 38,
      description: 'Clinical trials examining Ayurvedic nutrition in chronic disease treatment',
      color: 'secondary'
    },
    {
      id: 'seasonal',
      name: 'Seasonal Nutrition',
      icon: 'Calendar',
      count: 24,
      description: 'Research on seasonal eating patterns and their health impacts',
      color: 'accent'
    },
    {
      id: 'integrative',
      name: 'Integrative Medicine',
      icon: 'Zap',
      count: 31,
      description: 'Studies combining Ayurvedic principles with conventional medical approaches',
      color: 'primary'
    },
    {
      id: 'prevention',
      name: 'Preventive Health',
      icon: 'Shield',
      count: 28,
      description: 'Research on Ayurvedic nutrition for disease prevention and wellness',
      color: 'secondary'
    },
    {
      id: 'pediatric',
      name: 'Pediatric Studies',
      icon: 'Baby',
      count: 16,
      description: 'Ayurvedic nutrition research in children and adolescent populations',
      color: 'accent'
    }
  ];

  const studiesByCategory = {
    constitutional: [
      {
        title: "Vata-Pacifying Diet in Anxiety Management: A Clinical Trial",
        authors: "Dr. Priya Sharma et al.",
        year: "2024",
        participants: "156 adults",
        outcome: "47% reduction in anxiety scores"
      },
      {
        title: "Pitta Constitution and Inflammatory Markers: Longitudinal Study",
        authors: "Dr. Michael Chen et al.",
        year: "2023",
        participants: "203 participants",
        outcome: "38% decrease in inflammatory biomarkers"
      },
      {
        title: "Kapha-Balancing Nutrition in Metabolic Syndrome",
        authors: "Dr. Sarah Rodriguez et al.",
        year: "2024",
        participants: "189 patients",
        outcome: "52% improvement in metabolic parameters"
      }
    ],
    disease: [
      {
        title: "Ayurvedic Nutrition in Diabetes: 18-Month Follow-up",
        authors: "Dr. Rajesh Patel et al.",
        year: "2024",
        participants: "324 diabetic patients",
        outcome: "1.2% HbA1c reduction"
      },
      {
        title: "Constitutional Diet Therapy in Hypertension Management",
        authors: "Dr. Lisa Wang et al.",
        year: "2023",
        participants: "278 hypertensive adults",
        outcome: "15mmHg average BP reduction"
      }
    ],
    seasonal: [
      {
        title: "Spring Detox Protocols: Immune Function Analysis",
        authors: "Dr. James Mitchell et al.",
        year: "2024",
        participants: "145 healthy adults",
        outcome: "Enhanced immune response markers"
      },
      {
        title: "Winter Nutrition Patterns and Seasonal Affective Disorder",
        authors: "Dr. Anita Gupta et al.",
        year: "2023",
        participants: "198 participants",
        outcome: "32% reduction in SAD symptoms"
      }
    ],
    integrative: [
      {
        title: "Combining Ayurvedic and Mediterranean Diets: Cardiovascular Outcomes",
        authors: "Dr. Robert Kim et al.",
        year: "2024",
        participants: "267 cardiac patients",
        outcome: "28% reduction in cardiac events"
      }
    ],
    prevention: [
      {
        title: "Preventive Ayurvedic Nutrition in Healthy Aging",
        authors: "Dr. Maria Santos et al.",
        year: "2023",
        participants: "312 adults 50+",
        outcome: "Improved longevity biomarkers"
      }
    ],
    pediatric: [
      {
        title: "Constitutional Assessment in Childhood Nutrition",
        authors: "Dr. Emily Johnson et al.",
        year: "2024",
        participants: "89 children",
        outcome: "Better growth parameters"
      }
    ]
  };

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-4">
            Research Categories
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Explore our comprehensive collection of studies organized by research focus areas 
            and clinical applications.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories?.map((category) => (
            <button
              key={category?.id}
              onClick={() => setActiveCategory(category?.id)}
              className={`text-left p-6 rounded-xl border-2 organic-transition ${
                activeCategory === category?.id
                  ? 'border-primary bg-primary/5 elevated-shadow'
                  : 'border-border bg-card hover:border-primary/30 hover:bg-primary/5 organic-shadow'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${
                  activeCategory === category?.id ? 'bg-primary/20' : 'bg-muted/50'
                }`}>
                  <Icon 
                    name={category?.icon} 
                    size={24} 
                    className={activeCategory === category?.id ? 'text-primary' : 'text-text-secondary'} 
                  />
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  activeCategory === category?.id 
                    ? 'bg-primary/20 text-primary' :'bg-muted text-text-secondary'
                }`}>
                  {category?.count} studies
                </span>
              </div>
              
              <h3 className={`text-lg font-display font-semibold mb-2 ${
                activeCategory === category?.id ? 'text-primary' : 'text-text-primary'
              }`}>
                {category?.name}
              </h3>
              
              <p className="text-sm text-text-secondary leading-relaxed">
                {category?.description}
              </p>
            </button>
          ))}
        </div>

        {/* Selected Category Studies */}
        <div className="bg-card border border-border rounded-xl p-6 lg:p-8 organic-shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-display font-semibold text-text-primary">
              {categories?.find(cat => cat?.id === activeCategory)?.name} Studies
            </h3>
            <Button variant="outline" size="sm" iconName="Filter" iconPosition="left">
              Filter Results
            </Button>
          </div>

          <div className="space-y-4">
            {studiesByCategory?.[activeCategory]?.map((study, index) => (
              <div key={index} className="border border-border rounded-lg p-4 hover:bg-muted/30 organic-transition">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-text-primary mb-1">
                      {study?.title}
                    </h4>
                    <p className="text-sm text-text-secondary mb-2">
                      {study?.authors} • {study?.year} • {study?.participants}
                    </p>
                    <div className="flex items-center">
                      <Icon name="TrendingUp" size={16} className="text-primary mr-2" />
                      <span className="text-sm font-medium text-primary">
                        {study?.outcome}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" iconName="Eye">
                      View
                    </Button>
                    <Button variant="ghost" size="sm" iconName="Download">
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" iconName="ArrowRight" iconPosition="right">
              View All {categories?.find(cat => cat?.id === activeCategory)?.name} Studies
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResearchCategories;