
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Define GeoJSON types for TypeScript
export interface EmissionFeature extends GeoJSON.Feature {
  properties: {
    name: string;
    emissions: number;
    intensity: number;
  };
  geometry: GeoJSON.Point;
}

export interface EmissionCollection extends GeoJSON.FeatureCollection {
  features: EmissionFeature[];
}

interface MapVisualizationProps {
  year: string;
  emissionType: string;
  mapStyle: string;
  loading: boolean;
}

const MapVisualization: React.FC<MapVisualizationProps> = ({
  year,
  emissionType,
  mapStyle,
  loading,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapIsStyled, setMapIsStyled] = useState<boolean>(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    const initializeMap = async () => {
      try {
        setMapIsStyled(false);

        // Initialize map
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [0, 20],
          zoom: 1.5,
          projection: 'globe'  // Use globe projection for better world view
        });

        map.current.addControl(
          new mapboxgl.NavigationControl(),
          'bottom-right'
        );

        // Add atmosphere and fog effects for globe view
        map.current.on('style.load', () => {
          if (!map.current) return;
          
          console.log("World map style loaded successfully");
          
          map.current.setFog({
            color: 'rgb(255, 255, 255)',
            'high-color': 'rgb(200, 200, 225)',
            'horizon-blend': 0.2,
          });
          
          setMapIsStyled(true);
          
          // For demonstration, we'll add a simple data visualization after a short delay
          setTimeout(() => {
            addMapLayers();
          }, 500);
        });
      } catch (err) {
        console.error('Error initializing map:', err);
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
  
  // Function to add data visualization layers to the map
  const addMapLayers = () => {
    if (!map.current || !mapIsStyled) {
      console.log("Cannot add map layers - map not ready", { map: !!map.current, styled: mapIsStyled });
      return;
    }
    
    console.log("Adding world map layers");
    
    try {
      // Remove any existing layers
      if (map.current.getLayer('emissions-layer')) {
        map.current.removeLayer('emissions-layer');
      }
      if (map.current.getSource('emissions-data')) {
        map.current.removeSource('emissions-data');
      }
      
      // Add example visualization (this would use real data in production)
      // This example adds colored circles for major emission sources
      const regionsData: EmissionCollection = {
        'type': 'FeatureCollection',
        'features': [
          {
            'type': 'Feature',
            'properties': {
              'name': 'United States',
              'emissions': 5416,
              'intensity': 16.1
            },
            'geometry': {
              'type': 'Point',
              'coordinates': [-95.7129, 37.0902]
            }
          },
          {
            'type': 'Feature',
            'properties': {
              'name': 'Europe',
              'emissions': 3356,
              'intensity': 8.1
            },
            'geometry': {
              'type': 'Point',
              'coordinates': [9.1582, 48.3794]
            }
          },
          {
            'type': 'Feature',
            'properties': {
              'name': 'China',
              'emissions': 10065,
              'intensity': 7.1
            },
            'geometry': {
              'type': 'Point',
              'coordinates': [103.8198, 36.5617]
            }
          },
          {
            'type': 'Feature',
            'properties': {
              'name': 'India',
              'emissions': 2654,
              'intensity': 1.8
            },
            'geometry': {
              'type': 'Point',
              'coordinates': [78.9629, 20.5937]
            }
          },
          {
            'type': 'Feature',
            'properties': {
              'name': 'Russia',
              'emissions': 1711,
              'intensity': 11.9
            },
            'geometry': {
              'type': 'Point',
              'coordinates': [97.6204, 64.6863]
            }
          }
        ]
      };
      
      // Apply different visualization styles based on mapStyle
      if (mapStyle === 'choropleth') {
        // For choropleth, we'd ideally use polygon data with country boundaries
        // This is a simplified example using circle markers with different sizes
        map.current.addSource('emissions-data', {
          type: 'geojson',
          data: regionsData
        });
        
        map.current.addLayer({
          id: 'emissions-layer',
          type: 'circle',
          source: 'emissions-data',
          paint: {
            'circle-radius': [
              'interpolate', ['linear'], ['get', 'emissions'],
              1000, 10,
              10000, 40
            ],
            'circle-color': [
              'interpolate', ['linear'], ['get', 'emissions'],
              1000, '#91cb7f',  // Lower emissions: green
              5000, '#ffeda0',  // Medium emissions: yellow
              10000, '#fc4e2a'  // Higher emissions: red
            ],
            'circle-opacity': 0.6,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff'
          }
        });
      } else if (mapStyle === 'bubble') {
        map.current.addSource('emissions-data', {
          type: 'geojson',
          data: regionsData
        });
        
        map.current.addLayer({
          id: 'emissions-layer',
          type: 'circle',
          source: 'emissions-data',
          paint: {
            'circle-radius': [
              'interpolate', ['linear'], ['get', 'emissions'],
              1000, 20,
              10000, 60
            ],
            'circle-color': emissionType === 'co2' ? '#3b82f6' : 
                          emissionType === 'co' ? '#f97316' : '#8b5cf6',
            'circle-opacity': 0.5,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
          }
        });
      } else if (mapStyle === 'hexbin') {
        // Hexbin would require additional processing
        // Here we'll simulate it with a simple point pattern
        map.current.addSource('emissions-data', {
          type: 'geojson',
          data: regionsData
        });
        
        map.current.addLayer({
          id: 'emissions-layer',
          type: 'circle',
          source: 'emissions-data',
          paint: {
            'circle-radius': 30,
            'circle-color': emissionType === 'co2' ? '#3b82f680' : 
                          emissionType === 'co' ? '#f9731680' : '#8b5cf680',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
            'circle-stroke-opacity': 0.8
          }
        });
      }
      
      console.log("Added emissions layer successfully");
      
      // Add popups on hover
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });
      
      map.current.on('mouseenter', 'emissions-layer', (e) => {
        if (!map.current || !e.features || !e.features[0] || !e.features[0].geometry.type) return;
        
        map.current.getCanvas().style.cursor = 'pointer';
        
        // Cast the geometry to get TypeScript to recognize coordinates
        const geometry = e.features[0].geometry as GeoJSON.Point;
        const coordinates = geometry.coordinates.slice();
        const name = e.features[0].properties.name;
        const emissions = e.features[0].properties.emissions;
        const intensity = e.features[0].properties.intensity;
        
        const html = `
          <div class="p-2 bg-white dark:bg-gray-800 shadow-lg rounded-md text-sm">
            <h4 class="font-semibold">${name}</h4>
            <p>${emissionType.toUpperCase()}: ${emissions} MT</p>
            <p>Intensity: ${intensity} t/capita</p>
          </div>
        `;
        
        popup
          .setLngLat(coordinates as [number, number])
          .setHTML(html)
          .addTo(map.current);
      });
      
      map.current.on('mouseleave', 'emissions-layer', () => {
        if (!map.current) return;
        map.current.getCanvas().style.cursor = '';
        popup.remove();
      });
    } catch (err) {
      console.error("Error adding map layers:", err);
    }
  };

  // Update map when props change
  useEffect(() => {
    if (!map.current || !mapIsStyled) return;

    console.log(`Updating map for: ${year}, ${emissionType}, ${mapStyle}`);
    addMapLayers();
    
  }, [year, emissionType, mapStyle, mapIsStyled]);

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
      <div className="absolute top-2 right-2 bg-background/80 p-2 rounded text-xs flex items-center gap-1">
        <Info className="h-3 w-3" />
        <span>Showing simulated data for visualization purposes</span>
      </div>
    </div>
  );
};

export default MapVisualization;
