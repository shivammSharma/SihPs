import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const ProgressChart = ({ data, title, metric, color = "#2D5016" }) => {
  const formatTooltip = (value, name) => {
    if (name === 'value') {
      return [value, metric];
    }
    return [value, name];
  };

  return (
    <div className="bg-card rounded-lg p-6 organic-shadow">
      <h4 className="font-display font-semibold text-lg text-text-primary mb-4">
        {title}
      </h4>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E3D8" />
            <XAxis 
              dataKey="month" 
              stroke="#4A5568"
              fontSize={12}
            />
            <YAxis 
              stroke="#4A5568"
              fontSize={12}
            />
            <Tooltip 
              formatter={formatTooltip}
              labelStyle={{ color: '#1A1A1A' }}
              contentStyle={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E8E3D8',
                borderRadius: '8px'
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#gradient-${metric})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart;