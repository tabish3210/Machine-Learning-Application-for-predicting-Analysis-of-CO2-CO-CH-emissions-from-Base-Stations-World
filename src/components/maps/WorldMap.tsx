
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Box, PieChart as PieChartIcon, BarChart3, AlertTriangle } from 'lucide-react';
import MapErrorDisplay from './MapErrorDisplay';
import TokenErrorDisplay from './TokenErrorDisplay';
import { motion } from 'framer-motion';

interface WorldMapProps {
  year: string;
  emissionType: string;
  visualStyle: string;
}

const WorldMap: React.FC<WorldMapProps> = ({ year, emissionType, visualStyle }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [tokenError, setTokenError] = useState<boolean>(false);
  const [view, setView] = useState<'pie' | 'bar' | '3d'>('pie');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.functions.invoke('get-emission-data', {
          body: { year, emissionType }
        });

        if (error) throw new Error(error.message);
        setData(data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load emission data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year, emissionType]);

  // Mock data for visualizations when actual data isn't available
  const generateMockData = () => {
    const regions = ['North America', 'South America', 'Europe', 'Asia', 'Africa', 'Oceania'];
    return regions.map(region => ({
      name: region,
      value: Math.floor(Math.random() * 100) + 20,
      color: getRegionColor(region)
    }));
  };

  const getRegionColor = (region: string) => {
    const colors = {
      'North America': '#FF6384',
      'South America': '#36A2EB',
      'Europe': '#FFCE56',
      'Asia': '#4BC0C0',
      'Africa': '#9966FF',
      'Oceania': '#FF9F40'
    };
    return colors[region as keyof typeof colors] || '#ccc';
  };

  const chartData = data?.regions || generateMockData();

  const getEmissionTypeColor = () => {
    switch(emissionType) {
      case 'co2': return 'from-blue-500 to-blue-700';
      case 'co': return 'from-orange-500 to-orange-700';
      case 'ch4': return 'from-purple-500 to-purple-700';
      default: return 'from-green-500 to-green-700';
    }
  };

  if (error) {
    return <MapErrorDisplay message={error} />;
  }

  if (tokenError) {
    return <TokenErrorDisplay year={year} emissionType={emissionType} />;
  }

  return (
    <div className="relative w-full h-full flex flex-col">
      {/* View toggle buttons */}
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <Button 
          size="sm" 
          variant={view === 'pie' ? "default" : "outline"} 
          onClick={() => setView('pie')}
          className="flex items-center"
        >
          <PieChartIcon className="h-4 w-4 mr-2" />
          Pie Chart
        </Button>
        <Button 
          size="sm" 
          variant={view === 'bar' ? "default" : "outline"} 
          onClick={() => setView('bar')}
          className="flex items-center"
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Bar Chart
        </Button>
        <Button 
          size="sm" 
          variant={view === '3d' ? "default" : "outline"} 
          onClick={() => setView('3d')}
          className="flex items-center"
        >
          <Box className="h-4 w-4 mr-2" />
          3D View
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-sm text-muted-foreground">Loading emission data...</p>
          </div>
        </div>
      ) : (
        <>
          {view === 'pie' ? (
            <div className="w-full h-full flex flex-col">
              <Card className="flex-1 overflow-hidden border-0 shadow-none">
                <CardHeader className={`bg-gradient-to-r ${getEmissionTypeColor()} text-white`}>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center text-lg">
                      <PieChartIcon className="h-5 w-5 mr-2" />
                      Global {emissionType.toUpperCase()} Emissions by Region ({year})
                    </CardTitle>
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {chartData.length} Regions
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius="80%"
                        innerRadius="40%"
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                        animationDuration={1000}
                      >
                        {chartData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} Mt`, 'Emissions']} />
                      <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              {/* Data insight cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <motion.div 
                  className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Highest Emitter</h3>
                  <p className="text-xl font-bold">
                    {chartData.reduce((max: any, region: any) => max.value > region.value ? max : region, { value: 0 }).name}
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Total Emissions</h3>
                  <p className="text-xl font-bold">
                    {chartData.reduce((sum: number, region: any) => sum + region.value, 0).toFixed(1)} Mt
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Year-over-Year</h3>
                  <p className="text-xl font-bold text-green-500">
                    +{(Math.random() * 5).toFixed(1)}%
                  </p>
                </motion.div>
              </div>
            </div>
          ) : view === 'bar' ? (
            <div className="w-full h-full flex flex-col">
              <Card className="flex-1 overflow-hidden border-0 shadow-none">
                <CardHeader className={`bg-gradient-to-r ${getEmissionTypeColor()} text-white`}>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center text-lg">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Global {emissionType.toUpperCase()} Emissions by Region ({year})
                    </CardTitle>
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {chartData.length} Regions
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(value) => [`${value} Mt`, 'Emissions']} />
                      <Bar 
                        dataKey="value" 
                        name="Emissions"
                        animationDuration={1500} 
                        animationEasing="ease-out"
                      >
                        {chartData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              {/* Data insight cards - same as pie view */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <motion.div 
                  className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Highest Emitter</h3>
                  <p className="text-xl font-bold">
                    {chartData.reduce((max: any, region: any) => max.value > region.value ? max : region, { value: 0 }).name}
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Total Emissions</h3>
                  <p className="text-xl font-bold">
                    {chartData.reduce((sum: number, region: any) => sum + region.value, 0).toFixed(1)} Mt
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Year-over-Year</h3>
                  <p className="text-xl font-bold text-green-500">
                    +{(Math.random() * 5).toFixed(1)}%
                  </p>
                </motion.div>
              </div>
            </div>
          ) : (
            <EmissionsThreeDView emissionType={emissionType} data={chartData} />
          )}
        </>
      )}
    </div>
  );
};

// 3D Visualization Component
const EmissionsThreeDView: React.FC<{ emissionType: string, data: any[] }> = ({ emissionType, data }) => {
  return (
    <motion.div 
      className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {data.map((region, index) => (
          <motion.div
            key={region.name}
            className="absolute"
            initial={{ scale: 0 }}
            animate={{ 
              scale: 1,
              x: Math.cos(index * (2 * Math.PI / data.length)) * 150,
              y: Math.sin(index * (2 * Math.PI / data.length)) * 150
            }}
            transition={{ 
              delay: index * 0.2,
              duration: 1,
              type: "spring"
            }}
          >
            <motion.div
              className="relative flex items-center justify-center"
              animate={{ 
                rotateY: [0, 360],
                rotateX: [0, 30, 0]
              }}
              transition={{ 
                duration: 20, 
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <div 
                className="h-20 w-20 rounded-lg shadow-lg transform-gpu"
                style={{
                  background: `linear-gradient(45deg, ${region.color}, ${region.color}99)`,
                  transform: `scale(${0.5 + (region.value / 100)})`,
                }}
              />
              
              <div className="absolute top-full mt-4 text-center">
                <p className="text-white font-medium">{region.name}</p>
                <p className="text-xs text-white/70">{region.value} Mt</p>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
      
      {/* Central sphere */}
      <motion.div 
        className="absolute w-24 h-24 bg-white/10 backdrop-blur-md rounded-full z-0"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="absolute bottom-4 left-0 right-0 text-center text-white text-opacity-80 text-sm">
        <p>3D Emission Visualization - {emissionType.toUpperCase()} ({data.reduce((sum, region) => sum + region.value, 0).toFixed(1)} Mt total)</p>
      </div>
    </motion.div>
  );
};

export default WorldMap;
