import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ResearchTools = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    studyType: '',
    healthCondition: '',
    publicationYear: '',
    significance: ''
  });

  const studyTypeOptions = [
    { value: '', label: 'All Study Types' },
    { value: 'rct', label: 'Randomized Controlled Trial' },
    { value: 'cohort', label: 'Cohort Study' },
    { value: 'case-control', label: 'Case-Control Study' },
    { value: 'systematic-review', label: 'Systematic Review' },
    { value: 'meta-analysis', label: 'Meta-Analysis' }
  ];

  const healthConditionOptions = [
    { value: '', label: 'All Conditions' },
    { value: 'diabetes', label: 'Diabetes' },
    { value: 'hypertension', label: 'Hypertension' },
    { value: 'obesity', label: 'Obesity' },
    { value: 'anxiety', label: 'Anxiety & Depression' },
    { value: 'digestive', label: 'Digestive Disorders' },
    { value: 'autoimmune', label: 'Autoimmune Conditions' },
    { value: 'cardiovascular', label: 'Cardiovascular Disease' }
  ];

  const publicationYearOptions = [
    { value: '', label: 'All Years' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' },
    { value: 'older', label: 'Before 2020' }
  ];

  const significanceOptions = [
    { value: '', label: 'All Significance Levels' },
    { value: 'p001', label: 'p < 0.001 (Highly Significant)' },
    { value: 'p01', label: 'p < 0.01 (Very Significant)' },
    { value: 'p05', label: 'p < 0.05 (Significant)' },
    { value: 'ns', label: 'Not Significant' }
  ];

  const tools = [
    {
      name: 'Advanced Search',
      icon: 'Search',
      description: 'Search across titles, abstracts, authors, and keywords',
      color: 'primary'
    },
    {
      name: 'Citation Generator',
      icon: 'Quote',
      description: 'Generate APA, MLA, or Chicago style citations',
      color: 'secondary'
    },
    {
      name: 'Research Alerts',
      icon: 'Bell',
      description: 'Get notified of new studies in your areas of interest',
      color: 'accent'
    },
    {
      name: 'Bookmark Manager',
      icon: 'Bookmark',
      description: 'Save and organize studies for easy reference',
      color: 'primary'
    },
    {
      name: 'Export Tools',
      icon: 'Download',
      description: 'Export search results to various formats',
      color: 'secondary'
    },
    {
      name: 'Collaboration Hub',
      icon: 'Users',
      description: 'Share research collections with colleagues',
      color: 'accent'
    }
  ];

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      studyType: '',
      healthCondition: '',
      publicationYear: '',
      significance: ''
    });
    setSearchQuery('');
  };

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-text-primary mb-4">
            Research Tools & Filters
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Powerful tools to help you discover, organize, and cite relevant research 
            for your clinical practice and academic work.
          </p>
        </div>

        {/* Search and Filter Interface */}
        <div className="bg-card border border-border rounded-xl p-6 lg:p-8 organic-shadow mb-12">
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Input
                type="search"
                placeholder="Search studies by title, author, keywords, or DOI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="pl-12"
              />
              <Icon 
                name="Search" 
                size={20} 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" 
              />
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select
                label="Study Type"
                options={studyTypeOptions}
                value={selectedFilters?.studyType}
                onChange={(value) => handleFilterChange('studyType', value)}
                placeholder="Select study type"
              />
              
              <Select
                label="Health Condition"
                options={healthConditionOptions}
                value={selectedFilters?.healthCondition}
                onChange={(value) => handleFilterChange('healthCondition', value)}
                placeholder="Select condition"
              />
              
              <Select
                label="Publication Year"
                options={publicationYearOptions}
                value={selectedFilters?.publicationYear}
                onChange={(value) => handleFilterChange('publicationYear', value)}
                placeholder="Select year"
              />
              
              <Select
                label="Statistical Significance"
                options={significanceOptions}
                value={selectedFilters?.significance}
                onChange={(value) => handleFilterChange('significance', value)}
                placeholder="Select significance"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-between items-center">
              <div className="flex gap-3">
                <Button variant="default" iconName="Search" iconPosition="left">
                  Search Studies
                </Button>
                <Button variant="outline" iconName="Filter" iconPosition="left">
                  Advanced Filters
                </Button>
              </div>
              
              <Button variant="ghost" onClick={clearFilters} iconName="X" iconPosition="left">
                Clear All Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Research Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tools?.map((tool, index) => (
            <div key={index} className="bg-card border border-border rounded-xl p-6 organic-shadow hover:elevated-shadow organic-transition">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${tool?.color}/10`}>
                  <Icon name={tool?.icon} size={24} className={`text-${tool?.color}`} />
                </div>
                <Button variant="ghost" size="sm" iconName="ArrowUpRight">
                  Launch
                </Button>
              </div>
              
              <h3 className="text-lg font-display font-semibold text-text-primary mb-2">
                {tool?.name}
              </h3>
              
              <p className="text-sm text-text-secondary leading-relaxed">
                {tool?.description}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Access Features */}
        <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-6 lg:p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-display font-semibold text-text-primary mb-2">
              Quick Access Features
            </h3>
            <p className="text-text-secondary">
              Streamline your research workflow with these convenient tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" fullWidth iconName="TrendingUp" iconPosition="left">
              Most Cited Studies
            </Button>
            <Button variant="outline" fullWidth iconName="Clock" iconPosition="left">
              Recently Published
            </Button>
            <Button variant="outline" fullWidth iconName="Star" iconPosition="left">
              Editor's Picks
            </Button>
            <Button variant="outline" fullWidth iconName="Zap" iconPosition="left">
              Breakthrough Research
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResearchTools;