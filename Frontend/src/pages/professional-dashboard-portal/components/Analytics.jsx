import React from 'react';

const Box = ({ title }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border">
    <h4 className="font-medium mb-3">{title}</h4>
    <div className="h-40 bg-gray-50 rounded flex items-center justify-center text-text-secondary">Chart Placeholder</div>
  </div>
);

const Analytics = () => {
  return (
    <section className="max-w-6xl mx-auto px-6 py-8">
      <div className="bg-beige p-8 rounded-xl">
        <h2 className="text-2xl font-semibold">Analytics</h2>
        <p className="text-text-secondary mt-1">Visual insights and nutrition analytics</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Box title="Calories vs Goal" />
          <Box title="Dosha Balance Trend" />
          <Box title="Diet Plan Adherence" />
        </div>
      </div>
    </section>
  );
};

export default Analytics;
