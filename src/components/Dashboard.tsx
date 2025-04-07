
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmissionMap from './EmissionMap';
import EmissionTrends from './EmissionTrends';
import RegionalComparison from './RegionalComparison';
import PredictionModel from './PredictionModel';
import StationList from './StationList';
import StatsCards from './StatsCards';
import { baseStations, regionalData } from '@/data/mockData';

const Dashboard: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  
  const filteredStations = selectedRegion
    ? baseStations.filter(station => station.location.region === selectedRegion)
    : baseStations;
  
  const handleRegionSelect = (region: string | null) => {
    setSelectedRegion(region);
    setSelectedStation(null); // Reset selected station when changing regions
  };
  
  const handleStationSelect = (stationId: string | null) => {
    setSelectedStation(stationId);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">CO₂, CO, CH₄ Emissions Analysis</h1>
          <p className="text-sm opacity-80">Global Base Station Emissions Monitoring & Prediction</p>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto p-4 space-y-6">
        <StatsCards stations={filteredStations} selectedRegion={selectedRegion} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map and Region Selector */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Global Base Station Map</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <EmissionMap 
                stations={baseStations} 
                onRegionSelect={handleRegionSelect} 
                onStationSelect={handleStationSelect}
                selectedRegion={selectedRegion}
                selectedStation={selectedStation}
              />
            </CardContent>
          </Card>
          
          {/* Station List */}
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedRegion ? `${selectedRegion} Stations` : "All Base Stations"}
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[400px] overflow-auto">
              <StationList 
                stations={filteredStations}
                onStationSelect={handleStationSelect}
                selectedStation={selectedStation} 
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Analysis Tabs */}
        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trends">Emission Trends</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="regions">Regional Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historical Emission Trends</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <EmissionTrends selectedRegion={selectedRegion} selectedStation={selectedStation} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="predictions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Emission Predictions</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <PredictionModel selectedRegion={selectedRegion} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="regions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Regional Comparison</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <RegionalComparison regions={regionalData} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="bg-muted p-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Base Station Emissions Analysis Tool</p>
      </footer>
    </div>
  );
};

export default Dashboard;
