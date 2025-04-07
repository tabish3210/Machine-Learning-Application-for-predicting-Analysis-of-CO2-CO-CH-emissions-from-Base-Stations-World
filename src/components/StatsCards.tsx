
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BaseStation } from '@/types';
import { TrendingUp, TrendingDown, ChartArea, ChartBar, ChartLine, Search } from 'lucide-react';

interface StatsCardsProps {
  stations: BaseStation[];
  selectedRegion: string | null;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stations, selectedRegion }) => {
  // Calculate statistics from the filtered stations
  const totalStations = stations.length;
  
  const avgEmissions = {
    co2: stations.reduce((sum, station) => sum + station.emissions.co2, 0) / totalStations,
    co: stations.reduce((sum, station) => sum + station.emissions.co, 0) / totalStations,
    ch4: stations.reduce((sum, station) => sum + station.emissions.ch4, 0) / totalStations,
  };
  
  const avgEfficiency = stations.reduce((sum, station) => sum + station.efficiency, 0) / totalStations;
  
  // Function to determine if value is above or below average (mocked trend)
  const getTrend = (value: number, threshold: number) => {
    return {
      direction: value > threshold ? 'up' : 'down',
      value: Math.abs(((value - threshold) / threshold) * 100).toFixed(1),
    };
  };
  
  // Mock trends (in a real app, these would be calculated from historical data)
  const co2Trend = getTrend(avgEmissions.co2, 55);
  const coTrend = getTrend(avgEmissions.co, 1.8);
  const ch4Trend = getTrend(avgEmissions.ch4, 0.75);
  const efficiencyTrend = getTrend(avgEfficiency, 78);
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average CO₂ Emissions</CardTitle>
          <ChartArea className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgEmissions.co2.toFixed(1)} tons/month</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {co2Trend.direction === 'up' ? (
              <>
                <TrendingUp className="mr-1 h-3 w-3 text-destructive" />
                <span className="text-destructive">{co2Trend.value}% increase</span>
              </>
            ) : (
              <>
                <TrendingDown className="mr-1 h-3 w-3 text-emission-low" />
                <span className="text-emission-low">{co2Trend.value}% decrease</span>
              </>
            )}
            <span className="ml-1">from average</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average CO Emissions</CardTitle>
          <ChartBar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgEmissions.co.toFixed(1)} tons/month</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {coTrend.direction === 'up' ? (
              <>
                <TrendingUp className="mr-1 h-3 w-3 text-destructive" />
                <span className="text-destructive">{coTrend.value}% increase</span>
              </>
            ) : (
              <>
                <TrendingDown className="mr-1 h-3 w-3 text-emission-low" />
                <span className="text-emission-low">{coTrend.value}% decrease</span>
              </>
            )}
            <span className="ml-1">from average</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average CH₄ Emissions</CardTitle>
          <ChartLine className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgEmissions.ch4.toFixed(2)} tons/month</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {ch4Trend.direction === 'up' ? (
              <>
                <TrendingUp className="mr-1 h-3 w-3 text-destructive" />
                <span className="text-destructive">{ch4Trend.value}% increase</span>
              </>
            ) : (
              <>
                <TrendingDown className="mr-1 h-3 w-3 text-emission-low" />
                <span className="text-emission-low">{ch4Trend.value}% decrease</span>
              </>
            )}
            <span className="ml-1">from average</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Station Efficiency</CardTitle>
          <Search className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgEfficiency.toFixed(1)}%</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {efficiencyTrend.direction === 'up' ? (
              <>
                <TrendingUp className="mr-1 h-3 w-3 text-emission-low" />
                <span className="text-emission-low">{efficiencyTrend.value}% increase</span>
              </>
            ) : (
              <>
                <TrendingDown className="mr-1 h-3 w-3 text-destructive" />
                <span className="text-destructive">{efficiencyTrend.value}% decrease</span>
              </>
            )}
            <span className="ml-1">from average</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
