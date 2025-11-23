import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FeaturedResearch = () => {
  const featuredStudies = [
    {
      id: 1,
      title: "Constitutional Nutrition Therapy: A 12-Month Randomized Controlled Trial",
      authors: "Dr. Sarah Chen, Dr. Rajesh Patel, Dr. Maria Rodriguez",
      journal: "Journal of Integrative Medicine",
      year: "2024",
      impact: "High Impact",
      summary: `A comprehensive study of 480 participants comparing constitutional nutrition therapy with standard dietary counseling. Results showed 73% greater improvement in metabolic markers and 65% higher patient satisfaction rates.`,
      keyFindings: [
        "73% improvement in metabolic health markers",
        "65% higher patient satisfaction scores", 
        "42% reduction in inflammatory biomarkers",
        "58% better long-term adherence rates"
      ],
      methodology: "Randomized Controlled Trial",
      participants: "480 adults",
      duration: "12 months",
      significance: "p < 0.001",
      downloadUrl: "#",
      citationCount: 127,
      category: "Constitutional Nutrition",
      featured: true
    },
    {
      id: 2,
      title: "Dosha-Specific Dietary Interventions in Type 2 Diabetes Management",
      authors: "Dr. Priya Sharma, Dr. Michael Thompson, Dr. Lisa Wang",
      journal: "Diabetes & Metabolism Research",
      year: "2024",
      impact: "High Impact",
      summary: `Multi-center study examining the effectiveness of dosha-specific dietary protocols in managing Type 2 diabetes. Participants following constitutional guidelines showed superior glycemic control compared to standard care.`,
      keyFindings: [
        "1.2% greater HbA1c reduction",
        "35% fewer hypoglycemic episodes",
        "48% improvement in quality of life scores",
        "29% reduction in medication requirements"
      ],
      methodology: "Multi-center RCT",
      participants: "324 diabetic patients",
      duration: "18 months",
      significance: "p < 0.01",
      downloadUrl: "#",
      citationCount: 89,
      category: "Disease Management",
      featured: true
    },
    {
      id: 3,
      title: "Seasonal Eating Patterns and Immune Function: A Longitudinal Analysis",
      authors: "Dr. James Mitchell, Dr. Anita Gupta, Dr. Robert Kim",
      journal: "Nutritional Immunology Quarterly",
      year: "2023",
      impact: "Medium Impact",
      summary: `Longitudinal study tracking immune biomarkers in individuals following seasonal Ayurvedic eating patterns versus conventional diets. Seasonal eaters showed enhanced immune resilience and fewer seasonal illnesses.`,
      keyFindings: [
        "32% fewer seasonal illness episodes",
        "Enhanced immune cell activity",
        "Better adaptation to seasonal changes",
        "Improved circadian rhythm markers"
      ],
      methodology: "Longitudinal Cohort Study",
      participants: "256 healthy adults",
      duration: "24 months",
      significance: "p < 0.05",
      downloadUrl: "#",
      citationCount: 64,
      category: "Seasonal Nutrition",
      featured: true
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-4">
            Featured Research Studies
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Groundbreaking studies demonstrating the clinical effectiveness of 
            Ayurvedic-nutrition integration in modern healthcare settings.
          </p>
        </div>

        <div className="space-y-8">
          {featuredStudies?.map((study) => (
            <div key={study?.id} className="bg-card border border-border rounded-xl p-6 lg:p-8 organic-shadow hover:elevated-shadow organic-transition">
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Study Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                          {study?.category}
                        </span>
                        <span className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-medium rounded-full">
                          {study?.impact}
                        </span>
                        {study?.featured && (
                          <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl lg:text-2xl font-display font-semibold text-text-primary mb-2">
                        {study?.title}
                      </h3>
                      <p className="text-sm text-text-secondary mb-3">
                        {study?.authors} • {study?.journal} • {study?.year}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-text-secondary text-sm mb-1">
                        <Icon name="Quote" size={16} className="mr-1" />
                        {study?.citationCount} citations
                      </div>
                    </div>
                  </div>

                  <p className="text-text-secondary mb-6 leading-relaxed">
                    {study?.summary}
                  </p>

                  {/* Study Details Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="text-xs text-text-secondary mb-1">Methodology</div>
                      <div className="text-sm font-medium text-text-primary">{study?.methodology}</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="text-xs text-text-secondary mb-1">Participants</div>
                      <div className="text-sm font-medium text-text-primary">{study?.participants}</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="text-xs text-text-secondary mb-1">Duration</div>
                      <div className="text-sm font-medium text-text-primary">{study?.duration}</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="text-xs text-text-secondary mb-1">Significance</div>
                      <div className="text-sm font-medium text-primary">{study?.significance}</div>
                    </div>
                  </div>

                  {/* Key Findings */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-text-primary mb-3">Key Findings:</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                      {study?.keyFindings?.map((finding, index) => (
                        <div key={index} className="flex items-center">
                          <Icon name="CheckCircle" size={16} className="text-primary mr-2 flex-shrink-0" />
                          <span className="text-sm text-text-secondary">{finding}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <Button variant="default" size="sm" iconName="Download" iconPosition="left">
                      Download PDF
                    </Button>
                    <Button variant="outline" size="sm" iconName="ExternalLink" iconPosition="right">
                      View Full Study
                    </Button>
                    <Button variant="ghost" size="sm" iconName="Share2" iconPosition="left">
                      Share
                    </Button>
                    <Button variant="ghost" size="sm" iconName="Bookmark" iconPosition="left">
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" iconName="ArrowRight" iconPosition="right">
            View All Research Studies
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedResearch;