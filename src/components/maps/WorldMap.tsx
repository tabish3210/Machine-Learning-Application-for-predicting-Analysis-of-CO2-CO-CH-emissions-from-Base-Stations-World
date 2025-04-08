
import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import MapVisualization from './MapVisualization';
import MapErrorDisplay from './MapErrorDisplay';
import TokenErrorDisplay from './TokenErrorDisplay';

interface WorldMapProps {
  year: string;
  emissionType: string;
  mapStyle: string;
}

// This token might be invalid - we'll handle that error gracefully
mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZS1tbCIsImEiOiJjbHplYzRqcWcwenIxMmpxcTZjZHZheHB0In0.Gm2Wbx5DhZ0-mBzTEma2sg';

const WorldMap: React.FC<WorldMapProps> = ({ year, emissionType, mapStyle }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [tokenError, setTokenError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-emission-data', {
          body: { year, emissionType }
        });

        if (error) throw new Error(error.message);
        setData(data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load emission data');
      }
    };

    fetchData();
  }, [year, emissionType]);

  useEffect(() => {
    const handleMapError = (e: ErrorEvent) => {
      if (e.error && e.error.message && e.error.message.includes('access token')) {
        setTokenError(true);
        setLoading(false);
      }
    };

    window.addEventListener('error', handleMapError);
    
    return () => {
      window.removeEventListener('error', handleMapError);
    };
  }, []);

  if (error) {
    return <MapErrorDisplay message={error} />;
  }

  if (tokenError) {
    return <TokenErrorDisplay year={year} emissionType={emissionType} />;
  }

  return (
    <MapVisualization 
      year={year}
      emissionType={emissionType}
      mapStyle={mapStyle}
      loading={loading}
    />
  );
};

export default WorldMap;
