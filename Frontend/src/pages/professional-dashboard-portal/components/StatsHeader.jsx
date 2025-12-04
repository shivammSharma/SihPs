import React from 'react';

const StatCard = ({ value, label, valueClass = 'text-primary' }) => (
  <div className="bg-card rounded-lg p-4 text-center organic-shadow">
    <div className={`text-2xl font-bold ${valueClass}`}>{value}</div>
    <div className="text-sm text-text-secondary">{label}</div>
  </div>
);

const StatsHeader = ({ stats = {} }) => {
  const defaults = { daysActive: 45, wellnessScore: '78%', goals: 12, progress: '3.2kg' };
  const s = { ...defaults, ...stats };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <StatCard value={s.daysActive} label="Days Active" valueClass="text-primary" />
      <StatCard value={s.wellnessScore} label="Wellness Score" valueClass="text-secondary" />
      <StatCard value={s.goals} label="Goals Achieved" valueClass="text-accent" />
      <StatCard value={s.progress} label="Progress Made" valueClass="text-primary" />
    </div>
  );
};

export default StatsHeader;
