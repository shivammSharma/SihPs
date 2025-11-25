import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';


const PlatformShowcase = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const showcaseItems = [
    {
      id: 'ayurvedic-assessment',
      title: 'Ayurvedic Constitutional Assessment',
      subtitle: 'Ancient Wisdom',
      description: 'Comprehensive dosha analysis using traditional Ayurvedic principles combined with modern questionnaire methodology.',
      icon: 'Leaf',
      color: 'text-green-600',
      features: [
        'Prakriti (Natural Constitution) Analysis',
        'Vikriti (Current Imbalance) Detection',
        'Seasonal & Lifestyle Factors',
        'Pulse & Tongue Analysis Integration'
      ],
      visual: {
        type: 'dosha-wheel',
        data: {
          vata: 35,
          pitta: 40,
          kapha: 25
        }
      }
    },
    {
      id: 'nutritional-science',
      title: 'Modern Nutritional Analytics',
      subtitle: 'Scientific Precision',
      description: 'Evidence-based nutritional analysis with macro/micronutrient tracking and metabolic profiling.',
      icon: 'BarChart3',
      color: 'text-blue-600',
      features: [
        'Macro & Micronutrient Analysis',
        'Metabolic Rate Calculations',
        'Food Sensitivity Mapping',
        'Biomarker Integration'
      ],
      visual: {
        type: 'nutrition-chart',
        data: {
          protein: 25,
          carbs: 45,
          fats: 30
        }
      }
    },
    {
      id: 'ai-integration',
      title: 'AI-Powered Personalization',
      subtitle: 'Intelligent Synthesis',
      description: 'Advanced algorithms that merge Ayurvedic wisdom with nutritional science for personalized recommendations.',
      icon: 'Brain',
      color: 'text-purple-600',
      features: [
        'Pattern Recognition & Learning',
        'Personalized Meal Planning',
        'Progress Prediction Modeling',
        'Adaptive Recommendation Engine'
      ],
      visual: {
        type: 'ai-network',
        data: {
          connections: 12,
          accuracy: 94,
          learning: 'active'
        }
      }
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('platform-showcase');
    if (element) observer?.observe(element);

    return () => observer?.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % showcaseItems?.length);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  const renderVisual = (visual, isActive) => {
    switch (visual?.type) {
      case 'dosha-wheel':
        return (
          <div className="relative w-48 h-48 mx-auto">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="var(--color-border)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="8"
                strokeDasharray={`${visual?.data?.vata * 2.51} 251`}
                strokeDashoffset="0"
                className={`organic-transition duration-1000 ${isActive ? 'opacity-100' : 'opacity-50'}`}
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="var(--color-secondary)"
                strokeWidth="8"
                strokeDasharray={`${visual?.data?.pitta * 2.51} 251`}
                strokeDashoffset={`-${visual?.data?.vata * 2.51}`}
                className={`organic-transition duration-1000 delay-300 ${isActive ? 'opacity-100' : 'opacity-50'}`}
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="8"
                strokeDasharray={`${visual?.data?.kapha * 2.51} 251`}
                strokeDashoffset={`-${(visual?.data?.vata + visual?.data?.pitta) * 2.51}`}
                className={`organic-transition duration-1000 delay-500 ${isActive ? 'opacity-100' : 'opacity-50'}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Icon name="Leaf" size={24} className="text-primary mx-auto mb-1" />
                <div className="text-xs text-text-secondary">Balance</div>
              </div>
            </div>
          </div>
        );
      
      case 'nutrition-chart':
        return (
          <div className="space-y-4">
            {Object.entries(visual?.data)?.map(([key, value], index) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="capitalize text-text-primary font-medium">{key}</span>
                  <span className="text-text-secondary">{value}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full organic-transition duration-1000 ${
                      index === 0 ? 'bg-primary' : index === 1 ? 'bg-secondary' : 'bg-accent'
                    } ${isActive ? 'opacity-100' : 'opacity-50'}`}
                    style={{
                      width: isActive ? `${value}%` : '0%',
                      transitionDelay: `${index * 200}ms`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'ai-network':
        return (
          <div className="relative w-48 h-48 mx-auto">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center organic-transition duration-1000 ${isActive ? 'scale-100' : 'scale-75'}`}>
                <Icon name="Brain" size={24} className="text-primary" />
              </div>
            </div>
            {[...Array(8)]?.map((_, i) => (
              <div
                key={i}
                className={`absolute w-3 h-3 rounded-full bg-secondary/60 organic-transition duration-1000 ${isActive ? 'opacity-100' : 'opacity-30'}`}
                style={{
                  top: `${50 + 35 * Math.sin((i * Math.PI * 2) / 8)}%`,
                  left: `${50 + 35 * Math.cos((i * Math.PI * 2) / 8)}%`,
                  transform: 'translate(-50%, -50%)',
                  transitionDelay: `${i * 100}ms`
                }}
              />
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <section id="platform-showcase" className="py-20 bg-gradient-to-br from-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Icon name="Zap" size={16} />
            <span>Platform Innovation</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-text-primary mb-6">
            The Perfect Synthesis of
            <span className="block text-primary">Tradition & Technology</span>
          </h2>
          
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Our revolutionary platform seamlessly integrates ancient Ayurvedic principles with modern nutritional science, 
            powered by advanced AI to deliver truly personalized healthcare solutions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Traditional Elements */}
          <div className={`space-y-8 organic-transition duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="bg-card rounded-2xl p-8 organic-shadow border border-border">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 rounded-full bg-primary/10">
                  <Icon name="Leaf" size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-text-primary">Ancient Wisdom</h3>
                  <p className="text-text-secondary">5,000 years of Ayurvedic knowledge</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Icon name="Wind" size={20} className="text-blue-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-text-primary">Vata</div>
                  <div className="text-xs text-text-secondary">Movement</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Icon name="Flame" size={20} className="text-red-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-text-primary">Pitta</div>
                  <div className="text-xs text-text-secondary">Transformation</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Icon name="Mountain" size={20} className="text-green-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-text-primary">Kapha</div>
                  <div className="text-xs text-text-secondary">Structure</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Rasa (Taste)</span>
                  <span className="text-text-primary">6 Classifications</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Virya (Potency)</span>
                  <span className="text-text-primary">Hot/Cold Energy</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">Guna (Qualities)</span>
                  <span className="text-text-primary">20 Attributes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Modern Technology */}
          <div className={`space-y-8 organic-transition duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="bg-card rounded-2xl p-8 organic-shadow border border-border">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 rounded-full bg-secondary/10">
                  <Icon name="BarChart3" size={24} className="text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-text-primary">Modern Precision</h3>
                  <p className="text-text-secondary">Evidence-based nutritional science</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Protein</span>
                  <span className="text-sm font-medium text-text-primary">25%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{width: '25%'}}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Carbohydrates</span>
                  <span className="text-sm font-medium text-text-primary">45%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-secondary h-2 rounded-full" style={{width: '45%'}}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Healthy Fats</span>
                  <span className="text-sm font-medium text-text-primary">30%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full" style={{width: '30%'}}></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-bold text-text-primary">1,850</div>
                  <div className="text-xs text-text-secondary">Daily Calories</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-bold text-text-primary">94%</div>
                  <div className="text-xs text-text-secondary">Accuracy</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Showcase */}
        <div className="mt-16">
          <div className="bg-card rounded-2xl p-8 organic-shadow border border-border">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Icon name="Zap" size={16} />
                <span>AI-Powered Integration</span>
              </div>
              <h3 className="text-2xl font-display font-bold text-text-primary mb-4">
                Intelligent Synthesis in Action
              </h3>
              <p className="text-text-secondary max-w-2xl mx-auto">
                Watch how our AI seamlessly combines constitutional analysis with nutritional requirements 
                to generate personalized recommendations.
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
              <div className="flex space-x-1 bg-muted/50 rounded-lg p-1">
                {showcaseItems?.map((item, index) => (
                  <button
                    key={item?.id}
                    onClick={() => setActiveTab(index)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium organic-transition ${
                      activeTab === index
                        ? 'bg-background text-text-primary shadow-sm'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    <Icon name={item?.icon} size={16} className={item?.color} />
                    <span className="hidden sm:inline">{item?.subtitle}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Content */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h4 className="text-xl font-display font-bold text-text-primary mb-4">
                  {showcaseItems?.[activeTab]?.title}
                </h4>
                <p className="text-text-secondary mb-6">
                  {showcaseItems?.[activeTab]?.description}
                </p>
                <ul className="space-y-2">
                  {showcaseItems?.[activeTab]?.features?.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm text-text-secondary">
                      <Icon name="Check" size={14} className="text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-center">
                {renderVisual(showcaseItems?.[activeTab]?.visual, true)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformShowcase;