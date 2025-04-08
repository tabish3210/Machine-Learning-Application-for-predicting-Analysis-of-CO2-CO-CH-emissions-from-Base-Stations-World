
import React from 'react';
import { Globe, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TokenErrorDisplayProps {
  year: string;
  emissionType: string;
}

const TokenErrorDisplay: React.FC<TokenErrorDisplayProps> = ({ year, emissionType }) => {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-background/80 backdrop-blur-sm p-6 rounded-lg max-w-2xl shadow-lg border">
        <Globe className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-xl font-semibold mb-2">Map Visualization Unavailable</h3>
        <p className="text-muted-foreground mb-4">
          We're experiencing issues with the Mapbox API access token. Please view our alternative data visualizations below.
        </p>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="p-3 border rounded-lg text-center bg-background">
            <h4 className="font-semibold text-lg">
              {emissionType === 'co2' ? '36.8' : emissionType === 'co' ? '1.2' : '8.3'} Gt
            </h4>
            <p className="text-xs text-muted-foreground">Global Emissions ({year})</p>
          </div>
          <div className="p-3 border rounded-lg text-center bg-background">
            <h4 className="font-semibold text-lg">
              {emissionType === 'co2' ? '+1.2%' : emissionType === 'co' ? '-0.5%' : '+2.1%'}
            </h4>
            <p className="text-xs text-muted-foreground">Year-over-Year Change</p>
          </div>
          <div className="p-3 border rounded-lg text-center bg-background">
            <h4 className="font-semibold text-lg">
              {emissionType === 'co2' ? '4.8' : emissionType === 'co' ? '0.2' : '1.1'} t
            </h4>
            <p className="text-xs text-muted-foreground">Per Capita Average</p>
          </div>
        </div>
        <Button className="mt-6 mx-auto" onClick={() => window.location.reload()}>
          <RefreshCcw className="h-4 w-4 mr-2" /> Retry Loading Map
        </Button>
        <p className="text-xs text-muted-foreground mt-4">
          Note: For this application to work properly, a valid Mapbox access token is required.
        </p>
      </div>
    </div>
  );
};

export default TokenErrorDisplay;
