
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { RegionalData } from '@/types';

interface RegionalComparisonProps {
  regions: RegionalData[];
}

const RegionalComparison: React.FC<RegionalComparisonProps> = ({ regions }) => {
  const [emissionType, setEmissionType] = useState<'co2' | 'co' | 'ch4'>('co2');
  
  // Format data for the chart
  const chartData = regions.map(region => ({
    region: region.region,
    [emissionType]: region[emissionType as keyof RegionalData] as number,
    stationCount: region.stationCount
  }));

  const emissionNames = {
    co2: 'CO₂',
    co: 'CO',
    ch4: 'CH₄'
  };

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Regional {emissionNames[emissionType]} Comparison</h3>
        <Select value={emissionType} onValueChange={(value: any) => setEmissionType(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Emission Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="co2">CO₂</SelectItem>
            <SelectItem value="co">CO</SelectItem>
            <SelectItem value="ch4">CH₄</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <ResponsiveContainer width="100%" height={330}>
        <BarChart 
          data={chartData} 
          margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis 
            dataKey="region" 
            angle={-45} 
            textAnchor="end" 
            height={60}
          />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '8px',
              borderColor: '#ddd'
            }}
            formatter={(value, name) => {
              if (name === "stationCount") return [`${value} stations`, "Station Count"];
              return [`${value} tons/month`, emissionNames[emissionType as keyof typeof emissionNames]];
            }}
          />
          <Legend />
          <Bar
            yAxisId="left" 
            dataKey={emissionType} 
            name={`${emissionNames[emissionType]} Emissions`} 
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]}
          />
          <Bar
            yAxisId="right" 
            dataKey="stationCount" 
            name="Station Count" 
            fill="#f59e0b" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      
      <div className="mt-4 text-sm text-muted-foreground">
        <p>Regional comparison of {emissionNames[emissionType]} emissions against number of base stations.</p>
      </div>
    </div>
  );
};

export default RegionalComparison;
