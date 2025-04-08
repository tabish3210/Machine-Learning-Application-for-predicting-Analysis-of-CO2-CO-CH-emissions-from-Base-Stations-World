
import React from 'react';
import { ChartContainer } from '@/components/ui/chart';
import { 
  PieChart, Pie, BarChart, Bar, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { motion } from 'framer-motion';

interface RegionalVisualizationProps {
  regionId: string;
  year: string;
  emissionType: string;
  displayType: string;
}

const COLORS = ['#3b82f6', '#f97316', '#8b5cf6', '#10b981', '#ef4444', '#ec4899', '#f59e0b', '#06b6d4'];

const RegionalVisualization: React.FC<RegionalVisualizationProps> = ({ 
  regionId, 
  year,
  emissionType,
  displayType
}) => {
  // Enhanced mock data for regional visualization - would come from API in real app
  const regionData = [
    { name: 'Urban', value: 400, percentage: 40 },
    { name: 'Industrial', value: 300, percentage: 30 },
    { name: 'Rural', value: 200, percentage: 20 },
    { name: 'Suburban', value: 100, percentage: 10 },
    { name: 'Coastal', value: 150, percentage: 15 }
  ];
  
  const barData = [
    { area: 'City Center', co2: 250, co: 23, ch4: 12 },
    { area: 'Industrial Park', co2: 320, co: 28, ch4: 18 },
    { area: 'Residential Zone', co2: 180, co: 15, ch4: 9 },
    { area: 'Commercial District', co2: 230, co: 21, ch4: 14 },
    { area: 'Agricultural Belt', co2: 90, co: 8, ch4: 22 }
  ];

  // Animation variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { 
        type: "spring",
        duration: 0.8
      }
    }
  };

  return (
    <motion.div 
      className="w-full h-full flex flex-col"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex flex-wrap gap-4 mb-4 justify-center">
        <motion.div 
          className="bg-card p-4 rounded-lg shadow-sm border flex-1 min-w-[200px]"
          variants={cardVariants}
        >
          <h3 className="font-semibold mb-1">Total Emissions</h3>
          <div className="text-3xl font-bold">
            {emissionType === 'co2' ? '1,240 kt' : emissionType === 'co' ? '95 kt' : '61 kt'}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {displayType === 'percapita' ? 'Per capita: 5.2 tons' : 
             displayType === 'intensity' ? 'Intensity: 0.42 kg/GDP' : 'Year: ' + year}
          </div>
        </motion.div>

        <motion.div 
          className="bg-card p-4 rounded-lg shadow-sm border flex-1 min-w-[200px]"
          variants={cardVariants}
        >
          <h3 className="font-semibold mb-1">Annual Change</h3>
          <div className="text-3xl font-bold text-green-500">-2.4%</div>
          <div className="text-sm text-muted-foreground mt-1">Compared to previous year</div>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-[350px]">
        <motion.div 
          className="w-full h-full bg-card p-6 rounded-lg shadow-sm border"
          variants={cardVariants}
        >
          <h3 className="text-center font-medium mb-2">Regional Distribution</h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={regionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius="70%"
                innerRadius="40%"
                fill="#8884d8"
                dataKey="value"
                animationBegin={300}
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {regionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} kt`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
        
        <motion.div 
          className="w-full h-full bg-card p-6 rounded-lg shadow-sm border"
          variants={cardVariants}
        >
          <h3 className="text-center font-medium mb-2">Area Comparison</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="area" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey={emissionType} 
                name={emissionType === 'co2' ? 'CO₂' : emissionType === 'co' ? 'CO' : 'CH₄'}
                fill={emissionType === 'co2' ? '#3b82f6' : emissionType === 'co' ? '#f97316' : '#8b5cf6'} 
                animationBegin={300}
                animationDuration={1500}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
      
      <motion.div 
        className="mt-6 p-4 rounded-lg border bg-card"
        variants={itemVariants}
      >
        <h3 className="font-medium mb-3">Emission Trends by Sub-Region</h3>
        <div className="flex flex-wrap gap-3">
          {['Urban Core', 'Industrial District', 'Residential Areas', 'Business Center', 'Rural Outskirts'].map((area, index) => (
            <motion.div 
              key={area} 
              className="p-3 border rounded-lg flex-1 min-w-[150px] bg-background"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-lg font-semibold">
                {(25 - index * 3).toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">{area}</div>
              <div className="h-2 bg-slate-200 rounded-full mt-2">
                <div 
                  className={`h-full rounded-full ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-orange-500' :
                    index === 2 ? 'bg-green-500' :
                    index === 3 ? 'bg-purple-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${25 - index * 3}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RegionalVisualization;
