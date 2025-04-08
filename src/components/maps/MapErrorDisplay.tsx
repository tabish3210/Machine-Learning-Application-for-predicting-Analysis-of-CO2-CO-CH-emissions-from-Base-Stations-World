
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MapErrorDisplayProps {
  message: string;
}

const MapErrorDisplay: React.FC<MapErrorDisplayProps> = ({ message }) => {
  return (
    <Alert variant="destructive" className="h-full flex items-center">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default MapErrorDisplay;
