import React from 'react';

import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterSidebar = ({ filters, onFilterChange, onClearFilters, isOpen, onToggle }) => {
  const conditionOptions = [
    'Diabetes Management',
    'Digestive Health',
    'Weight Optimization',
    'Autoimmune Support',
    'Cardiovascular Health',
    'Mental Wellness'
  ];

  const doshaOptions = ['Vata', 'Pitta', 'Kapha'];
  
  const ageRanges = [
    '20-30 years',
    '31-40 years',
    '41-50 years',
    '51-60 years',
    '60+ years'
  ];

  const journeyDurations = [
    '1-3 months',
    '3-6 months',
    '6-12 months',
    '1+ years'
  ];

  const handleConditionChange = (condition, checked) => {
    const newConditions = checked
      ? [...filters?.conditions, condition]
      : filters?.conditions?.filter(c => c !== condition);
    onFilterChange({ ...filters, conditions: newConditions });
  };

  const handleDoshaChange = (dosha, checked) => {
    const newDoshas = checked
      ? [...filters?.doshas, dosha]
      : filters?.doshas?.filter(d => d !== dosha);
    onFilterChange({ ...filters, doshas: newDoshas });
  };

  const handleAgeChange = (age, checked) => {
    const newAges = checked
      ? [...filters?.ageRanges, age]
      : filters?.ageRanges?.filter(a => a !== age);
    onFilterChange({ ...filters, ageRanges: newAges });
  };

  const handleDurationChange = (duration, checked) => {
    const newDurations = checked
      ? [...filters?.durations, duration]
      : filters?.durations?.filter(d => d !== duration);
    onFilterChange({ ...filters, durations: newDurations });
  };

  const FilterSection = ({ title, children }) => (
    <div className="mb-6">
      <h4 className="font-display font-semibold text-text-primary mb-3">
        {title}
      </h4>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-6">
        <Button
          variant="outline"
          onClick={onToggle}
          iconName="Filter"
          iconPosition="left"
          fullWidth
        >
          Filters {(filters?.conditions?.length + filters?.doshas?.length + filters?.ageRanges?.length + filters?.durations?.length) > 0 && 
            `(${filters?.conditions?.length + filters?.doshas?.length + filters?.ageRanges?.length + filters?.durations?.length})`}
        </Button>
      </div>
      {/* Filter Sidebar */}
      <div className={`lg:block ${isOpen ? 'block' : 'hidden'} bg-card rounded-xl p-6 organic-shadow lg:sticky lg:top-24`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-semibold text-lg text-text-primary">
            Filter Stories
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
          >
            Clear All
          </Button>
        </div>

        {/* Health Conditions */}
        <FilterSection title="Health Conditions">
          {conditionOptions?.map(condition => (
            <Checkbox
              key={condition}
              label={condition}
              checked={filters?.conditions?.includes(condition)}
              onChange={(e) => handleConditionChange(condition, e?.target?.checked)}
            />
          ))}
        </FilterSection>

        {/* Constitutional Types */}
        <FilterSection title="Constitutional Type">
          {doshaOptions?.map(dosha => (
            <Checkbox
              key={dosha}
              label={`${dosha} Dominant`}
              checked={filters?.doshas?.includes(dosha)}
              onChange={(e) => handleDoshaChange(dosha, e?.target?.checked)}
            />
          ))}
        </FilterSection>

        {/* Age Range */}
        <FilterSection title="Age Range">
          {ageRanges?.map(age => (
            <Checkbox
              key={age}
              label={age}
              checked={filters?.ageRanges?.includes(age)}
              onChange={(e) => handleAgeChange(age, e?.target?.checked)}
            />
          ))}
        </FilterSection>

        {/* Journey Duration */}
        <FilterSection title="Journey Duration">
          {journeyDurations?.map(duration => (
            <Checkbox
              key={duration}
              label={duration}
              checked={filters?.durations?.includes(duration)}
              onChange={(e) => handleDurationChange(duration, e?.target?.checked)}
            />
          ))}
        </FilterSection>

        {/* Mobile Close Button */}
        <div className="lg:hidden mt-6">
          <Button
            variant="default"
            fullWidth
            onClick={onToggle}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;