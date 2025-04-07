
import React, { useMemo } from 'react';
import { ChartContainer, ChartLegendContent, ChartTooltipContent } from '@/components/ui/chart';
import { 
  BarChart, Bar, LineChart, Line, ScatterChart, Scatter, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

interface SectorEmissionChartProps {
  sectorId: string;
  year?: string;
  emissionType: string;
  chartType: 'global' | 'byRegion' | 'trends' | 'stationIntensity' | 'efficiency';
}

const COLORS = ['#3b82f6', '#f97316', '#8b5cf6', '#10b981', '#ef4444'];

const SectorEmissionChart: React.FC<SectorEmissionChartProps> = ({ 
  sectorId, 
  year = '2023', 
  emissionType, 
  chartType 
}) => {
  // This would come from Supabase in a real application
  const globalTrendData = useMemo(() => [
    { year: '2018', co2: 8200, co: 92, ch4: 44 },
    { year: '2019', co2: 8400, co: 94, ch4: 45 },
    { year: '2020', co2: 7800, co: 88, ch4: 43 },
    { year: '2021', co2: 8300, co: 93, ch4: 46 },
    { year: '2022', co2: 8600, co: 96, ch4: 47 },
    { year: '2023', co2: 8800, co: 98, ch4: 48 },
  ], []);

  const regionData = useMemo(() => [
    { region: 'US', co2: 2300, co: 24, ch4: 8 },
    { region: 'Europe', co2: 1800, co: 18, ch4: 6 },
    { region: 'India', co2: 1400, co: 22, ch4: 12 },
    { region: 'China', co2: 2700, co: 28, ch4: 16 },
    { region: 'Rest of World', co2: 2600, co: 26, ch4: 14 },
  ], []);

  const stationIntensityData = useMemo(() => [
    { region: 'US', stations: 12, intensity: 192 },
    { region: 'Europe', stations: 16, intensity: 112 },
    { region: 'India', stations: 8, intensity: 175 },
    { region: 'China', stations: 20, intensity: 135 },
    { region: 'Rest of World', stations: 18, intensity: 144 },
  ], []);

  const efficiencyData = useMemo(() => [
    { region: 'US', efficiency: 87, emissions: 2300, stations: 12 },
    { region: 'Europe', efficiency: 92, emissions: 1800, stations: 16 },
    { region: 'India', efficiency: 84, emissions: 1400, stations: 8 },
    { region: 'China', efficiency: 81, emissions: 2700, stations: 20 },
    { region: 'Rest of World', efficiency: 79, emissions: 2600, stations: 18 },
  ], []);

  const renderChart = () => {
    if (chartType === 'global') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={globalTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
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
    
    if (chartType === 'byRegion') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={regionData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="region" />
            <PolarRadiusAxis />
            <Radar 
              name={emissionType === 'co2' ? 'CO₂' : emissionType === 'co' ? 'CO' : 'CH₄'} 
              dataKey={emissionType} 
              stroke={emissionType === 'co2' ? '#3b82f6' : emissionType === 'co' ? '#f97316' : '#8b5cf6'} 
              fill={emissionType === 'co2' ? '#3b82f680' : emissionType === 'co' ? '#f9731680' : '#8b5cf680'} 
              fillOpacity={0.6} 
            />
            <Legend content={<ChartLegendContent />} />
            <Tooltip content={<ChartTooltipContent />} />
          </RadarChart>
        </ResponsiveContainer>
      );
    }
    
    if (chartType === 'trends') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={globalTrendData}>
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
    
    if (chartType === 'stationIntensity') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <CartesianGrid />
            <XAxis type="number" dataKey="stations" name="Stations" />
            <YAxis type="number" dataKey="intensity" name="Intensity" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
            <Legend content={<ChartLegendContent />} />
            <Scatter 
              name="Regions" 
              data={stationIntensityData} 
              fill="#8884d8" 
              shape="circle"
            >
              {stationIntensityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      );
    }
    
    if (chartType === 'efficiency') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={efficiencyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="region" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend content={<ChartLegendContent />} />
            <Bar 
              yAxisId="left" 
              dataKey="efficiency" 
              name="Efficiency (%)" 
              fill="#10b981" 
            />
            <Bar 
              yAxisId="right" 
              dataKey="emissions" 
              name="Emissions" 
              fill="#ef4444" 
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
        efficiency: { color: '#10b981', label: 'Efficiency (%)' },
        emissions: { color: '#ef4444', label: 'Emissions' },
        intensity: { color: '#f59e0b', label: 'Emission Intensity' },
        stations: { color: '#6366f1', label: 'Stations' }
      }}
      className="w-full h-full"
    >
      {renderChart()}
    </ChartContainer>
  );
};

export default SectorEmissionChart;
