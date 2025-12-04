import React from 'react';
import Icon from '../../../components/AppIcon';

const DashboardNavbar = ({ active, onChange }) => {
  const tabs = [
    { id: 'overview', label: 'Wellness Overview', icon: 'Home' },
    { id: 'dashboard', label: 'Dashboard Home', icon: 'Grid' },
    { id: 'food-scan', label: 'Food Scan', icon: 'Camera' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart' },
    { id: 'sessions', label: 'Sessions', icon: 'Calendar' },
    { id: 'messages', label: 'Messages', icon: 'MessageCircle' },
  ];

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 bg-card rounded-xl p-2 organic-shadow">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium organic-transition ${
              active === tab.id ? 'bg-primary text-primary-foreground' : 'text-text-secondary hover:text-primary hover:bg-muted/50'
            }`}
          >
            <Icon name={tab.icon} size={16} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DashboardNavbar;
