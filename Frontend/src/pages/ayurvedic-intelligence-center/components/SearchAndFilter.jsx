import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const SearchAndFilter = ({ onSearch, onFilter }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDosha, setSelectedDosha] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const doshaOptions = [
    { value: '', label: 'All Doshas' },
    { value: 'vata', label: 'Vata Constitution' },
    { value: 'pitta', label: 'Pitta Constitution' },
    { value: 'kapha', label: 'Kapha Constitution' },
    { value: 'vata-pitta', label: 'Vata-Pitta' },
    { value: 'pitta-kapha', label: 'Pitta-Kapha' },
    { value: 'vata-kapha', label: 'Vata-Kapha' }
  ];

  const conditionOptions = [
    { value: '', label: 'All Conditions' },
    { value: 'diabetes', label: 'Diabetes Management' },
    { value: 'hypertension', label: 'Hypertension' },
    { value: 'digestive', label: 'Digestive Disorders' },
    { value: 'arthritis', label: 'Arthritis & Joint Pain' },
    { value: 'anxiety', label: 'Anxiety & Stress' },
    { value: 'insomnia', label: 'Sleep Disorders' },
    { value: 'weight', label: 'Weight Management' },
    { value: 'skin', label: 'Skin Conditions' },
    { value: 'respiratory', label: 'Respiratory Issues' },
    { value: 'hormonal', label: 'Hormonal Imbalances' }
  ];

  const goalOptions = [
    { value: '', label: 'All Goals' },
    { value: 'weight-loss', label: 'Weight Loss' },
    { value: 'weight-gain', label: 'Weight Gain' },
    { value: 'muscle-building', label: 'Muscle Building' },
    { value: 'detox', label: 'Detoxification' },
    { value: 'immunity', label: 'Immunity Boost' },
    { value: 'energy', label: 'Energy Enhancement' },
    { value: 'longevity', label: 'Longevity & Anti-aging' },
    { value: 'mental-clarity', label: 'Mental Clarity' },
    { value: 'digestive-health', label: 'Digestive Health' },
    { value: 'hormonal-balance', label: 'Hormonal Balance' }
  ];

  const handleSearch = (e) => {
    e?.preventDefault();
    const filters = {
      query: searchQuery,
      dosha: selectedDosha,
      condition: selectedCondition,
      goal: selectedGoal
    };
    onSearch && onSearch(filters);
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedDosha('');
    setSelectedCondition('');
    setSelectedGoal('');
    const filters = {
      query: '',
      dosha: '',
      condition: '',
      goal: ''
    };
    onFilter && onFilter(filters);
  };

  const quickSearches = [
    { label: 'Vata Balancing Foods', filters: { dosha: 'vata', query: 'balancing foods' } },
    { label: 'Pitta Cooling Diet', filters: { dosha: 'pitta', query: 'cooling' } },
    { label: 'Kapha Weight Loss', filters: { dosha: 'kapha', goal: 'weight-loss' } },
    { label: 'Digestive Spices', filters: { condition: 'digestive', query: 'spices' } },
    { label: 'Immunity Boosters', filters: { goal: 'immunity', query: 'boost' } },
    { label: 'Seasonal Eating', filters: { query: 'seasonal' } }
  ];

  const handleQuickSearch = (filters) => {
    setSearchQuery(filters?.query || '');
    setSelectedDosha(filters?.dosha || '');
    setSelectedCondition(filters?.condition || '');
    setSelectedGoal(filters?.goal || '');
    onFilter && onFilter(filters);
  };

  return (
    <div className="bg-background rounded-2xl organic-shadow">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-semibold text-primary">
            Search Knowledge Base
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            iconName={isAdvancedOpen ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            Advanced Filters
          </Button>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          {/* Main Search */}
          <div className="relative">
            <Input
              type="search"
              placeholder="Search by food, condition, dosha, or Sanskrit term..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              className="pr-12"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary organic-transition"
            >
              <Icon name="Search" size={20} />
            </button>
          </div>

          {/* Advanced Filters */}
          {isAdvancedOpen && (
            <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-border">
              <Select
                label="Dosha Type"
                options={doshaOptions}
                value={selectedDosha}
                onChange={setSelectedDosha}
                placeholder="Filter by dosha"
              />
              
              <Select
                label="Health Condition"
                options={conditionOptions}
                value={selectedCondition}
                onChange={setSelectedCondition}
                placeholder="Filter by condition"
                searchable
              />
              
              <Select
                label="Nutritional Goal"
                options={goalOptions}
                value={selectedGoal}
                onChange={setSelectedGoal}
                placeholder="Filter by goal"
                searchable
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              className="flex-1"
              iconName="Search"
              iconPosition="left"
            >
              Search Knowledge Base
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              iconName="RotateCcw"
              iconPosition="left"
            >
              Reset Filters
            </Button>
          </div>
        </form>
      </div>
      {/* Quick Searches */}
      <div className="p-6">
        <h3 className="font-semibold text-primary mb-3 flex items-center">
          <Icon name="Zap" size={18} className="mr-2" />
          Quick Searches
        </h3>
        <div className="flex flex-wrap gap-2">
          {quickSearches?.map((search, index) => (
            <button
              key={index}
              onClick={() => handleQuickSearch(search?.filters)}
              className="px-3 py-2 bg-muted hover:bg-brand-sage/20 hover:text-brand-sage rounded-full text-sm organic-transition"
            >
              {search?.label}
            </button>
          ))}
        </div>
      </div>
      {/* Search Tips */}
      <div className="px-6 pb-6">
        <div className="bg-brand-cream/50 rounded-xl p-4 border border-brand-gold/20">
          <h4 className="font-semibold text-primary mb-2 flex items-center">
            <Icon name="Lightbulb" size={16} className="mr-2 text-brand-gold" />
            Search Tips
          </h4>
          <div className="grid sm:grid-cols-2 gap-3 text-sm text-text-secondary">
            <div>
              <span className="font-medium text-primary">Sanskrit Terms: </span>
              Try "agni", "ama", "ojas", "tejas"
            </div>
            <div>
              <span className="font-medium text-primary">Food Categories: </span>
              "warming foods", "cooling herbs", "grounding meals"
            </div>
            <div>
              <span className="font-medium text-primary">Conditions: </span>
              "high pitta", "vata imbalance", "kapha excess"
            </div>
            <div>
              <span className="font-medium text-primary">Combinations: </span>
              "ginger + honey", "incompatible foods"
            </div>
          </div>
        </div>
      </div>
      {/* Recent Searches */}
      <div className="px-6 pb-6">
        <h4 className="font-semibold text-primary mb-3 flex items-center">
          <Icon name="Clock" size={16} className="mr-2" />
          Recent Searches
        </h4>
        <div className="flex flex-wrap gap-2">
          {[
            'Vata balancing breakfast',
            'Turmeric benefits',
            'Seasonal detox',
            'Digestive tea recipes',
            'Cooling foods summer'
          ]?.map((search, index) => (
            <button
              key={index}
              onClick={() => setSearchQuery(search)}
              className="px-3 py-1 bg-muted/50 hover:bg-muted rounded-full text-sm text-text-secondary hover:text-primary organic-transition"
            >
              {search}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter;