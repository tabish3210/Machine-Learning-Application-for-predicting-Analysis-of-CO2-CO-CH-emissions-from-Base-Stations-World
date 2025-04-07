
import React, { useMemo } from 'react';
import { ChartContainer, ChartLegendContent, ChartTooltipContent } from '@/components/ui/chart';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

interface RegionalEmissionChartProps {
  regionId: string;
  year?: string;
  emissionType: string;
  chartType: 'trends' | 'sectors' | 'stations';
}

const COLORS = ['#3b82f6', '#f97316', '#8b5cf6', '#10b981', '#ef4444'];

const RegionalEmissionChart: React.FC<RegionalEmissionChartProps> = ({ 
  regionId, 
  year = '2023', 
  emissionType, 
  chartType 
}) => {
  // This would come from Supabase in a real application
  const trendData = useMemo(() => [
    { year: '2018', co2: 4800, co: 54, ch4: 26 },
    { year: '2019', co2: 4900, co: 55, ch4: 27 },
    { year: '2020', co2: 4200, co: 48, ch4: 24 },
    { year: '2021', co2: 4600, co: 52, ch4: 26 },
    { year: '2022', co2: 4950, co: 56, ch4: 27 },
    { year: '2023', co2: 5100, co: 58, ch4: 28 },
  ], []);

  const sectorData = useMemo(() => [
    { name: 'Energy', co2: 2300, co: 24, ch4: 8 },
    { name: 'Transport', co2: 1400, co: 18, ch4: 5 },
    { name: 'Industry', co2: 850, co: 7, ch4: 4 },
    { name: 'Residential', co2: 400, co: 6, ch4: 7 },
    { name: 'Agriculture', co2: 150, co: 3, ch4: 4 },
  ], []);

  const stationData = useMemo(() => [
    { name: 'Station A', co2: 128, co: 1.8, ch4: 0.9, efficiency: 87 },
    { name: 'Station B', co2: 105, co: 1.4, ch4: 0.7, efficiency: 92 },
    { name: 'Station C', co2: 143, co: 2.1, ch4: 1.1, efficiency: 84 },
    { name: 'Station D', co2: 98, co: 1.2, ch4: 0.6, efficiency: 95 },
    { name: 'Station E', co2: 135, co: 1.9, ch4: 1.0, efficiency: 86 },
  ], []);

  const renderChart = () => {
    if (chartType === 'trends') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend content={<ChartLegendContent />} />
            <Area 
              type="monotone" 
              dataKey={emissionType} 
              stroke={emissionType === 'co2' ? '#3b82f6' : emissionType === 'co' ? '#f97316' : '#8b5cf6'} 
              fill={emissionType === 'co2' ? '#3b82f680' : emissionType === 'co' ? '#f9731680' : '#8b5cf680'}
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    }
    
    if (chartType === 'sectors') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sectorData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={150}
              fill="#8884d8"
              dataKey={emissionType}
            >
              {sectorData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltipContent />} />
            <Legend content={<ChartLegendContent />} />
          </PieChart>
        </ResponsiveContainer>
      );
    }
    
    if (chartType === 'stations') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend content={<ChartLegendContent />} />
            <Bar 
              yAxisId="left" 
              dataKey={emissionType} 
              name={emissionType.toUpperCase()}
              fill={emissionType === 'co2' ? '#3b82f6' : emissionType === 'co' ? '#f97316' : '#8b5cf6'} 
            />
            <Bar 
              yAxisId="right" 
              dataKey="efficiency" 
              name="Efficiency" 
              fill="#10b981" 
            />
          </BarChart>
        </ResponsiveContainer>
      );
    }
    
    return null;
  };

  return (
    <ChartContainer 
      config={{
        co2: { color: '#3b82f6', label: 'CO₂' },
        co: { color: '#f97316', label: 'CO' },
        ch4: { color: '#8b5cf6', label: 'CH₄' },
        efficiency: { color: '#10b981', label: 'Efficiency' },
      }}
      className="w-full h-full"
    >
      {renderChart()}
    </ChartContainer>
  );
};

export default RegionalEmissionChart;
