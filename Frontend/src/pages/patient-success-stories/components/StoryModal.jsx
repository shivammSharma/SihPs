import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import ProgressChart from './ProgressChart';

const StoryModal = ({ story, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('story');

  if (!isOpen || !story) return null;

  const tabs = [
    { id: 'story', label: 'Full Story', icon: 'BookOpen' },
    { id: 'progress', label: 'Progress Charts', icon: 'TrendingUp' },
    { id: 'approach', label: 'Ayurvedic Approach', icon: 'Leaf' },
    { id: 'lifestyle', label: 'Lifestyle Changes', icon: 'Activity' }
  ];

  const getConditionColor = (condition) => {
    const colors = {
      'Diabetes Management': 'bg-blue-100 text-blue-800',
      'Digestive Health': 'bg-green-100 text-green-800',
      'Weight Optimization': 'bg-purple-100 text-purple-800',
      'Autoimmune Support': 'bg-orange-100 text-orange-800',
      'Cardiovascular Health': 'bg-red-100 text-red-800',
      'Mental Wellness': 'bg-indigo-100 text-indigo-800'
    };
    return colors?.[condition] || 'bg-gray-100 text-gray-800';
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'story':
        return (
          <div className="space-y-6">
            <div className="prose prose-lg max-w-none">
              <p className="text-text-secondary leading-relaxed">
                {story?.fullStory}
              </p>
            </div>
            <div className="bg-muted rounded-lg p-6">
              <h4 className="font-display font-semibold text-lg text-text-primary mb-3">
                Key Transformations
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {story?.transformations?.map((transformation, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Icon name="CheckCircle" size={20} className="text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-text-primary">
                        {transformation?.aspect}
                      </div>
                      <div className="text-sm text-text-secondary">
                        {transformation?.improvement}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'progress':
        return (
          <div className="space-y-6">
            {story?.progressData?.map((chart, index) => (
              <ProgressChart
                key={index}
                data={chart?.data}
                title={chart?.title}
                metric={chart?.metric}
                color={chart?.color}
              />
            ))}
          </div>
        );

      case 'approach':
        return (
          <div className="space-y-6">
            <div className="bg-brand-cream rounded-lg p-6">
              <h4 className="font-display font-semibold text-lg text-text-primary mb-4">
                Constitutional Analysis
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-primary mb-2">
                    {story?.doshaBalance?.primary}%
                  </div>
                  <div className="text-sm text-text-secondary">
                    {story?.dosha} (Primary)
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-accent mb-2">
                    {story?.doshaBalance?.secondary}%
                  </div>
                  <div className="text-sm text-text-secondary">
                    Secondary Dosha
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-secondary mb-2">
                    {story?.doshaBalance?.tertiary}%
                  </div>
                  <div className="text-sm text-text-secondary">
                    Tertiary Dosha
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-display font-semibold text-lg text-text-primary mb-4">
                Personalized Nutrition Plan
              </h4>
              <div className="space-y-4">
                {story?.nutritionPlan?.map((item, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="font-medium text-text-primary mb-2">
                      {item?.category}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {item?.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'lifestyle':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-display font-semibold text-lg text-text-primary mb-4">
                  Daily Routine Changes
                </h4>
                <div className="space-y-3">
                  {story?.lifestyleChanges?.daily?.map((change, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Icon name="Clock" size={16} className="text-primary mt-1" />
                      <div>
                        <div className="font-medium text-text-primary text-sm">
                          {change?.time}
                        </div>
                        <div className="text-sm text-text-secondary">
                          {change?.activity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-display font-semibold text-lg text-text-primary mb-4">
                  Seasonal Adjustments
                </h4>
                <div className="space-y-3">
                  {story?.lifestyleChanges?.seasonal?.map((change, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Icon name="Calendar" size={16} className="text-accent mt-1" />
                      <div>
                        <div className="font-medium text-text-primary text-sm">
                          {change?.season}
                        </div>
                        <div className="text-sm text-text-secondary">
                          {change?.adjustment}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-background rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden elevated-shadow">
        {/* Header */}
        <div className="relative">
          <div className="h-48 overflow-hidden">
            <Image
              src={story?.image}
              alt={`${story?.name}'s story`}
              className="w-full h-full object-cover"
            />
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 hover:bg-white"
            iconName="X"
          />
          
          <div className="absolute bottom-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getConditionColor(story?.condition)}`}>
              {story?.condition}
            </span>
          </div>
        </div>

        {/* Patient Info */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <Image
                src={story?.avatar}
                alt={story?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-display font-semibold text-2xl text-text-primary">
                {story?.name}
              </h2>
              <p className="text-text-secondary">
                {story?.age} years old • {story?.location} • {story?.dosha} Dominant
              </p>
              <p className="text-sm text-text-secondary mt-1">
                Journey Duration: {story?.journeyDuration}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex overflow-x-auto">
            {tabs?.map(tab => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 organic-transition ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {renderTabContent()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" iconName="Share2" iconPosition="left">
                Share Story
              </Button>
              <Button variant="ghost" size="sm" iconName="Heart" iconPosition="left">
                Inspire Others
              </Button>
            </div>
            <Button variant="default" className="bg-brand-gold hover:bg-brand-gold/90">
              Start Your Journey
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryModal;