
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface RegionalMapProps {
  regionId: string;
  year: string;
  emissionType: string;
  displayType: string;
}

// This is a temporary public token - in production, this would be set as an environment variable
mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZS1tbCIsImEiOiJjbHplYzRqcWcwenIxMmpxcTZjZHZheHB0In0.Gm2Wbx5DhZ0-mBzTEma2sg';

// Region coordinates mapping
const regionCoordinates: Record<string, [number, number]> = {
  'us': [-95.7129, 37.0902],
  'europe': [10.4515, 51.1657],
  'india': [78.9629, 20.5937],
  'china': [104.1954, 35.8617],
};

// Region zoom levels
const regionZoomLevels: Record<string, number> = {
  'us': 3.5,
  'europe': 3.8,
  'india': 4,
  'china': 3.5,
};

const RegionalMap: React.FC<RegionalMapProps> = ({ regionId, year, emissionType, displayType }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current || !regionId) return;

    const initializeMap = async () => {
      try {
        setLoading(true);
        setError(null);

        const coordinates = regionCoordinates[regionId] || [0, 0];
        const zoomLevel = regionZoomLevels[regionId] || 2;

        // Initialize map
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: coordinates,
          zoom: zoomLevel,
        });

        map.current.addControl(
          new mapboxgl.NavigationControl(),
          'bottom-right'
        );

        map.current.on('load', () => {
          if (!map.current) return;
          
          // In a real application, here we would load the actual data from Supabase
          // based on the regionId, year, emissionType, and displayType
          
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        });

        map.current.on('error', () => {
          setError('An error occurred while loading the map.');
          setLoading(false);
        });
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to initialize the map.');
        setLoading(false);
      }
    };

    initializeMap();

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [regionId]);

  // Update map when props change
  useEffect(() => {
    if (!map.current || loading || !regionId) return;

    // In a real app, we would update the map data here
    console.log(`Updating regional map for ${regionId}: ${year}, ${emissionType}, ${displayType}`);
    
    // Apply different visualizations based on displayType
    if (displayType === 'total') {
      // Apply total emissions styling
    } else if (displayType === 'percapita') {
      // Apply per capita styling
    } else if (displayType === 'intensity') {
      // Apply intensity styling
    }
    
  }, [regionId, year, emissionType, displayType, loading]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="relative w-full h-full rounded-md overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="space-y-2">
            <Skeleton className="h-8 w-32 mx-auto" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute bottom-2 left-2 bg-background/80 p-2 rounded text-xs text-muted-foreground">
        {emissionType === 'co2' ? 'CO₂' : emissionType === 'co' ? 'CO' : 'CH₄'} {displayType === 'total' ? 'total emissions' : displayType === 'percapita' ? 'per capita emissions' : 'emission intensity'} ({year})
      </div>
    </div>
  );
};

export default RegionalMap;
