
import React, { useMemo } from 'react';
import { ChartContainer, ChartLegendContent, ChartTooltipContent } from '@/components/ui/chart';
import { 
  BarChart, Bar, LineChart, Line, ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface EmissionComparisonChartProps {
  year?: string;
  emissionType: string;
  chartType: 'regional' | 'historical' | 'percapita';
}

const EmissionComparisonChart: React.FC<EmissionComparisonChartProps> = ({ 
  year = '2023', 
  emissionType, 
  chartType 
}) => {
  // This would come from Supabase in a real application
  const mockRegionalData = useMemo(() => [
    { region: 'US', co2: 5100, co: 58, ch4: 28, population: 331.9 },
    { region: 'Europe', co2: 3200, co: 42, ch4: 19, population: 447.7 },
    { region: 'India', co2: 2800, co: 62, ch4: 33, population: 1393 },
    { region: 'China', co2: 10500, co: 95, ch4: 55, population: 1412 },
    { region: 'Rest of World', co2: 7900, co: 73, ch4: 61, population: 4130 },
  ], []);

  const mockHistoricalData = useMemo(() => [
    { year: '2018', co2: 36000, co: 314, ch4: 190 },
    { year: '2019', co2: 36800, co: 321, ch4: 193 },
    { year: '2020', co2: 34500, co: 303, ch4: 189 },
    { year: '2021', co2: 36100, co: 318, ch4: 194 },
    { year: '2022', co2: 37200, co: 326, ch4: 196 },
    { year: '2023', co2: 37600, co: 330, ch4: 198 },
  ], []);

  const percapitaData = useMemo(() => 
    mockRegionalData.map(item => ({
      region: item.region,
      co2: parseFloat((item.co2 / item.population).toFixed(2)),
      co: parseFloat((item.co / item.population).toFixed(2)),
      ch4: parseFloat((item.ch4 / item.population).toFixed(2)),
    }))
  , [mockRegionalData]);

  const renderChart = () => {
    if (chartType === 'regional') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockRegionalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="region" />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend content={<ChartLegendContent />} />
            <Bar 
              dataKey={emissionType} 
              fill={emissionType === 'co2' ? '#3b82f6' : emissionType === 'co' ? '#f97316' : '#8b5cf6'} 
            />
          </BarChart>
        </ResponsiveContainer>
      );
    }
    
    if (chartType === 'historical') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockHistoricalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend content={<ChartLegendContent />} />
            <Line 
              type="monotone" 
              dataKey={emissionType} 
              stroke={emissionType === 'co2' ? '#3b82f6' : emissionType === 'co' ? '#f97316' : '#8b5cf6'} 
              strokeWidth={2} 
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }
    
    if (chartType === 'percapita') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={percapitaData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="region" />
            <YAxis />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend content={<ChartLegendContent />} />
            <Bar 
              dataKey={emissionType} 
              fill={emissionType === 'co2' ? '#3b82f6' : emissionType === 'co' ? '#f97316' : '#8b5cf6'} 
            />
          </ComposedChart>
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
      }}
      className="w-full h-full"
    >
      {renderChart()}
    </ChartContainer>
  );
};

export default EmissionComparisonChart;
