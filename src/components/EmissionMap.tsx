
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { BaseStation } from '@/types';
import { 
  Globe, 
  Database, 
  ThermometerSun, 
  CloudRain, 
  Wind, 
  AlertTriangle, 
  ShieldCheck 
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface EmissionMapProps {
  stations: BaseStation[];
  onRegionSelect: (region: string | null) => void;
  onStationSelect: (stationId: string | null) => void;
  selectedRegion: string | null;
  selectedStation: string | null;
}

// Function to get emission severity
const getEmissionSeverity = (co2: number) => {
  if (co2 < 45) return { class: 'bg-emission-low', label: 'Low' };
  if (co2 < 55) return { class: 'bg-emission-medium', label: 'Medium' };
  if (co2 < 65) return { class: 'bg-emission-high', label: 'High' };
  return { class: 'bg-emission-critical', label: 'Critical' };
};

// Mock world map regions
const regions = [
  { name: "North America", x: 20, y: 30, width: 20, height: 20 },
  { name: "South America", x: 30, y: 60, width: 15, height: 25 },
  { name: "Europe", x: 50, y: 25, width: 10, height: 15 },
  { name: "Africa", x: 50, y: 50, width: 15, height: 25 },
  { name: "Asia", x: 65, y: 30, width: 25, height: 20 },
  { name: "Oceania", x: 80, y: 65, width: 15, height: 15 }
];

// Climate hazards data
const climateHazards = [
  {
    id: "extreme-heat",
    title: "Extreme Heat Events",
    description: "Prolonged periods of abnormally high temperatures causing heat-related illnesses.",
    impact: "Increased mortality rates, crop failures, and higher energy demand for cooling.",
    precautions: "Implement early warning systems, create cooling centers in urban areas.",
    icon: <ThermometerSun className="h-5 w-5" />
  },
  {
    id: "flooding",
    title: "Increased Flooding",
    description: "Rising sea levels and increased precipitation causing more frequent flooding events.",
    impact: "Infrastructure damage, displacement of communities, and contaminated water supplies.",
    precautions: "Improve drainage systems, restrict building in flood-prone areas, and restore wetlands.",
    icon: <CloudRain className="h-5 w-5" />
  },
  {
    id: "storms",
    title: "Severe Storms",
    description: "More intense and frequent storms due to changing climate patterns.",
    impact: "Property damage, power outages, and loss of life and livelihood.",
    precautions: "Strengthen building codes, develop early warning systems, and improve emergency response.",
    icon: <Wind className="h-5 w-5" />
  }
];

const EmissionMap: React.FC<EmissionMapProps> = ({ 
  stations, 
  onRegionSelect, 
  onStationSelect,
  selectedRegion,
  selectedStation
}) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [activeHazard, setActiveHazard] = useState<string | null>(null);
  const [mapView, setMapView] = useState<"map" | "hazards" | "impacts">("map");
  
  return (
    <div className="relative h-full flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <div className="flex space-x-2">
          <Badge 
            variant="outline" 
            className={`cursor-pointer transition-all ${!selectedRegion ? 'bg-primary text-white' : ''}`}
            onClick={() => onRegionSelect(null)}
          >
            All Regions
          </Badge>
          {regions.map((region) => (
            <Badge 
              key={region.name}
              variant={selectedRegion === region.name ? "default" : "outline"}
              className="cursor-pointer transition-all hover:scale-105"
              onClick={() => onRegionSelect(region.name)}
            >
              {region.name}
            </Badge>
          ))}
        </div>
        
        <Tabs value={mapView} onValueChange={(value) => setMapView(value as any)} className="w-auto">
          <TabsList className="h-8">
            <TabsTrigger value="map" className="text-xs h-7">Map View</TabsTrigger>
            <TabsTrigger value="hazards" className="text-xs h-7">Climate Hazards</TabsTrigger>
            <TabsTrigger value="impacts" className="text-xs h-7">Regional Impacts</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="flex-1 relative bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden border">
        {/* Map View */}
        <Tabs value={mapView} className="h-full">
          <TabsContent value="map" className="h-full m-0 p-0 data-[state=active]:flex data-[state=active]:flex-col">
            <div className="absolute inset-0 flex items-center justify-center">
              <Globe className="h-32 w-32 text-primary opacity-20" />
              <div className="absolute inset-0">
                {/* Simple mock world map visualization */}
                <svg width="100%" height="100%" viewBox="0 0 100 100">
                  {regions.map(region => (
                    <rect 
                      key={region.name}
                      x={region.x} 
                      y={region.y} 
                      width={region.width} 
                      height={region.height}
                      className={`${selectedRegion === region.name ? 'fill-primary opacity-30' : 'fill-primary opacity-10'} 
                                ${hoveredRegion === region.name ? 'stroke-primary stroke-2' : 'stroke-none'} 
                                transition-all duration-300`}
                      onMouseEnter={() => setHoveredRegion(region.name)}
                      onMouseLeave={() => setHoveredRegion(null)}
                      onClick={() => onRegionSelect(region.name)}
                      style={{ cursor: 'pointer' }}
                    />
                  ))}
                  
                  {/* Render station markers */}
                  {stations.map(station => {
                    // Map station lat/lng to svg coordinates (this is just a mock approximation)
                    const x = ((station.location.lng + 180) / 360) * 100;
                    const y = ((90 - station.location.lat) / 180) * 100;
                    const severity = getEmissionSeverity(station.emissions.co2);
                    return (
                      <circle
                        key={station.id}
                        cx={x}
                        cy={y}
                        r={selectedStation === station.id ? 3 : 2}
                        className={`${severity.class} ${selectedStation === station.id ? 'stroke-2 stroke-white animate-pulse' : ''} 
                                  transition-all duration-300`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => onStationSelect(station.id)}
                      />
                    );
                  })}
                </svg>
              </div>
            </div>
            
            {/* Map Legend */}
            <div className="absolute bottom-2 left-2 bg-white dark:bg-slate-900 p-2 rounded-md shadow-md text-xs">
              <h4 className="font-semibold mb-1">Emission Levels</h4>
              <div className="flex flex-col gap-1">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-emission-low mr-2"></div>
                  <span>Low (&lt;45)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-emission-medium mr-2"></div>
                  <span>Medium (45-55)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-emission-high mr-2"></div>
                  <span>High (55-65)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-emission-critical mr-2"></div>
                  <span>Critical (&gt;65)</span>
                </div>
              </div>
            </div>
            
            {/* Station details panel when a station is selected */}
            {selectedStation && (
              <div className="absolute top-2 right-2 bg-white dark:bg-slate-900 p-3 rounded-md shadow-md text-xs w-64 animate-fade-in">
                {stations.filter(s => s.id === selectedStation).map(station => (
                  <div key={station.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">{station.name}</h4>
                      <Badge variant="outline" className="text-xs">{station.location.country}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-muted-foreground">CO₂</p>
                        <p className="font-semibold">{station.emissions.co2} tons/month</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">CO</p>
                        <p className="font-semibold">{station.emissions.co} tons/month</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">CH₄</p>
                        <p className="font-semibold">{station.emissions.ch4} tons/month</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Efficiency</p>
                        <p className="font-semibold">{station.efficiency}%</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-xs">Last updated: {new Date(station.lastUpdated).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}

            {/* No actual map data notice */}
            <div className="absolute bottom-2 right-2 bg-white/70 dark:bg-slate-900/70 px-2 py-1 rounded text-xs flex items-center">
              <Database className="w-3 h-3 mr-1" />
              <span>Mock visualization (no actual geo data)</span>
            </div>
          </TabsContent>
          
          {/* Climate Hazards Tab */}
          <TabsContent value="hazards" className="h-full m-0 p-4 data-[state=active]:animate-fade-in">
            <div className="h-full overflow-y-auto">
              <div className="mb-4">
                <h3 className="text-lg font-medium flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Climate Hazards Related to Emissions
                </h3>
                <p className="text-sm text-muted-foreground">
                  High emission levels contribute to various environmental hazards with significant impacts on ecosystems and human life.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                {climateHazards.map(hazard => (
                  <Card 
                    key={hazard.id} 
                    className={`border-l-4 ${activeHazard === hazard.id ? 'border-l-primary' : 'border-l-transparent'} 
                    transition-all hover:shadow-md cursor-pointer`}
                    onClick={() => setActiveHazard(activeHazard === hazard.id ? null : hazard.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-primary/10 rounded-full p-2">
                          {hazard.icon}
                        </div>
                        <h4 className="font-medium">{hazard.title}</h4>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-2">{hazard.description}</p>
                      
                      {activeHazard === hazard.id && (
                        <div className="animate-fade-in mt-3 pt-3 border-t">
                          <div className="mb-2">
                            <span className="text-xs font-medium mb-1 block">Impacts:</span>
                            <p className="text-xs">{hazard.impact}</p>
                          </div>
                          
                          <div>
                            <span className="text-xs font-medium mb-1 block flex items-center gap-1">
                              <ShieldCheck className="h-3 w-3" />
                              Precautions:
                            </span>
                            <p className="text-xs">{hazard.precautions}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Emission Reduction Is Critical</AlertTitle>
                <AlertDescription>
                  The effects of climate change are already being observed and will continue to intensify 
                  unless significant steps are taken to reduce global emissions and transition to renewable energy sources.
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
          
          {/* Regional Impacts Tab */}
          <TabsContent value="impacts" className="h-full m-0 p-4 data-[state=active]:animate-fade-in">
            <div className="h-full overflow-y-auto">
              <h3 className="text-lg font-medium flex items-center gap-2 mb-4">
                <Globe className="h-5 w-5 text-blue-500" />
                Regional Climate Impacts
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {regions.map(region => (
                  <Card 
                    key={region.name} 
                    className={`transition-all ${selectedRegion === region.name ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => onRegionSelect(region.name)}
                  >
                    <CardContent className="p-4">
                      <h4 className="font-medium text-base mb-2">{region.name}</h4>
                      
                      {/* Region specific impact data - could be dynamic in a real app */}
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs font-medium">Primary Concerns:</span>
                          <p className="text-xs text-muted-foreground">
                            {region.name === "North America" && "Heat waves, wildfires, and coastal flooding"}
                            {region.name === "South America" && "Deforestation, biodiversity loss, and water scarcity"}
                            {region.name === "Europe" && "Rising sea levels, flooding, and extreme weather events"}
                            {region.name === "Africa" && "Drought, food insecurity, and water stress"}
                            {region.name === "Asia" && "Flooding, typhoons, and agricultural disruption"}
                            {region.name === "Oceania" && "Coral reef bleaching, sea level rise, and severe storms"}
                          </p>
                        </div>
                        
                        <div>
                          <span className="text-xs font-medium">Vulnerability Level:</span>
                          <div className="h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full" 
                              style={{ 
                                width: 
                                  region.name === "Africa" || region.name === "Oceania" ? "80%" : 
                                  region.name === "Asia" || region.name === "South America" ? "65%" : "50%" 
                              }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-xs pt-2">
                          <Badge variant="outline" className="text-[10px]">
                            {stations.filter(s => s.location.region === region.name).length} Stations
                          </Badge>
                          <span className="text-xs text-muted-foreground cursor-pointer hover:underline">
                            View Details
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmissionMap;
