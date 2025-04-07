
import React, { useState } from 'react';
import { 
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { historicalEmissions, predictionData } from '@/data/mockData';

interface PredictionModelProps {
  selectedRegion: string | null;
}

const PredictionModel: React.FC<PredictionModelProps> = ({ selectedRegion }) => {
  const [gasType, setGasType] = useState<'co2' | 'co' | 'ch4'>('co2');
  
  // Combine historical and prediction data for visualization
  const combinedData = [
    ...historicalEmissions.map(item => ({
      date: item.date,
      historical: item[gasType as keyof typeof item] as number,
      predicted: null,
      lowerBound: null,
      upperBound: null
    })),
    ...predictionData.map(item => {
      const gasData = item[gasType as keyof typeof item] as {
        predicted: number;
        lowerBound: number;
        upperBound: number;
      };
      
      return {
        date: item.date,
        historical: null,
        predicted: gasData.predicted,
        lowerBound: gasData.lowerBound,
        upperBound: gasData.upperBound
      };
    })
  ];

  const gasNames = {
    co2: 'CO₂',
    co: 'CO',
    ch4: 'CH₄'
  };

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          {selectedRegion 
            ? `${selectedRegion} ${gasNames[gasType]} Predictions` 
            : `Global ${gasNames[gasType]} Predictions`}
        </h3>
        <Select value={gasType} onValueChange={(value: any) => setGasType(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Gas Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="co2">CO₂</SelectItem>
            <SelectItem value="co">CO</SelectItem>
            <SelectItem value="ch4">CH₄</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <ResponsiveContainer width="100%" height={330}>
        <ComposedChart data={combinedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '8px',
              borderColor: '#ddd'
            }}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="upperBound"
            name="Upper Bound"
            stroke="none"
            fill="#4dabf7"
            fillOpacity={0.2}
          />
          <Area 
            type="monotone" 
            dataKey="lowerBound"
            name="Lower Bound"
            stroke="none"
            fill="#4dabf7"
            fillOpacity={0.2}
          />
          <Line 
            type="monotone" 
            dataKey="historical" 
            name="Historical Data"
            stroke="#6741d9" 
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line 
            type="monotone" 
            dataKey="predicted" 
            name="Predicted Data"
            stroke="#4dabf7" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
      
      <div className="mt-4 text-sm text-muted-foreground">
        <p>Prediction model based on historical data trends with ML regression analysis.</p>
        <p>Confidence interval: 95%</p>
      </div>
    </div>
  );
};

export default PredictionModel;
