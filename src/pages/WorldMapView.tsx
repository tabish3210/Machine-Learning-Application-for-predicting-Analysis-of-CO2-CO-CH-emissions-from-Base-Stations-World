
import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import WorldMap from '@/components/maps/WorldMap';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EmissionComparisonChart from '@/components/charts/EmissionComparisonChart';

const WorldMapView = () => {
  const [year, setYear] = useState<string>("2023");
  const [emissionType, setEmissionType] = useState<string>("co2");
  const [mapStyle, setMapStyle] = useState<string>("choropleth");

  const yearOptions = ["2018", "2019", "2020", "2021", "2022", "2023"];
  
  const emissionTypes = [
    { value: "co2", label: "Carbon Dioxide (CO₂)" },
    { value: "co", label: "Carbon Monoxide (CO)" },
    { value: "ch4", label: "Methane (CH₄)" }
  ];

  const mapStyles = [
    { value: "choropleth", label: "Choropleth Map" },
    { value: "bubble", label: "Bubble Map" },
    { value: "hexbin", label: "Hexbin Map" }
  ];

  return (
    <AppLayout>
      <div className="p-4 lg:p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Global Emissions View</h1>
            <p className="text-muted-foreground">Interactive visualization of worldwide emission patterns</p>
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
            
            <Select value={mapStyle} onValueChange={setMapStyle}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Map Style" />
              </SelectTrigger>
              <SelectContent>
                {mapStyles.map(style => (
                  <SelectItem key={style.value} value={style.value}>{style.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card className="border">
          <CardHeader className="pb-2">
            <CardTitle>
              Global {emissionType === 'co2' ? 'CO₂' : emissionType === 'co' ? 'CO' : 'CH₄'} Emissions Map ({year})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[600px] w-full">
              <WorldMap 
                year={year} 
                emissionType={emissionType} 
                mapStyle={mapStyle} 
              />
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="regional">
          <TabsList>
            <TabsTrigger value="regional">Regional Comparison</TabsTrigger>
            <TabsTrigger value="historical">Historical Trends</TabsTrigger>
            <TabsTrigger value="percapita">Per Capita Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="regional" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Regional Emission Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <EmissionComparisonChart 
                    year={year} 
                    emissionType={emissionType}
                    chartType="regional"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="historical" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Historical Emission Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <EmissionComparisonChart 
                    year={year}
                    emissionType={emissionType}
                    chartType="historical"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="percapita" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Per Capita Emission Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <EmissionComparisonChart 
                    year={year}
                    emissionType={emissionType}
                    chartType="percapita"
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

export default WorldMapView;
