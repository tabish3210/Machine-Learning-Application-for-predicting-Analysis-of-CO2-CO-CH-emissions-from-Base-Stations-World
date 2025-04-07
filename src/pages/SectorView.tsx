
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Info, AlertTriangle, ShieldCheck } from "lucide-react";
import SectorEmissionChart from '@/components/charts/SectorEmissionChart';
import { capitalCase } from 'change-case';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

const SectorView = () => {
  const { sectorId } = useParams<{ sectorId: string }>();
  const [year, setYear] = useState<string>("2023");
  const [emissionType, setEmissionType] = useState<string>("co2");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  
  const sectorName = sectorId ? capitalCase(sectorId) : '';
  
  const yearOptions = ["2018", "2019", "2020", "2021", "2022", "2023"];
  
  const emissionTypes = [
    { value: "co2", label: "Carbon Dioxide (CO₂)" },
    { value: "co", label: "Carbon Monoxide (CO)" },
    { value: "ch4", label: "Methane (CH₄)" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('get-emission-data', {
          body: { year, emissionType, sector: sectorId }
        });

        if (error) throw new Error(error.message);
        setData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching sector data:', err);
        setError('Failed to load sector data');
        setLoading(false);
      }
    };

    if (sectorId) {
      fetchData();
    }
  }, [sectorId, year, emissionType]);

  return (
    <AppLayout>
      <div className="p-4 lg:p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{sectorName} Sector Emissions</h1>
            <p className="text-muted-foreground">Global and regional emissions by sector</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={emissionType} onValueChange={setEmissionType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Emission Type" />
              </SelectTrigger>
              <SelectContent>
                {emissionTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Alert className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Climate Impact Warning</AlertTitle>
          <AlertDescription>
            {emissionType === 'co2' ? 
              'Rising CO₂ emissions contribute significantly to global warming, with the energy sector being one of the largest contributors.' : 
              emissionType === 'co' ? 
              'Carbon Monoxide emissions contribute to air pollution and can cause respiratory issues when concentrated in urban areas.' : 
              'Methane is a potent greenhouse gas with over 25 times the warming potential of CO₂ over a 100-year period.'}
          </AlertDescription>
        </Alert>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Global {sectorName} {emissionType === 'co2' ? 'CO₂' : emissionType === 'co' ? 'CO' : 'CH₄'} Emissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <SectorEmissionChart 
                  sectorId={sectorId || ''}
                  year={year}
                  emissionType={emissionType}
                  chartType="global"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{sectorName} Emissions by Region</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <SectorEmissionChart 
                  sectorId={sectorId || ''}
                  year={year}
                  emissionType={emissionType}
                  chartType="byRegion"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="trends">
          <TabsList>
            <TabsTrigger value="trends">Historical Trends</TabsTrigger>
            <TabsTrigger value="stations">Base Station Intensity</TabsTrigger>
            <TabsTrigger value="efficiency">Efficiency Analysis</TabsTrigger>
            <TabsTrigger value="threats">Threats & Precautions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trends" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>{sectorName} Sector Historical Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <SectorEmissionChart 
                    sectorId={sectorId || ''}
                    emissionType={emissionType}
                    chartType="trends"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stations" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Base Station Emission Intensity by Region</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <SectorEmissionChart 
                    sectorId={sectorId || ''}
                    year={year}
                    emissionType={emissionType}
                    chartType="stationIntensity"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="efficiency" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Efficiency Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <SectorEmissionChart 
                    sectorId={sectorId || ''}
                    year={year}
                    emissionType={emissionType}
                    chartType="efficiency"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="threats" className="pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Environmental Threats
                  </CardTitle>
                  <CardDescription>
                    Critical threats related to emissions from the {sectorName} sector
                  </CardDescription>
                </CardHeader>
                <CardContent className="max-h-[500px] overflow-y-auto">
                  {loading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ) : data?.threats ? (
                    <div className="space-y-4">
                      {data.threats.map((threat: any) => (
                        <div key={threat.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">{threat.threat}</h3>
                            <Badge className={`${
                              threat.severity === 'High' ? 'bg-red-500' : 
                              threat.severity === 'Medium' ? 'bg-amber-500' : 'bg-green-500'
                            }`}>
                              {threat.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{threat.impact}</p>
                          <div className="mt-2 text-xs text-muted-foreground">
                            Region: {threat.region}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No threat data available
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-green-500" />
                    Safety Measures & Precautions
                  </CardTitle>
                  <CardDescription>
                    Recommended actions to mitigate emissions in the {sectorName} sector
                  </CardDescription>
                </CardHeader>
                <CardContent className="max-h-[500px] overflow-y-auto">
                  {loading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  ) : data?.safetyMeasures ? (
                    <div className="space-y-4">
                      {data.safetyMeasures.map((measure: any) => (
                        <div key={measure.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">{measure.measure}</h3>
                            <Badge className={`${
                              measure.effectiveness === 'High' ? 'bg-green-500' : 
                              measure.effectiveness === 'Medium' ? 'bg-amber-500' : 'bg-red-500'
                            }`}>
                              {measure.effectiveness} effectiveness
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{measure.implementation}</p>
                          <div className="mt-2 text-xs text-muted-foreground">
                            Sector: {measure.sector}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No safety measures available
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-blue-500" />
                    Global Mitigation Strategies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Policy Interventions</h3>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Carbon pricing mechanisms, including taxes and cap-and-trade systems</li>
                        <li>Mandatory emissions reporting and reduction targets for industries</li>
                        <li>International cooperation through treaties and agreements</li>
                        <li>Research and development funding for clean technologies</li>
                      </ul>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Technological Solutions</h3>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Advanced scrubber technologies to filter emissions</li>
                        <li>Carbon capture, utilization, and storage (CCUS) implementation</li>
                        <li>Renewable energy integration and grid modernization</li>
                        <li>Energy efficiency improvements in industrial processes</li>
                      </ul>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Economic Considerations</h3>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                        <li>Green financing initiatives to support transition</li>
                        <li>Job creation in renewable and clean energy sectors</li>
                        <li>Market-based incentives for emissions reduction</li>
                        <li>Cost-benefit analysis of mitigation measures</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default SectorView;
