
import React from 'react';
import { PieChart, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface DataVisualizationFallbackProps {
  year: string;
  emissionType: string;
}

const DataVisualizationFallback: React.FC<DataVisualizationFallbackProps> = ({ year, emissionType }) => {
  return (
    <motion.div 
      className="h-full flex flex-col items-center justify-center p-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="bg-background/80 backdrop-blur-sm p-6 rounded-lg max-w-2xl shadow-lg border"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, 0, -10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <PieChart className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        </motion.div>
        
        <h3 className="text-xl font-semibold mb-2">Data Visualization Ready</h3>
        <p className="text-muted-foreground mb-4">
          Explore our interactive charts and visualizations showing emission data by region and sector.
        </p>
        
        <motion.div 
          className="grid grid-cols-3 gap-4 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div 
            className="p-3 border rounded-lg text-center bg-background"
            whileHover={{ scale: 1.05 }}
          >
            <h4 className="font-semibold text-lg">
              {emissionType === 'co2' ? '36.8' : emissionType === 'co' ? '1.2' : '8.3'} Gt
            </h4>
            <p className="text-xs text-muted-foreground">Global Emissions ({year})</p>
          </motion.div>
          
          <motion.div 
            className="p-3 border rounded-lg text-center bg-background"
            whileHover={{ scale: 1.05 }}
          >
            <h4 className="font-semibold text-lg">
              {emissionType === 'co2' ? '+1.2%' : emissionType === 'co' ? '-0.5%' : '+2.1%'}
            </h4>
            <p className="text-xs text-muted-foreground">Year-over-Year Change</p>
          </motion.div>
          
          <motion.div 
            className="p-3 border rounded-lg text-center bg-background"
            whileHover={{ scale: 1.05 }}
          >
            <h4 className="font-semibold text-lg">
              {emissionType === 'co2' ? '4.8' : emissionType === 'co' ? '0.2' : '1.1'} t
            </h4>
            <p className="text-xs text-muted-foreground">Per Capita Average</p>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button className="mt-6 mx-auto" onClick={() => window.location.reload()}>
            <RefreshCcw className="h-4 w-4 mr-2" /> Refresh Data
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default DataVisualizationFallback;
