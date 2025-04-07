
import React, { useMemo, useEffect, useState } from 'react';
import { ChartContainer, ChartLegendContent, ChartTooltipContent } from '@/components/ui/chart';
import { 
  BarChart, Bar, LineChart, Line, ScatterChart, Scatter, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Cell
} from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface SectorEmissionChartProps {
  sectorId: string;
  year?: string;
  emissionType: string;
  chartType: 'global' | 'byRegion' | 'trends' | 'stationIntensity' | 'efficiency';
}

interface EmissionData {
  globalTrendData: any[];
  regionData: any[];
  stationIntensityData: any[];
  efficiencyData: any[];
  threats: any[];
  safetyMeasures: any[];
}

const COLORS = ['#3b82f6', '#f97316', '#8b5cf6', '#10b981', '#ef4444'];

const SectorEmissionChart: React.FC<SectorEmissionChartProps> = ({ 
  sectorId, 
  year = '2023', 
  emissionType, 
  chartType 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<EmissionData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase.functions.invoke('get-emission-data', {
          body: { year, emissionType, sector: sectorId }
        });

        if (error) {
          throw new Error(error.message);
        }

        setData(data);
      } catch (err) {
        console.error('Error fetching emission data:', err);
        setError('Failed to load emission data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sectorId, year, emissionType]);

  const renderChart = () => {
    if (loading) {
      return <Skeleton className="w-full h-full" />;
    }

    if (error || !data) {
      return (
        <Alert variant="destructive" className="h-full flex items-center justify-center">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription>{error || 'No data available'}</AlertDescription>
        </Alert>
      );
    }

    const { globalTrendData, regionData, stationIntensityData, efficiencyData } = data;

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
