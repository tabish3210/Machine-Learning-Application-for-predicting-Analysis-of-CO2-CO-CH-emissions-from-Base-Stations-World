
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';

interface VisualizationErrorDisplayProps {
  message: string;
}

const VisualizationErrorDisplay: React.FC<VisualizationErrorDisplayProps> = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Alert variant="destructive" className="h-full flex items-center">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </motion.div>
  );
};

export default VisualizationErrorDisplay;
