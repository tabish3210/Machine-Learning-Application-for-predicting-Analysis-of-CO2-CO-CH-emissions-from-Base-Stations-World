
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SectorEmissionChart from '@/components/charts/SectorEmissionChart';
import { capitalCase } from 'change-case';

const SectorView = () => {
  const { sectorId } = useParams<{ sectorId: string }>();
  const [year, setYear] = useState<string>("2023");
  const [emissionType, setEmissionType] = useState<string>("co2");
  
  const sectorName = sectorId ? capitalCase(sectorId) : '';
  
  const yearOptions = ["2018", "2019", "2020", "2021", "2022", "2023"];
  
  const emissionTypes = [
    { value: "co2", label: "Carbon Dioxide (CO₂)" },
    { value: "co", label: "Carbon Monoxide (CO)" },
    { value: "ch4", label: "Methane (CH₄)" }
  ];

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
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default SectorView;
