
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PieChart as PieChartIcon, BarChart3, LineChart as LineChartIcon } from 'lucide-react';
import VisualizationErrorDisplay from './MapErrorDisplay';
import DataVisualizationFallback from './TokenErrorDisplay';
import { motion, AnimatePresence } from 'framer-motion';
import { ChartContainer } from '@/components/ui/chart';

interface WorldChartProps {
  year: string;
  emissionType: string;
  visualStyle: string;
}

const WorldChart: React.FC<WorldChartProps> = ({ year, emissionType, visualStyle }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [dataError, setDataError] = useState<boolean>(false);
  const [view, setView] = useState<'pie' | 'bar' | 'line'>('pie');

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

  // Generate data for visualizations
  const generateChartData = () => {
    const regions = ['North America', 'South America', 'Europe', 'Asia', 'Africa', 'Oceania'];
    return regions.map(region => ({
      name: region,
      value: Math.floor(Math.random() * 100) + 20,
      color: getRegionColor(region)
    }));
  };

  const generateLineData = () => {
    const years = ['2018', '2019', '2020', '2021', '2022', '2023'];
    return years.map(yr => ({
      year: yr,
      'North America': Math.floor(Math.random() * 50) + 30,
      'Europe': Math.floor(Math.random() * 40) + 20,
      'Asia': Math.floor(Math.random() * 60) + 40,
      'Africa': Math.floor(Math.random() * 30) + 10,
      'South America': Math.floor(Math.random() * 25) + 15,
      'Oceania': Math.floor(Math.random() * 15) + 5,
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

  const chartData = data?.regions || generateChartData();
  const lineData = generateLineData();

  const getEmissionTypeColor = () => {
    switch(emissionType) {
      case 'co2': return 'from-blue-500 to-blue-700';
      case 'co': return 'from-orange-500 to-orange-700';
      case 'ch4': return 'from-purple-500 to-purple-700';
      default: return 'from-green-500 to-green-700';
    }
  };

  if (error) {
    return <VisualizationErrorDisplay message={error} />;
  }

  if (dataError) {
    return <DataVisualizationFallback year={year} emissionType={emissionType} />;
  }

  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="relative w-full h-full flex flex-col"
      initial="hidden"
      animate="show"
      variants={containerAnimation}
    >
      {/* View toggle buttons */}
      <motion.div 
        className="absolute top-4 right-4 z-10 flex space-x-2" 
        variants={itemAnimation}
      >
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
          variant={view === 'line' ? "default" : "outline"} 
          onClick={() => setView('line')}
          className="flex items-center"
        >
          <LineChartIcon className="h-4 w-4 mr-2" />
          Line Chart
        </Button>
      </motion.div>

      {loading ? (
        <motion.div 
          className="flex items-center justify-center h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div 
            className="flex flex-col items-center"
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-sm text-muted-foreground">Loading emission data...</p>
          </motion.div>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          {view === 'pie' ? (
            <motion.div 
              key="pie"
              className="w-full h-full flex flex-col"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
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
                  <motion.div 
                    className="h-full w-full"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      delay: 0.2
                    }}
                  >
                    <ChartContainer config={{ pie: {}, regions: {} }} className="h-full">
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
                            animationDuration={2000}
                            animationBegin={300}
                            animationEasing="ease-out"
                          >
                            {chartData.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} Mt`, 'Emissions']} />
                          <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </motion.div>
                </CardContent>
              </Card>
              
              {/* Data insight cards */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
                variants={containerAnimation}
              >
                <motion.div 
                  className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow"
                  variants={itemAnimation}
                  whileHover={{ scale: 1.03 }}
                >
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Highest Emitter</h3>
                  <p className="text-xl font-bold">
                    {chartData.reduce((max: any, region: any) => max.value > region.value ? max : region, { value: 0 }).name}
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow"
                  variants={itemAnimation}
                  whileHover={{ scale: 1.03 }}
                >
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Total Emissions</h3>
                  <p className="text-xl font-bold">
                    {chartData.reduce((sum: number, region: any) => sum + region.value, 0).toFixed(1)} Mt
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow"
                  variants={itemAnimation}
                  whileHover={{ scale: 1.03 }}
                >
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Year-over-Year</h3>
                  <p className="text-xl font-bold text-green-500">
                    +{(Math.random() * 5).toFixed(1)}%
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          ) : view === 'bar' ? (
            <motion.div 
              key="bar"
              className="w-full h-full flex flex-col"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
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
                  <motion.div 
                    className="h-full w-full"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      delay: 0.2
                    }}
                  >
                    <ChartContainer config={{ bar: {} }} className="h-full">
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
                            animationBegin={300}
                          >
                            {chartData.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </motion.div>
                </CardContent>
              </Card>
              
              {/* Data insight cards - same as pie view */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
                variants={containerAnimation}
              >
                <motion.div 
                  className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow"
                  variants={itemAnimation}
                  whileHover={{ scale: 1.03 }}
                >
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Highest Emitter</h3>
                  <p className="text-xl font-bold">
                    {chartData.reduce((max: any, region: any) => max.value > region.value ? max : region, { value: 0 }).name}
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow"
                  variants={itemAnimation}
                  whileHover={{ scale: 1.03 }}
                >
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Total Emissions</h3>
                  <p className="text-xl font-bold">
                    {chartData.reduce((sum: number, region: any) => sum + region.value, 0).toFixed(1)} Mt
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow"
                  variants={itemAnimation}
                  whileHover={{ scale: 1.03 }}
                >
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Year-over-Year</h3>
                  <p className="text-xl font-bold text-green-500">
                    +{(Math.random() * 5).toFixed(1)}%
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              key="line"
              className="w-full h-full flex flex-col"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="flex-1 overflow-hidden border-0 shadow-none">
                <CardHeader className={`bg-gradient-to-r ${getEmissionTypeColor()} text-white`}>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center text-lg">
                      <LineChartIcon className="h-5 w-5 mr-2" />
                      Global {emissionType.toUpperCase()} Emissions Historical Trend
                    </CardTitle>
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      6 Years History
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex-1">
                  <motion.div 
                    className="h-full w-full"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      delay: 0.2
                    }}
                  >
                    <ChartContainer config={{ line: {} }} className="h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart 
                          data={lineData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="North America" 
                            stroke="#FF6384" 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            animationDuration={1500}
                            animationEasing="ease-out"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="Europe" 
                            stroke="#FFCE56" 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            animationDuration={1500}
                            animationEasing="ease-out" 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="Asia" 
                            stroke="#4BC0C0" 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            animationDuration={1500}
                            animationEasing="ease-out" 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="Africa" 
                            stroke="#9966FF" 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            animationDuration={1500}
                            animationEasing="ease-out" 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </motion.div>
                </CardContent>
              </Card>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
                variants={containerAnimation}
              >
                <motion.div 
                  className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow"
                  variants={itemAnimation}
                  whileHover={{ scale: 1.03 }}
                >
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Highest Growth</h3>
                  <p className="text-xl font-bold">Asia</p>
                </motion.div>
                
                <motion.div 
                  className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow"
                  variants={itemAnimation}
                  whileHover={{ scale: 1.03 }}
                >
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Biggest Reduction</h3>
                  <p className="text-xl font-bold">Europe</p>
                </motion.div>
                
                <motion.div 
                  className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow"
                  variants={itemAnimation}
                  whileHover={{ scale: 1.03 }}
                >
                  <h3 className="text-sm font-semibold text-muted-foreground mb-1">Overall Trend</h3>
                  <p className="text-xl font-bold text-amber-500">+2.3% annually</p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default WorldChart;
