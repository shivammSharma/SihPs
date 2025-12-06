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
      description:
        'Comprehensive dosha analysis using traditional Ayurvedic principles combined with modern questionnaire methodology.',
      icon: 'Leaf',
      color: 'text-green-600',
      features: [
        'Prakriti (Natural Constitution) Analysis',
        'Vikriti (Current Imbalance) Detection',
        'Seasonal & Lifestyle Factors',
        'Pulse & Tongue Analysis Integration',
      ],
      visual: {
        type: 'dosha-wheel',
        data: {
          vata: 35,
          pitta: 40,
          kapha: 25,
        },
      },
    },
    {
      id: 'nutritional-science',
      title: 'Modern Nutritional Analytics',
      subtitle: 'Scientific Precision',
      description:
        'Evidence-based nutritional analysis with macro/micronutrient tracking and metabolic profiling.',
      icon: 'BarChart3',
      color: 'text-blue-600',
      features: [
        'Macro & Micronutrient Analysis',
        'Metabolic Rate Calculations',
        'Food Sensitivity Mapping',
        'Biomarker Integration',
      ],
      visual: {
        type: 'nutrition-chart',
        data: {
          protein: 25,
          carbs: 45,
          fats: 30,
        },
      },
    },
    {
      id: 'ai-integration',
      title: 'AI-Powered Personalization',
      subtitle: 'Intelligent Synthesis',
      description:
        'Advanced algorithms that merge Ayurvedic wisdom with nutritional science for personalized recommendations.',
      icon: 'Brain',
      color: 'text-purple-600',
      features: [
        'Pattern Recognition & Learning',
        'Personalized Meal Planning',
        'Progress Prediction Modeling',
        'Adaptive Recommendation Engine',
      ],
      visual: {
        type: 'ai-network',
        data: {
          connections: 12,
          accuracy: 94,
          learning: 'active',
        },
      },
    },
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
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderVisual = (visual, isActive) => {
    switch (visual?.type) {
      case 'dosha-wheel':
        return (
          <div className="relative w-48 h-48 mx-auto">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
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
                className={`organic-transition duration-1000 ${
                  isActive ? 'opacity-100' : 'opacity-50'
                }`}
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
                className={`organic-transition duration-1000 delay-300 ${
                  isActive ? 'opacity-100' : 'opacity-50'
                }`}
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="8"
                strokeDasharray={`${visual?.data?.kapha * 2.51} 251`}
                strokeDashoffset={`-${
                  (visual?.data?.vata + visual?.data?.pitta) * 2.51
                }`}
                className={`organic-transition duration-1000 delay-500 ${
                  isActive ? 'opacity-100' : 'opacity-50'
                }`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Icon
                  name="Leaf"
                  size={24}
                  className="text-primary mx-auto mb-1"
                />
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
                  <span className="capitalize text-text-primary font-medium">
                    {key}
                  </span>
                  <span className="text-text-secondary">{value}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full organic-transition duration-1000 ${
                      index === 0
                        ? 'bg-primary'
                        : index === 1
                        ? 'bg-secondary'
                        : 'bg-accent'
                    } ${isActive ? 'opacity-100' : 'opacity-50'}`}
                    style={{
                      width: isActive ? `${value}%` : '0%',
                      transitionDelay: `${index * 200}ms`,
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
              <div
                className={`w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center organic-transition duration-1000 ${
                  isActive ? 'scale-100' : 'scale-75'
                }`}
              >
                <Icon name="Brain" size={24} className="text-primary" />
              </div>
            </div>
            {[...Array(8)]?.map((_, i) => (
              <div
                key={i}
                className={`absolute w-3 h-3 rounded-full bg-secondary/60 organic-transition duration-1000 ${
                  isActive ? 'opacity-100' : 'opacity-30'
                }`}
                style={{
                  top: `${50 + 35 * Math.sin((i * Math.PI * 2) / 8)}%`,
                  left: `${50 + 35 * Math.cos((i * Math.PI * 2) / 8)}%`,
                  transform: 'translate(-50%, -50%)',
                  transitionDelay: `${i * 100}ms`,
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
    <section
      id="platform-showcase"
      className="py-20 bg-gradient-to-br from-muted/30 to-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Icon name="Zap" size={16} />
            <span>Platform Innovation</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-text-primary mb-6">
            The Perfect Synthesis of
            <span className="block text-primary">Tradition &amp; Technology</span>
          </h2>

          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Our revolutionary platform seamlessly integrates ancient Ayurvedic
            principles with modern nutritional science, powered by advanced AI
            to deliver truly personalized healthcare solutions.
          </p>
        </div>

        {/* NOTE: the two big cards (Ancient Wisdom / Modern Precision) were here. 
            They are intentionally removed now. */}

        {/* Integration Showcase */}
        <div className="mt-4">
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
                Watch how our AI seamlessly combines constitutional analysis
                with nutritional requirements to generate personalized
                recommendations.
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
                    <Icon
                      name={item?.icon}
                      size={16}
                      className={item?.color}
                    />
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
                  {showcaseItems?.[activeTab]?.features?.map(
                    (feature, index) => (
                      <li
                        key={index}
                        className="flex items-center space-x-2 text-sm text-text-secondary"
                      >
                        <Icon
                          name="Check"
                          size={14}
                          className="text-primary"
                        />
                        <span>{feature}</span>
                      </li>
                    )
                  )}
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
