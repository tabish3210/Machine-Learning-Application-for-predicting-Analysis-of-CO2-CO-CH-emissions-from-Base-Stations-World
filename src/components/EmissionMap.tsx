
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { BaseStation } from '@/types';
import { Globe, Database } from 'lucide-react';
import { Badge } from './ui/badge';

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

const EmissionMap: React.FC<EmissionMapProps> = ({ 
  stations, 
  onRegionSelect, 
  onStationSelect,
  selectedRegion,
  selectedStation
}) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  
  // This is a simplified map component without actual geo visualization
  // In a real application, you would use a library like react-simple-maps, mapbox-gl, or leaflet
  return (
    <div className="relative h-full flex flex-col">
      <div className="flex justify-end mb-3 space-x-2">
        <Badge 
          variant="outline" 
          className="cursor-pointer"
          onClick={() => onRegionSelect(null)}
        >
          All Regions
        </Badge>
        {regions.map((region) => (
          <Badge 
            key={region.name}
            variant={selectedRegion === region.name ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onRegionSelect(region.name)}
          >
            {region.name}
          </Badge>
        ))}
      </div>
      
      <div className="flex-1 relative bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden border">
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
                            ${hoveredRegion === region.name ? 'stroke-primary stroke-2' : 'stroke-none'}`}
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
                    className={`${severity.class} ${selectedStation === station.id ? 'stroke-2 stroke-white' : ''}`}
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
          <div className="absolute top-2 right-2 bg-white dark:bg-slate-900 p-3 rounded-md shadow-md text-xs w-64">
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
      </div>
    </div>
  );
};

export default EmissionMap;
