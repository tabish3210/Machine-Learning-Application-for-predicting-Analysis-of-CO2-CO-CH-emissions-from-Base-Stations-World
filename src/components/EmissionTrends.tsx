
import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Card, CardContent } from "@/components/ui/card";
import { historicalEmissions } from '@/data/mockData';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface EmissionTrendsProps {
  selectedRegion: string | null;
  selectedStation: string | null;
}

const EmissionTrends: React.FC<EmissionTrendsProps> = ({ selectedRegion, selectedStation }) => {
  const [gasType, setGasType] = useState<'all' | 'co2' | 'co' | 'ch4'>('all');

  // In a real application, you would filter the data based on the selected region or station
  // For this mock, we'll just use the same data
  const data = historicalEmissions;

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          {selectedRegion 
            ? `${selectedRegion} Emission Trends` 
            : `Global Emission Trends`}
        </h3>
        <Select value={gasType} onValueChange={(value: any) => setGasType(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Gas Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Gases</SelectItem>
            <SelectItem value="co2">CO₂</SelectItem>
            <SelectItem value="co">CO</SelectItem>
            <SelectItem value="ch4">CH₄</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <ResponsiveContainer width="100%" height={330}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '8px',
              borderColor: '#ddd'
            }}
          />
          <Legend />
          {(gasType === 'all' || gasType === 'co2') && (
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="co2" 
              name="CO₂ (tons/month)"
              stroke="#ff6b6b" 
              activeDot={{ r: 8 }}
              strokeWidth={2}
            />
          )}
          {(gasType === 'all' || gasType === 'co') && (
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="co" 
              name="CO (tons/month)"
              stroke="#4dabf7" 
              strokeWidth={2}
            />
          )}
          {(gasType === 'all' || gasType === 'ch4') && (
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="ch4" 
              name="CH₄ (tons/month)"
              stroke="#6741d9" 
              strokeWidth={2}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmissionTrends;
