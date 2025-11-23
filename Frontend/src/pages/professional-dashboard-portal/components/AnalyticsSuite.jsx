import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const AnalyticsSuite = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('3months');
  const [selectedMetric, setSelectedMetric] = useState('outcomes');

  const timeframeOptions = [
    { value: '1month', label: 'Last Month' },
    { value: '3months', label: 'Last 3 Months' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '1year', label: 'Last Year' }
  ];

  const metricOptions = [
    { value: 'outcomes', label: 'Patient Outcomes' },
    { value: 'interventions', label: 'Intervention Effectiveness' },
    { value: 'seasonal', label: 'Seasonal Patterns' },
    { value: 'dosha', label: 'Dosha Distribution' }
  ];

  const patientOutcomeData = [
    { month: 'Jun', improved: 85, stable: 12, declined: 3 },
    { month: 'Jul', improved: 78, stable: 18, declined: 4 },
    { month: 'Aug', improved: 92, stable: 6, declined: 2 },
    { month: 'Sep', improved: 88, stable: 10, declined: 2 }
  ];

  const doshaEffectivenessData = [
    { dosha: 'Vata', success: 87, total: 45 },
    { dosha: 'Pitta', success: 92, total: 38 },
    { dosha: 'Kapha', success: 79, total: 32 },
    { dosha: 'Vata-Pitta', success: 85, total: 28 },
    { dosha: 'Pitta-Kapha', success: 90, total: 22 },
    { dosha: 'Kapha-Vata', success: 83, total: 18 }
  ];

  const seasonalHealthData = [
    { season: 'Spring', digestive: 78, respiratory: 65, joint: 82, energy: 88 },
    { season: 'Summer', digestive: 85, respiratory: 72, joint: 75, energy: 82 },
    { season: 'Monsoon', digestive: 72, respiratory: 58, joint: 68, energy: 75 },
    { season: 'Autumn', digestive: 88, respiratory: 85, joint: 90, energy: 92 }
  ];

  const doshaDistributionData = [
    { name: 'Vata', value: 35, color: '#3B82F6' },
    { name: 'Pitta', value: 30, color: '#EF4444' },
    { name: 'Kapha', value: 25, color: '#10B981' },
    { name: 'Mixed', value: 10, color: '#F59E0B' }
  ];

  const practiceInsights = [
    {
      id: 1,
      title: "Most Effective Intervention",
      value: "Personalized Meal Plans",
      change: "+15%",
      trend: "up",
      description: "Compared to standard dietary advice"
    },
    {
      id: 2,
      title: "Average Treatment Duration",
      value: "8.5 weeks",
      change: "-2.3 weeks",
      trend: "down",
      description: "Reduced from previous quarter"
    },
    {
      id: 3,
      title: "Patient Satisfaction",
      value: "94.2%",
      change: "+3.8%",
      trend: "up",
      description: "Based on post-treatment surveys"
    },
    {
      id: 4,
      title: "Plan Adherence Rate",
      value: "87.6%",
      change: "+5.2%",
      trend: "up",
      description: "Patients following prescribed plans"
    }
  ];

  const topConditions = [
    { condition: "Digestive Issues", patients: 42, successRate: 89 },
    { condition: "Weight Management", patients: 38, successRate: 85 },
    { condition: "Stress & Anxiety", patients: 35, successRate: 92 },
    { condition: "Joint Health", patients: 28, successRate: 78 },
    { condition: "Sleep Disorders", patients: 25, successRate: 88 },
    { condition: "Metabolic Health", patients: 22, successRate: 91 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-primary">Analytics Suite</h2>
          <p className="text-text-secondary">Practice-wide insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select
            options={timeframeOptions}
            value={selectedTimeframe}
            onChange={setSelectedTimeframe}
            className="w-40"
          />
          <Button variant="outline" iconName="Download">
            Export Report
          </Button>
        </div>
      </div>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {practiceInsights?.map((insight) => (
          <div key={insight?.id} className="bg-card rounded-lg p-4 border border-border organic-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-text-secondary">{insight?.title}</h3>
              <Icon 
                name={insight?.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                size={16} 
                className={insight?.trend === 'up' ? 'text-success' : 'text-warning'} 
              />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold text-text-primary">{insight?.value}</p>
                <p className="text-xs text-text-secondary mt-1">{insight?.description}</p>
              </div>
              <span className={`text-sm font-medium ${
                insight?.trend === 'up' ? 'text-success' : 'text-warning'
              }`}>
                {insight?.change}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Outcomes Chart */}
        <div className="bg-card rounded-lg border border-border organic-shadow">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary">Patient Outcomes Trend</h3>
              <Select
                options={metricOptions}
                value={selectedMetric}
                onChange={setSelectedMetric}
                className="w-48"
              />
            </div>
          </div>
          <div className="p-4">
            <div className="w-full h-64" aria-label="Patient Outcomes Bar Chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={patientOutcomeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8E3D8" />
                  <XAxis dataKey="month" stroke="#4A5568" />
                  <YAxis stroke="#4A5568" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      border: '1px solid #E8E3D8',
                      borderRadius: '6px'
                    }} 
                  />
                  <Bar dataKey="improved" fill="#22543D" name="Improved" />
                  <Bar dataKey="stable" fill="#D4AF37" name="Stable" />
                  <Bar dataKey="declined" fill="#9B2C2C" name="Declined" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Dosha Distribution */}
        <div className="bg-card rounded-lg border border-border organic-shadow">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold text-text-primary">Patient Dosha Distribution</h3>
          </div>
          <div className="p-4">
            <div className="w-full h-64" aria-label="Dosha Distribution Pie Chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={doshaDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {doshaDistributionData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry?.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {doshaDistributionData?.map((item) => (
                <div key={item?.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item?.color }}
                  ></div>
                  <span className="text-sm text-text-secondary">{item?.name}: {item?.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dosha Effectiveness */}
        <div className="bg-card rounded-lg border border-border organic-shadow">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold text-text-primary">Treatment Effectiveness by Dosha</h3>
          </div>
          <div className="p-4 space-y-3">
            {doshaEffectivenessData?.map((item) => (
              <div key={item?.dosha} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-text-primary w-20">{item?.dosha}</span>
                  <div className="flex-1 bg-muted rounded-full h-2 w-32">
                    <div
                      className="bg-primary h-2 rounded-full organic-transition"
                      style={{ width: `${item?.success}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-text-primary">{item?.success}%</span>
                  <span className="text-xs text-text-secondary ml-2">({item?.total} patients)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seasonal Health Patterns */}
        <div className="bg-card rounded-lg border border-border organic-shadow">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold text-text-primary">Seasonal Health Patterns</h3>
          </div>
          <div className="p-4">
            <div className="w-full h-64" aria-label="Seasonal Health Patterns Line Chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={seasonalHealthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8E3D8" />
                  <XAxis dataKey="season" stroke="#4A5568" />
                  <YAxis stroke="#4A5568" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      border: '1px solid #E8E3D8',
                      borderRadius: '6px'
                    }} 
                  />
                  <Line type="monotone" dataKey="digestive" stroke="#2D5016" name="Digestive" />
                  <Line type="monotone" dataKey="respiratory" stroke="#D4AF37" name="Respiratory" />
                  <Line type="monotone" dataKey="joint" stroke="#87A96B" name="Joint Health" />
                  <Line type="monotone" dataKey="energy" stroke="#22543D" name="Energy Levels" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      {/* Top Conditions */}
      <div className="bg-card rounded-lg border border-border organic-shadow">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-text-primary">Most Treated Conditions</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topConditions?.map((condition, index) => (
              <div key={condition?.condition} className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-text-primary">{condition?.condition}</h4>
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                    #{index + 1}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">{condition?.patients} patients</span>
                  <span className="font-semibold text-success">{condition?.successRate}% success</span>
                </div>
                <div className="mt-2 bg-muted rounded-full h-2">
                  <div
                    className="bg-success h-2 rounded-full organic-transition"
                    style={{ width: `${condition?.successRate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSuite;