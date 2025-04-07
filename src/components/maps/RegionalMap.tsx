
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

interface RegionalMapProps {
  regionId: string;
  year: string;
  emissionType: string;
  displayType: string;
}

// Define GeoJSON types for TypeScript
interface EmissionPointFeature extends GeoJSON.Feature {
  properties: {
    value: number;
    emissionType: string;
  };
  geometry: GeoJSON.Point;
}

interface EmissionPointCollection extends GeoJSON.FeatureCollection {
  features: EmissionPointFeature[];
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

// Region bounds for fitting the map view
const regionBounds: Record<string, [[number, number], [number, number]]> = {
  'us': [[-125.0, 24.0], [-66.0, 49.0]],
  'europe': [[-10.0, 35.0], [30.0, 70.0]],
  'india': [[68.0, 8.0], [97.0, 36.0]],
  'china': [[73.0, 18.0], [135.0, 54.0]],
};

const RegionalMap: React.FC<RegionalMapProps> = ({ regionId, year, emissionType, displayType }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [mapIsStyled, setMapIsStyled] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-emission-data', {
          body: { year, emissionType, regionId }
        });

        if (error) throw new Error(error.message);
        setData(data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    if (regionId) {
      fetchData();
    }
  }, [regionId, year, emissionType]);

  useEffect(() => {
    if (!mapContainer.current || !regionId) return;

    const initializeMap = async () => {
      try {
        setLoading(true);
        setError(null);
        setMapIsStyled(false);

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

        // Fit to region bounds if available
        if (regionBounds[regionId]) {
          map.current.fitBounds(regionBounds[regionId], {
            padding: { top: 50, bottom: 50, left: 50, right: 50 }
          });
        }

        // IMPORTANT: Only add data layers after the style is fully loaded
        map.current.on('style.load', () => {
          if (!map.current) return;
          
          console.log("Map style loaded successfully");
          setMapIsStyled(true);
          
          setTimeout(() => {
            setLoading(false);
          }, 500);
        });

        map.current.on('error', (e) => {
          console.error('Map error:', e);
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

  // Function to add regional data layers - now separated to be called only when map is styled
  const addRegionalDataLayers = () => {
    if (!map.current || !regionId || !mapIsStyled) return;
    
    console.log("Adding regional data layers");
    
    // Remove any existing layers
    if (map.current.getLayer('emission-points')) {
      map.current.removeLayer('emission-points');
    }
    if (map.current.getSource('emission-source')) {
      map.current.removeSource('emission-source');
    }
    
    // Create mock emission source points
    const generatePoints = (center: [number, number], count: number, radius: number): EmissionPointFeature[] => {
      const points: EmissionPointFeature[] = [];
      for (let i = 0; i < count; i++) {
        // Create random points in a circle around the center
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.sqrt(Math.random()) * radius;
        const lng = center[0] + distance * Math.cos(angle);
        const lat = center[1] + distance * Math.sin(angle);
        
        // Generate emission value based on display type
        let value;
        if (displayType === 'total') {
          value = Math.round(Math.random() * 1000) + 200;
        } else if (displayType === 'percapita') {
          value = Math.round((Math.random() * 15 + 2) * 10) / 10;
        } else { // intensity
          value = Math.round((Math.random() * 50 + 20) * 10) / 10;
        }
        
        points.push({
          type: 'Feature',
          properties: {
            value,
            emissionType
          },
          geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          }
        });
      }
      return points;
    };
    
    // Get the center coordinates for the region
    const center = regionCoordinates[regionId];
    let pointCount = 0;
    let radius = 0;
    
    // Configure based on region
    switch (regionId) {
      case 'us':
        pointCount = 50;
        radius = 15;
        break;
      case 'europe':
        pointCount = 40;
        radius = 10;
        break;
      case 'india':
        pointCount = 30;
        radius = 8;
        break;
      case 'china':
        pointCount = 60;
        radius = 15;
        break;
      default:
        pointCount = 20;
        radius = 5;
    }
    
    const points: EmissionPointCollection = {
      type: 'FeatureCollection',
      features: generatePoints(center, pointCount, radius)
    };
    
    try {
      // Add the source and layer
      map.current.addSource('emission-source', {
        type: 'geojson',
        data: points
      });
      
      // Get color based on emission type
      const color = emissionType === 'co2' ? '#3b82f6' : 
                    emissionType === 'co' ? '#f97316' : '#8b5cf6';
      
      // Add visualization layer based on display type
      if (displayType === 'total' || displayType === 'percapita') {
        map.current.addLayer({
          id: 'emission-points',
          type: 'circle',
          source: 'emission-source',
          paint: {
            'circle-radius': [
              'interpolate', ['linear'], ['get', 'value'],
              // Scale differently based on display type
              ...(displayType === 'total' ? [200, 5, 1000, 20] : [2, 5, 15, 20])
            ],
            'circle-color': color,
            'circle-opacity': 0.6,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff'
          }
        });
      } else { // intensity heatmap
        map.current.addLayer({
          id: 'emission-points',
          type: 'heatmap',
          source: 'emission-source',
          paint: {
            'heatmap-weight': [
              'interpolate', ['linear'], ['get', 'value'],
              20, 0,
              100, 1
            ],
            'heatmap-intensity': 1,
            'heatmap-color': [
              'interpolate', ['linear'], ['heatmap-density'],
              0, 'rgba(0,0,0,0)',
              0.2, '#d4eaff',
              0.4, '#9ec8ff',
              0.6, '#65a2ff',
              0.8, '#2979ff',
              1, '#0d47a1'
            ],
            'heatmap-radius': 20,
            'heatmap-opacity': 0.8
          }
        });
      }
      
      console.log("Added emission points layer successfully");
      
      // Add popups for the points
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });
      
      if (displayType !== 'intensity') {
        map.current.on('mouseenter', 'emission-points', (e) => {
          if (!map.current || !e.features || !e.features[0] || !e.features[0].geometry.type) return;
          
          map.current.getCanvas().style.cursor = 'pointer';
          
          // Cast the geometry to get TypeScript to recognize coordinates
          const geometry = e.features[0].geometry as GeoJSON.Point;
          const coordinates = geometry.coordinates.slice();
          const value = e.features[0].properties.value;
          
          const displayValue = displayType === 'total' 
            ? `${value} kilotons` 
            : `${value} tons per capita`;
          
          const html = `
            <div class="p-2 bg-white dark:bg-gray-800 shadow-lg rounded-md text-sm">
              <p>${emissionType === 'co2' ? 'CO₂' : emissionType === 'co' ? 'CO' : 'CH₄'}: ${displayValue}</p>
            </div>
          `;
          
          popup
            .setLngLat(coordinates as [number, number])
            .setHTML(html)
            .addTo(map.current);
        });
        
        map.current.on('mouseleave', 'emission-points', () => {
          if (!map.current) return;
          map.current.getCanvas().style.cursor = '';
          popup.remove();
        });
      }
    } catch (err) {
      console.error("Error adding data layers:", err);
      setError("Failed to add data visualization to the map.");
    }
  };

  // Update map when map is styled and props change
  useEffect(() => {
    if (!map.current || loading || !regionId || !mapIsStyled) return;

    // Update the visualization based on new props
    console.log(`Updating regional map for ${regionId}: ${year}, ${emissionType}, ${displayType}`);
    addRegionalDataLayers();
    
  }, [regionId, year, emissionType, displayType, loading, mapIsStyled, data]);

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
      <div className="absolute top-2 right-2 bg-background/80 p-2 rounded text-xs flex items-center gap-1">
        <Info className="h-3 w-3" />
        <span>Showing simulated data for visualization purposes</span>
      </div>
    </div>
  );
};

export default RegionalMap;
