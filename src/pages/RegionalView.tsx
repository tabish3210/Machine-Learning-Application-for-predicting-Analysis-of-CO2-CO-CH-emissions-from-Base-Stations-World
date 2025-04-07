
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RegionalMap from '@/components/maps/RegionalMap';
import RegionalEmissionChart from '@/components/charts/RegionalEmissionChart';
import { capitalCase } from 'change-case';

const RegionalView = () => {
  const { regionId } = useParams<{ regionId: string }>();
  const [year, setYear] = useState<string>("2023");
  const [emissionType, setEmissionType] = useState<string>("co2");
  const [displayType, setDisplayType] = useState<string>("total");
  
  const regionName = regionId ? capitalCase(regionId) : '';
  
  const yearOptions = ["2018", "2019", "2020", "2021", "2022", "2023"];
  
  const emissionTypes = [
    { value: "co2", label: "Carbon Dioxide (CO₂)" },
    { value: "co", label: "Carbon Monoxide (CO)" },
    { value: "ch4", label: "Methane (CH₄)" }
  ];

  const displayTypes = [
    { value: "total", label: "Total Emissions" },
    { value: "percapita", label: "Per Capita" },
    { value: "intensity", label: "Emission Intensity" }
  ];

  return (
    <AppLayout>
      <div className="p-4 lg:p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{regionName} Emissions</h1>
            <p className="text-muted-foreground">Regional analysis and trends</p>
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
            
            <Select value={displayType} onValueChange={setDisplayType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Display Type" />
              </SelectTrigger>
              <SelectContent>
                {displayTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card className="border">
          <CardHeader className="pb-2">
            <CardTitle>
              {regionName} {emissionType === 'co2' ? 'CO₂' : emissionType === 'co' ? 'CO' : 'CH₄'} Emissions ({year})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[500px] w-full">
              <RegionalMap 
                regionId={regionId || ''}
                year={year} 
                emissionType={emissionType} 
                displayType={displayType}
              />
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="trends">
          <TabsList>
            <TabsTrigger value="trends">Emission Trends</TabsTrigger>
            <TabsTrigger value="sectors">Sectoral Breakdown</TabsTrigger>
            <TabsTrigger value="stations">Base Stations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trends" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>{regionName} Emission Historical Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <RegionalEmissionChart 
                    regionId={regionId || ''}
                    emissionType={emissionType}
                    chartType="trends"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sectors" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Sectoral Breakdown of Emissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <RegionalEmissionChart 
                    regionId={regionId || ''}
                    year={year}
                    emissionType={emissionType}
                    chartType="sectors"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stations" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>{regionName} Base Station Emissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <RegionalEmissionChart 
                    regionId={regionId || ''}
                    year={year}
                    emissionType={emissionType}
                    chartType="stations"
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

export default RegionalView;
