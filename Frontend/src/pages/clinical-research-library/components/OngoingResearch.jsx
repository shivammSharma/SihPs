import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OngoingResearch = () => {
  const ongoingStudies = [
    {
      id: 1,
      title: "AI-Powered Constitutional Assessment: Validation Study",
      principalInvestigator: "Dr. Sarah Chen, MD, PhD",
      institution: "Stanford Integrative Medicine Research Center",
      phase: "Phase II",
      status: "Recruiting",
      startDate: "January 2024",
      expectedCompletion: "December 2025",
      targetParticipants: 500,
      currentEnrollment: 287,
      description: `Multi-center validation study of AyurNutri's AI-powered constitutional assessment algorithm. Comparing AI predictions with traditional Ayurvedic practitioner assessments across diverse populations.`,
      objectives: [
        "Validate AI constitutional assessment accuracy",
        "Compare with traditional practitioner methods",
        "Assess cultural and demographic variations",
        "Optimize algorithm for clinical use"
      ],
      eligibility: "Adults 18-75, diverse constitutional types",
      locations: ["Stanford, CA", "Boston, MA", "Austin, TX", "Portland, OR"],
      fundingSource: "NIH NCCIH Grant R01AT012345",
      collaborators: [
        "Harvard Medical School",
        "University of Texas at Austin",
        "Oregon Health & Science University"
      ]
    },
    {
      id: 2,
      title: "Personalized Nutrition in Metabolic Syndrome: 24-Month Follow-up",
      principalInvestigator: "Dr. Rajesh Patel, MD",
      institution: "Mayo Clinic Integrative Medicine Program",
      phase: "Phase III",
      status: "Active",
      startDate: "March 2023",
      expectedCompletion: "March 2026",
      targetParticipants: 400,
      currentEnrollment: 398,
      description: `Long-term effectiveness study of constitutional nutrition therapy in managing metabolic syndrome components. Comparing personalized Ayurvedic nutrition with standard dietary counseling.`,
      objectives: [
        "Assess long-term metabolic improvements",
        "Evaluate cardiovascular risk reduction",
        "Monitor patient adherence and satisfaction",
        "Analyze cost-effectiveness"
      ],
      eligibility: "Adults with metabolic syndrome, BMI 25-40",
      locations: ["Rochester, MN", "Phoenix, AZ", "Jacksonville, FL"],
      fundingSource: "Mayo Clinic Internal Research Grant",
      collaborators: [
        "Arizona State University",
        "University of Florida"
      ]
    },
    {
      id: 3,
      title: "Pediatric Constitutional Nutrition: Growth and Development Study",
      principalInvestigator: "Dr. Emily Johnson, MD, MPH",
      institution: "Children\'s Hospital of Philadelphia",
      phase: "Phase I",
      status: "Recruiting",
      startDate: "September 2024",
      expectedCompletion: "September 2027",
      targetParticipants: 200,
      currentEnrollment: 45,
      description: `First-of-its-kind study examining the safety and efficacy of constitutional nutrition principles in pediatric populations. Focus on growth parameters and developmental milestones.`,
      objectives: [
        "Establish safety profile in children",
        "Monitor growth and development",
        "Assess nutritional adequacy",
        "Evaluate family satisfaction"
      ],
      eligibility: "Children 5-12 years, healthy or mild digestive issues",
      locations: ["Philadelphia, PA", "Seattle, WA"],
      fundingSource: "Pediatric Research Foundation Grant",
      collaborators: [
        "Seattle Children\'s Hospital",
        "University of Washington"
      ]
    }
  ];

  const researchInitiatives = [
    {
      title: "Global Ayurvedic Nutrition Database",
      description: "Comprehensive database of traditional food combinations and their modern nutritional analysis",
      status: "In Development",
      timeline: "2024-2026",
      icon: "Database"
    },
    {
      title: "Seasonal Eating Patterns Study",
      description: "Multi-year longitudinal study tracking health outcomes of seasonal dietary practices",
      status: "Planning Phase",
      timeline: "2025-2028",
      icon: "Calendar"
    },
    {
      title: "Practitioner Training Effectiveness",
      description: "Evaluation of training programs for healthcare providers in constitutional nutrition",
      status: "Pilot Phase",
      timeline: "2024-2025",
      icon: "GraduationCap"
    },
    {
      title: "Digital Health Integration",
      description: "Research on integrating constitutional nutrition with wearable devices and health apps",
      status: "Concept Development",
      timeline: "2025-2027",
      icon: "Smartphone"
    }
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'recruiting': return 'text-secondary bg-secondary/10';
      case 'active': return 'text-primary bg-primary/10';
      case 'in development': return 'text-accent bg-accent/10';
      case 'planning phase': return 'text-text-secondary bg-muted';
      case 'pilot phase': return 'text-primary bg-primary/10';
      case 'concept development': return 'text-text-secondary bg-muted';
      default: return 'text-text-secondary bg-muted';
    }
  };

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'Phase I': return 'text-secondary bg-secondary/10';
      case 'Phase II': return 'text-primary bg-primary/10';
      case 'Phase III': return 'text-accent bg-accent/10';
      default: return 'text-text-secondary bg-muted';
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-4">
            Ongoing Research Initiatives
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Cutting-edge studies advancing the science of Ayurvedic nutrition integration. 
            Join our research community and contribute to evidence-based healthcare innovation.
          </p>
        </div>

        {/* Active Clinical Trials */}
        <div className="mb-16">
          <h3 className="text-2xl font-display font-semibold text-text-primary mb-8 text-center">
            Active Clinical Trials
          </h3>
          
          <div className="space-y-8">
            {ongoingStudies?.map((study) => (
              <div key={study?.id} className="bg-card border border-border rounded-xl p-6 lg:p-8 organic-shadow">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Study Header */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPhaseColor(study?.phase)}`}>
                        {study?.phase}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(study?.status)}`}>
                        {study?.status}
                      </span>
                      <span className="px-3 py-1 bg-muted text-text-secondary text-xs font-medium rounded-full">
                        {study?.fundingSource?.split(' ')?.[0]} Funded
                      </span>
                    </div>

                    <h4 className="text-xl lg:text-2xl font-display font-semibold text-text-primary mb-3">
                      {study?.title}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-text-secondary">Principal Investigator:</span>
                        <div className="font-medium text-text-primary">{study?.principalInvestigator}</div>
                      </div>
                      <div>
                        <span className="text-text-secondary">Institution:</span>
                        <div className="font-medium text-text-primary">{study?.institution}</div>
                      </div>
                      <div>
                        <span className="text-text-secondary">Timeline:</span>
                        <div className="font-medium text-text-primary">
                          {study?.startDate} - {study?.expectedCompletion}
                        </div>
                      </div>
                      <div>
                        <span className="text-text-secondary">Enrollment:</span>
                        <div className="font-medium text-primary">
                          {study?.currentEnrollment} / {study?.targetParticipants} participants
                        </div>
                      </div>
                    </div>

                    <p className="text-text-secondary mb-6 leading-relaxed">
                      {study?.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-text-primary">Enrollment Progress</span>
                        <span className="text-sm text-text-secondary">
                          {Math.round((study?.currentEnrollment / study?.targetParticipants) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full organic-transition"
                          style={{ width: `${(study?.currentEnrollment / study?.targetParticipants) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Study Objectives */}
                    <div className="mb-6">
                      <h5 className="text-sm font-semibold text-text-primary mb-3">Primary Objectives:</h5>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                        {study?.objectives?.map((objective, index) => (
                          <div key={index} className="flex items-start">
                            <Icon name="Target" size={16} className="text-primary mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-text-secondary">{objective}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Study Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h5 className="text-sm font-semibold text-text-primary mb-2">Eligibility:</h5>
                        <p className="text-sm text-text-secondary">{study?.eligibility}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold text-text-primary mb-2">Study Locations:</h5>
                        <div className="flex flex-wrap gap-2">
                          {study?.locations?.map((location, index) => (
                            <span key={index} className="px-2 py-1 bg-muted text-text-secondary text-xs rounded">
                              {location}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Collaborators */}
                    <div className="mb-6">
                      <h5 className="text-sm font-semibold text-text-primary mb-2">Collaborating Institutions:</h5>
                      <div className="flex flex-wrap gap-2">
                        {study?.collaborators?.map((collaborator, index) => (
                          <span key={index} className="px-3 py-1 bg-accent/10 text-accent text-xs rounded-full">
                            {collaborator}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      <Button variant="default" size="sm" iconName="UserPlus" iconPosition="left">
                        Learn About Participation
                      </Button>
                      <Button variant="outline" size="sm" iconName="FileText" iconPosition="left">
                        Study Protocol
                      </Button>
                      <Button variant="ghost" size="sm" iconName="Mail" iconPosition="left">
                        Contact Researchers
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Research Initiatives */}
        <div>
          <h3 className="text-2xl font-display font-semibold text-text-primary mb-8 text-center">
            Future Research Initiatives
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {researchInitiatives?.map((initiative, index) => (
              <div key={index} className="bg-card border border-border rounded-xl p-6 organic-shadow hover:elevated-shadow organic-transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon name={initiative?.icon} size={24} className="text-primary" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(initiative?.status)}`}>
                    {initiative?.status}
                  </span>
                </div>
                
                <h4 className="text-lg font-display font-semibold text-text-primary mb-2">
                  {initiative?.title}
                </h4>
                
                <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                  {initiative?.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-text-secondary text-sm">
                    <Icon name="Clock" size={16} className="mr-2" />
                    {initiative?.timeline}
                  </div>
                  <Button variant="ghost" size="sm" iconName="ArrowRight">
                    Learn More
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-8 lg:p-12">
            <h3 className="text-2xl lg:text-3xl font-display font-semibold text-text-primary mb-4">
              Join Our Research Community
            </h3>
            <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
              Contribute to advancing evidence-based Ayurvedic nutrition through participation 
              in clinical trials, collaborative research, or institutional partnerships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="default" size="lg" iconName="Users" iconPosition="left">
                Become a Research Participant
              </Button>
              <Button variant="outline" size="lg" iconName="Building" iconPosition="left">
                Institutional Partnerships
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OngoingResearch;