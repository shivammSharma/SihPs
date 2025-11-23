import React, { useState, useEffect } from "react";

import Icon from "../../../components/AppIcon";

import Button from "../../../components/ui/Button";

const HeroSection = () => {
  const [currentAnimation, setCurrentAnimation] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const animationSteps = [
    { icon: "Leaf", label: "Vata", color: "text-blue-600" },
    { icon: "Flame", label: "Pitta", color: "text-red-600" },
    { icon: "Mountain", label: "Kapha", color: "text-green-600" },
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentAnimation((prev) => (prev + 1) % animationSteps?.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-background via-muted/30 to-brand-cream overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="organic-pattern"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="10"
                cy="10"
                r="2"
                fill="currentColor"
                className="text-primary"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#organic-pattern)" />
        </svg>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <div
            className={`space-y-8 organic-transition duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Icon name="Sparkles" size={16} />
                <span>Pioneering Ayurvedic-Nutrition Intelligence</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-text-primary leading-tight">
                Where Ancient Wisdom
                <span className="block text-primary">Meets Modern</span>
                <span className="block text-secondary">Precision</span>
              </h1>

              <p className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-2xl">
                The world's first comprehensive platform bridging 5,000-year-old
                Ayurvedic principles with cutting-edge nutritional science.
                Generate personalized diet plans that honor both clinical
                requirements and constitutional balance.
              </p>
            </div>

            {/* Animation Showcase */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border organic-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  Live Transformation
                </h3>
                <div className="flex space-x-2">
                  {animationSteps?.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full organic-transition ${
                        index === currentAnimation ? "bg-primary" : "bg-border"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-3 rounded-full bg-primary/10 organic-transition ${animationSteps?.[currentAnimation]?.color}`}
                  >
                    <Icon
                      name={animationSteps?.[currentAnimation]?.icon}
                      size={24}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">
                      {animationSteps?.[currentAnimation]?.label} Constitution
                    </p>
                    <p className="text-sm text-text-secondary">
                      Ayurvedic Assessment
                    </p>
                  </div>
                </div>

                <Icon
                  name="ArrowRight"
                  size={20}
                  className="text-text-secondary animate-pulse"
                />

                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-full bg-secondary/10">
                    <Icon
                      name="BarChart3"
                      size={24}
                      className="text-secondary"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">
                      Personalized Plan
                    </p>
                    <p className="text-sm text-text-secondary">
                      Nutritional Precision
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="default"
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg"
                iconName="Stethoscope"
                iconPosition="left"
              >
                Watch Demo
              </Button>
              
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={16} className="text-success" />
                <span className="text-sm text-text-secondary">
                  HIPAA Compliant
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Award" size={16} className="text-success" />
                <span className="text-sm text-text-secondary">
                  Clinically Validated
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Users" size={16} className="text-success" />
                <span className="text-sm text-text-secondary">
                  500+ Practitioners
                </span>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div
            className={`relative organic-transition duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="relative">
              {/* Main Dashboard Preview */}
              <div className="bg-card rounded-2xl organic-shadow border border-border overflow-hidden">
                <div className="bg-primary/5 px-6 py-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <span className="text-sm text-text-secondary">
                      AyurNutri Platform
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-text-primary">
                      Patient: Shreyanshu Gupta
                    </h4>
                    <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                      Vata-Pitta
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">85%</div>
                      <div className="text-xs text-text-secondary">
                        Balance Score
                      </div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-secondary">
                      3000
                      </div>
                      <div className="text-xs text-text-secondary">
                        Daily Calories
                      </div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-accent">12</div>
                      <div className="text-xs text-text-secondary">
                        Weeks Plan
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">
                        Constitutional Balance
                      </span>
                      <span className="text-text-primary">Optimizing</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements
              <div className="absolute -top-4 -right-4 bg-secondary/10 backdrop-blur-sm rounded-xl p-4 border border-secondary/20">
                <div className="flex items-center space-x-2">
                  <Icon name="Zap" size={16} className="text-secondary" />
                  <span className="text-sm font-medium text-text-primary">
                    AI Powered
                  </span>
                </div>
              </div> */}

              {/* Decorative leaf pill removed */}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
