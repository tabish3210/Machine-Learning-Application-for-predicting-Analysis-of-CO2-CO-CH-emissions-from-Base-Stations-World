
import React from 'react';
import { BaseStation } from '@/types';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';

interface StationListProps {
  stations: BaseStation[];
  onStationSelect: (stationId: string | null) => void;
  selectedStation: string | null;
}

// Function to get emission severity
const getEmissionSeverity = (co2: number) => {
  if (co2 < 45) return { class: 'bg-emission-low', label: 'Low' };
  if (co2 < 55) return { class: 'bg-emission-medium', label: 'Medium' };
  if (co2 < 65) return { class: 'bg-emission-high', label: 'High' };
  return { class: 'bg-emission-critical', label: 'Critical' };
};

const StationList: React.FC<StationListProps> = ({ stations, onStationSelect, selectedStation }) => {
  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-3">
        {stations.length > 0 ? (
          stations.map(station => {
            const severity = getEmissionSeverity(station.emissions.co2);
            return (
              <div 
                key={station.id} 
                className={`p-3 rounded-md border cursor-pointer hover:border-primary transition-colors
                          ${selectedStation === station.id ? 'border-primary bg-accent/50' : ''}`}
                onClick={() => onStationSelect(selectedStation === station.id ? null : station.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{station.name}</h4>
                  <Badge variant="outline" className="text-xs">{station.location.country}</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">CO₂:</span>{' '}
                    <span className="font-medium">{station.emissions.co2}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CO:</span>{' '}
                    <span className="font-medium">{station.emissions.co}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CH₄:</span>{' '}
                    <span className="font-medium">{station.emissions.ch4}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Efficiency:</span>{' '}
                    <span className="font-medium">{station.efficiency}%</span>
                  </div>
                </div>
                
                <div className="mt-2 flex items-center">
                  <div className={`w-2 h-2 rounded-full ${severity.class} mr-2`}></div>
                  <span className="text-xs">{severity.label} Emissions</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            No stations found
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default StationList;
