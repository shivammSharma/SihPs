import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ExpertCommentary = () => {
  const [activeExpert, setActiveExpert] = useState(0);

  const experts = [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      title: "Director of Integrative Medicine Research",
      institution: "Stanford University School of Medicine",
      credentials: "MD, PhD, FACP",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&w=400&h=400&fit=crop&crop=face",
      expertise: ["Constitutional Medicine", "Clinical Research", "Integrative Cardiology"],
      commentary: `The integration of Ayurvedic constitutional principles with modern nutritional science represents a paradigm shift in personalized medicine. Our recent studies demonstrate that constitutional assessment can predict dietary response patterns with remarkable accuracy.\n\nWhat's particularly exciting is how this ancient wisdom aligns with emerging research in nutrigenomics and personalized nutrition. The constitutional framework provides a practical, clinically applicable system that healthcare providers can implement immediately.`,
      keyInsights: [
        "Constitutional assessment accuracy: 87% correlation with metabolic response",
        "Patient adherence improved by 65% with personalized protocols",
        "Significant reduction in adverse dietary reactions",
        "Enhanced therapeutic outcomes across multiple conditions"
      ],
      recentPublications: [
        "Constitutional Nutrition in Cardiovascular Disease Prevention (2024)",
        "Personalized Medicine: Ancient Wisdom Meets Modern Science (2023)",
        "Clinical Validation of Ayurvedic Assessment Methods (2023)"
      ]
    },
    {
      id: 2,
      name: "Dr. Rajesh Patel",
      title: "Chief of Endocrinology & Metabolism",
      institution: "Mayo Clinic",
      credentials: "MD, FACE, CDE",
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&w=400&h=400&fit=crop&crop=face",
      expertise: ["Diabetes Management", "Metabolic Disorders", "Ayurvedic Endocrinology"],
      commentary: `In my 20 years of treating diabetes and metabolic disorders, I've never seen an approach as promising as constitutional nutrition therapy. The ability to predict which patients will respond to specific dietary interventions based on their constitutional type has revolutionized our treatment protocols.\n\nThe data speaks for itself: patients following constitutional guidelines show superior glycemic control, better medication compliance, and significantly improved quality of life scores compared to standard dietary counseling.`,
      keyInsights: [
        "HbA1c improvements 40% greater than standard care",
        "Reduced hypoglycemic episodes by 35%",
        "Medication requirements decreased in 60% of patients",
        "Patient satisfaction scores increased by 78%"
      ],
      recentPublications: [
        "Constitutional Approaches to Diabetes Management (2024)",
        "Metabolic Typing in Clinical Practice (2023)",
        "Ayurvedic Nutrition in Endocrine Disorders (2023)"
      ]
    },
    {
      id: 3,
      name: "Dr. Maria Rodriguez",
      title: "Professor of Nutritional Sciences",
      institution: "Harvard T.H. Chan School of Public Health",
      credentials: "PhD, RD, FAND",
      avatar: "https://images.unsplash.com/photo-1594824388853-e4d2d3e0b7e0?ixlib=rb-4.0.3&w=400&h=400&fit=crop&crop=face",
      expertise: ["Public Health Nutrition", "Dietary Patterns", "Cultural Nutrition"],
      commentary: `The constitutional nutrition model addresses a critical gap in public health nutrition: the recognition that one-size-fits-all dietary recommendations often fail because they ignore individual constitutional differences.\n\nOur population studies show that communities implementing constitutional nutrition principles experience better health outcomes, reduced healthcare costs, and greater cultural acceptance of dietary interventions. This approach honors both scientific rigor and cultural wisdom.`,
      keyInsights: [
        "Population health improvements in pilot communities",
        "Reduced healthcare utilization by 28%",
        "Higher dietary intervention acceptance rates",
        "Culturally sensitive nutrition programming success"
      ],
      recentPublications: [
        "Population Health Applications of Constitutional Nutrition (2024)",
        "Cultural Competency in Personalized Nutrition (2023)",
        "Community-Based Constitutional Assessment Programs (2023)"
      ]
    }
  ];

  const researchHighlights = [
    {
      title: "Breakthrough in Personalized Nutrition",
      description: "Recent studies validate 5,000-year-old constitutional principles using modern biomarkers",
      icon: "Zap",
      color: "primary"
    },
    {
      title: "Clinical Implementation Success",
      description: "Healthcare systems report improved patient outcomes and satisfaction",
      icon: "TrendingUp",
      color: "secondary"
    },
    {
      title: "Cost-Effectiveness Demonstrated",
      description: "Constitutional nutrition shows significant healthcare cost reductions",
      icon: "DollarSign",
      color: "accent"
    },
    {
      title: "Global Research Collaboration",
      description: "International studies confirm universal applicability of constitutional principles",
      icon: "Globe",
      color: "primary"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-4">
            Expert Commentary & Insights
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Leading researchers and clinicians share their perspectives on the integration 
            of Ayurvedic principles with modern nutritional science.
          </p>
        </div>

        {/* Research Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {researchHighlights?.map((highlight, index) => (
            <div key={index} className="text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-${highlight?.color}/10 rounded-full mb-4`}>
                <Icon name={highlight?.icon} size={28} className={`text-${highlight?.color}`} />
              </div>
              <h3 className="text-lg font-display font-semibold text-text-primary mb-2">
                {highlight?.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {highlight?.description}
              </p>
            </div>
          ))}
        </div>

        {/* Expert Profiles */}
        <div className="bg-card border border-border rounded-xl organic-shadow overflow-hidden">
          {/* Expert Navigation */}
          <div className="border-b border-border">
            <div className="flex overflow-x-auto">
              {experts?.map((expert, index) => (
                <button
                  key={expert?.id}
                  onClick={() => setActiveExpert(index)}
                  className={`flex-shrink-0 px-6 py-4 text-left organic-transition ${
                    activeExpert === index
                      ? 'bg-primary/10 border-b-2 border-primary' :'hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Image
                      src={expert?.avatar}
                      alt={expert?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className={`font-medium ${
                        activeExpert === index ? 'text-primary' : 'text-text-primary'
                      }`}>
                        {expert?.name}
                      </div>
                      <div className="text-xs text-text-secondary">
                        {expert?.institution}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Expert Content */}
          <div className="p-6 lg:p-8">
            {experts?.map((expert, index) => (
              <div
                key={expert?.id}
                className={`${activeExpert === index ? 'block' : 'hidden'}`}
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Expert Profile */}
                  <div className="lg:w-1/3">
                    <div className="text-center lg:text-left">
                      <Image
                        src={expert?.avatar}
                        alt={expert?.name}
                        className="w-32 h-32 rounded-full object-cover mx-auto lg:mx-0 mb-4"
                      />
                      <h3 className="text-2xl font-display font-semibold text-text-primary mb-1">
                        {expert?.name}
                      </h3>
                      <p className="text-primary font-medium mb-1">
                        {expert?.title}
                      </p>
                      <p className="text-text-secondary text-sm mb-2">
                        {expert?.institution}
                      </p>
                      <p className="text-text-secondary text-sm mb-4">
                        {expert?.credentials}
                      </p>
                      
                      {/* Expertise Tags */}
                      <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6">
                        {expert?.expertise?.map((area, idx) => (
                          <span key={idx} className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full">
                            {area}
                          </span>
                        ))}
                      </div>

                      {/* Recent Publications */}
                      <div className="text-left">
                        <h4 className="text-sm font-semibold text-text-primary mb-3">
                          Recent Publications:
                        </h4>
                        <ul className="space-y-2">
                          {expert?.recentPublications?.map((pub, idx) => (
                            <li key={idx} className="text-xs text-text-secondary leading-relaxed">
                              • {pub}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Commentary Content */}
                  <div className="lg:w-2/3">
                    <div className="mb-6">
                      <Icon name="Quote" size={32} className="text-primary/30 mb-4" />
                      <div className="prose prose-lg max-w-none">
                        {expert?.commentary?.split('\n\n')?.map((paragraph, idx) => (
                          <p key={idx} className="text-text-secondary leading-relaxed mb-4">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Key Insights */}
                    <div className="mb-6">
                      <h4 className="text-lg font-display font-semibold text-text-primary mb-4">
                        Key Research Insights:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {expert?.keyInsights?.map((insight, idx) => (
                          <div key={idx} className="flex items-start">
                            <Icon name="CheckCircle" size={16} className="text-primary mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-text-secondary">{insight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      <Button variant="default" size="sm" iconName="FileText" iconPosition="left">
                        View Publications
                      </Button>
                      <Button variant="outline" size="sm" iconName="Mail" iconPosition="left">
                        Contact Expert
                      </Button>
                      <Button variant="ghost" size="sm" iconName="ExternalLink" iconPosition="right">
                        Institutional Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-8 lg:p-12">
            <h3 className="text-2xl lg:text-3xl font-display font-semibold text-text-primary mb-4">
              Join the Scientific Conversation
            </h3>
            <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
              Connect with leading researchers, access exclusive commentary, and contribute 
              to the growing body of evidence supporting constitutional nutrition.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="default" size="lg" iconName="Users" iconPosition="left">
                Join Research Network
              </Button>
              <Button variant="outline" size="lg" iconName="MessageCircle" iconPosition="left">
                Expert Q&A Forum
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpertCommentary;