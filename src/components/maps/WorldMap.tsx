
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface WorldMapProps {
  year: string;
  emissionType: string;
  mapStyle: string;
}

// This is a temporary public token - in production, this would be set as an environment variable
mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZS1tbCIsImEiOiJjbHplYzRqcWcwenIxMmpxcTZjZHZheHB0In0.Gm2Wbx5DhZ0-mBzTEma2sg';

const WorldMap: React.FC<WorldMapProps> = ({ year, emissionType, mapStyle }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const initializeMap = async () => {
      try {
        setLoading(true);
        setError(null);

        // Initialize map
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [0, 20],
          zoom: 1.5,
        });

        map.current.addControl(
          new mapboxgl.NavigationControl(),
          'bottom-right'
        );

        map.current.on('load', () => {
          if (!map.current) return;
          
          // In a real application, here we would load the actual data from Supabase
          // based on the year, emissionType, and mapStyle
          
          // For demonstration, we'll simulate loading data
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
  }, []);

  // Update map when props change
  useEffect(() => {
    if (!map.current || loading) return;

    // In a real app, we would update the map data here based on 
    // the year, emissionType and mapStyle
    console.log(`Updating map for: ${year}, ${emissionType}, ${mapStyle}`);
    
    // Apply different map rendering based on mapStyle
    if (mapStyle === 'choropleth') {
      // Apply choropleth styling
    } else if (mapStyle === 'bubble') {
      // Apply bubble map styling
    } else if (mapStyle === 'hexbin') {
      // Apply hexbin styling
    }
    
  }, [year, emissionType, mapStyle, loading]);

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
        {emissionType === 'co2' ? 'CO₂' : emissionType === 'co' ? 'CO' : 'CH₄'} emissions ({year})
      </div>
    </div>
  );
};

export default WorldMap;
