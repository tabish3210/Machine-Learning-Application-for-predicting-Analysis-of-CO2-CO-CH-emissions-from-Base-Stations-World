
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmissionMap from './EmissionMap';
import EmissionTrends from './EmissionTrends';
import RegionalComparison from './RegionalComparison';
import PredictionModel from './PredictionModel';
import StationList from './StationList';
import StatsCards from './StatsCards';
import { baseStations, regionalData } from '@/data/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "./ui/badge";

const Dashboard: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [emissionType, setEmissionType] = useState<string>("co2");
  const [timeRange, setTimeRange] = useState<string>("month");
  
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

  // Function to get header style based on emission type
  const getHeaderStyle = () => {
    switch(emissionType) {
      case "co2": return "bg-gradient-to-r from-blue-800 to-blue-600";
      case "co": return "bg-gradient-to-r from-amber-700 to-amber-500";
      case "ch4": return "bg-gradient-to-r from-purple-800 to-purple-600";
      default: return "bg-gradient-to-r from-primary-800 to-primary-600";
    }
  };

  // Function to get emission type display name
  const getEmissionDisplayName = () => {
    switch(emissionType) {
      case "co2": return "Carbon Dioxide (CO₂)";
      case "co": return "Carbon Monoxide (CO)";
      case "ch4": return "Methane (CH₄)";
      default: return "Emissions";
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className={`${getHeaderStyle()} text-white p-6 shadow-lg`}>
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Global {getEmissionDisplayName()} Monitoring
              </h1>
              <p className="text-sm opacity-90 mt-1 max-w-2xl">
                Analyze and predict emission patterns across base stations worldwide.
                Track environmental impact and identify opportunities for reduction strategies.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={emissionType} onValueChange={setEmissionType}>
                <SelectTrigger className="w-[160px] bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Emission Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="co2">Carbon Dioxide (CO₂)</SelectItem>
                  <SelectItem value="co">Carbon Monoxide (CO)</SelectItem>
                  <SelectItem value="ch4">Methane (CH₄)</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[140px] bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Last 24 Hours</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {selectedRegion && (
            <div className="mt-4 animate-fade-in">
              <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white">
                Viewing: {selectedRegion} Region
              </Badge>
              <button 
                className="text-xs ml-2 text-white/80 hover:text-white underline"
                onClick={() => handleRegionSelect(null)}
              >
                Clear Selection
              </button>
            </div>
          )}
        </div>
      </header>
      
      <main className="flex-1 container mx-auto p-4 sm:p-6 space-y-6">
        <StatsCards stations={filteredStations} selectedRegion={selectedRegion} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map and Region Selector */}
          <Card className="lg:col-span-2 border shadow-md overflow-hidden">
            <CardHeader className="bg-muted/30">
              <CardTitle>Global Base Station Map</CardTitle>
              <CardDescription>
                Interactive visualization of {selectedRegion ? selectedRegion : "global"} base stations 
                and their emission levels
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[450px]">
                <EmissionMap 
                  stations={baseStations} 
                  onRegionSelect={handleRegionSelect} 
                  onStationSelect={handleStationSelect}
                  selectedRegion={selectedRegion}
                  selectedStation={selectedStation}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Station List */}
          <Card className="border shadow-md">
            <CardHeader className="bg-muted/30">
              <CardTitle>
                {selectedRegion ? `${selectedRegion} Stations` : "All Base Stations"}
              </CardTitle>
              <CardDescription>
                {filteredStations.length} stations monitoring emissions
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[450px] overflow-auto">
                <StationList 
                  stations={filteredStations}
                  onStationSelect={handleStationSelect}
                  selectedStation={selectedStation} 
                />
              </div>
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
          
          <TabsContent value="trends" className="space-y-4 animate-fade-in">
            <Card className="border shadow-md">
              <CardHeader className="bg-muted/30">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Historical Emission Trends</CardTitle>
                    <CardDescription>
                      Analyze {getEmissionDisplayName()} patterns over time
                    </CardDescription>
                  </div>
                  <Badge variant="outline">{timeRange === "day" ? "Last 24 Hours" : timeRange === "week" ? "Last Week" : timeRange === "month" ? "Last Month" : "Last Year"}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px]">
                  <EmissionTrends selectedRegion={selectedRegion} selectedStation={selectedStation} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="predictions" className="space-y-4 animate-fade-in">
            <Card className="border shadow-md">
              <CardHeader className="bg-muted/30">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Emission Predictions</CardTitle>
                    <CardDescription>
                      AI-powered forecasting of future emission trends
                    </CardDescription>
                  </div>
                  <Badge variant="outline">6-Month Forecast</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px]">
                  <PredictionModel selectedRegion={selectedRegion} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="regions" className="space-y-4 animate-fade-in">
            <Card className="border shadow-md">
              <CardHeader className="bg-muted/30">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Regional Comparison</CardTitle>
                    <CardDescription>
                      Compare {getEmissionDisplayName()} levels across different regions
                    </CardDescription>
                  </div>
                  <Badge variant="outline">All Regions</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px]">
                  <RegionalComparison regions={regionalData} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Environmental Impact & Mitigation */}
        <Card className="border shadow-md">
          <CardHeader className="bg-muted/30">
            <CardTitle>Environmental Impact & Mitigation Strategies</CardTitle>
            <CardDescription>
              Understanding the environmental consequences of emissions and approaches to reduce them
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Environmental Impacts</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-red-500/10 p-1 mt-0.5">
                      <span className="block h-2 w-2 rounded-full bg-red-500"></span>
                    </div>
                    <span className="text-sm">Global temperature rise of 1.5-4.5°C</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-red-500/10 p-1 mt-0.5">
                      <span className="block h-2 w-2 rounded-full bg-red-500"></span>
                    </div>
                    <span className="text-sm">Sea level rise threatening coastal communities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-red-500/10 p-1 mt-0.5">
                      <span className="block h-2 w-2 rounded-full bg-red-500"></span>
                    </div>
                    <span className="text-sm">More frequent and severe weather events</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-red-500/10 p-1 mt-0.5">
                      <span className="block h-2 w-2 rounded-full bg-red-500"></span>
                    </div>
                    <span className="text-sm">Loss of biodiversity and ecosystem disruption</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Technology Solutions</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-green-500/10 p-1 mt-0.5">
                      <span className="block h-2 w-2 rounded-full bg-green-500"></span>
                    </div>
                    <span className="text-sm">Carbon capture and storage technologies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-green-500/10 p-1 mt-0.5">
                      <span className="block h-2 w-2 rounded-full bg-green-500"></span>
                    </div>
                    <span className="text-sm">Renewable energy transition (solar, wind)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-green-500/10 p-1 mt-0.5">
                      <span className="block h-2 w-2 rounded-full bg-green-500"></span>
                    </div>
                    <span className="text-sm">Energy efficiency improvements in stations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-green-500/10 p-1 mt-0.5">
                      <span className="block h-2 w-2 rounded-full bg-green-500"></span>
                    </div>
                    <span className="text-sm">Smart grid implementation for optimal energy use</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Policy Approaches</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-blue-500/10 p-1 mt-0.5">
                      <span className="block h-2 w-2 rounded-full bg-blue-500"></span>
                    </div>
                    <span className="text-sm">Carbon pricing and emissions trading systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-blue-500/10 p-1 mt-0.5">
                      <span className="block h-2 w-2 rounded-full bg-blue-500"></span>
                    </div>
                    <span className="text-sm">Industry-specific emission reduction targets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-blue-500/10 p-1 mt-0.5">
                      <span className="block h-2 w-2 rounded-full bg-blue-500"></span>
                    </div>
                    <span className="text-sm">Financial incentives for clean technology adoption</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-blue-500/10 p-1 mt-0.5">
                      <span className="block h-2 w-2 rounded-full bg-blue-500"></span>
                    </div>
                    <span className="text-sm">International cooperation on climate goals</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <footer className="bg-muted p-4 text-center text-sm text-muted-foreground">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <p>© {new Date().getFullYear()} Base Station Emissions Analysis Tool</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">About</a>
            <a href="#" className="hover:underline">Data Sources</a>
            <a href="#" className="hover:underline">Methodology</a>
            <a href="#" className="hover:underline">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
