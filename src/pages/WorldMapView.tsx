
import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import WorldMap from '@/components/maps/WorldMap';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  AlertTriangle, 
  Globe, 
  Info, 
  MapPin, 
  ShieldAlert, 
  ShieldCheck, 
  ThermometerSun, 
  Waves 
} from "lucide-react";
import EmissionComparisonChart from '@/components/charts/EmissionComparisonChart';
import { useToast } from '@/hooks/use-toast';

const WorldMapView = () => {
  const [year, setYear] = useState<string>("2023");
  const [emissionType, setEmissionType] = useState<string>("co2");
  const [mapStyle, setMapStyle] = useState<string>("choropleth");
  const [mapError, setMapError] = useState<boolean>(false);
  const [activeHazard, setActiveHazard] = useState<string | null>(null);
  const { toast } = useToast();

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

  // Common climate hazards related to emissions
  const climateHazards = [
    {
      id: "extreme-heat",
      title: "Extreme Heat Events",
      description: "Prolonged periods of abnormally high temperatures that can cause heat-related illnesses and deaths.",
      impacts: [
        "Increased mortality rates, especially among vulnerable populations",
        "Crop failures and reduced agricultural productivity",
        "Higher energy demand for cooling systems"
      ],
      precautions: [
        "Implement early warning systems for heat waves",
        "Create cooling centers in urban areas",
        "Increase urban green spaces to reduce heat island effects"
      ],
      icon: <ThermometerSun className="h-5 w-5" />,
      color: "bg-orange-500"
    },
    {
      id: "sea-level-rise",
      title: "Sea Level Rise",
      description: "Gradual increase in sea levels primarily due to thermal expansion of warming ocean water and melting ice sheets.",
      impacts: [
        "Coastal flooding and erosion of shorelines",
        "Salinization of freshwater sources",
        "Displacement of coastal communities"
      ],
      precautions: [
        "Build sea walls and flood barriers in vulnerable areas",
        "Restore natural coastal barriers like mangroves",
        "Plan managed retreat from high-risk coastal zones"
      ],
      icon: <Waves className="h-5 w-5" />,
      color: "bg-blue-500"
    },
    {
      id: "extreme-weather",
      title: "Extreme Weather Events",
      description: "Increased frequency and intensity of hurricanes, floods, droughts, and other severe weather patterns.",
      impacts: [
        "Infrastructure damage and economic losses",
        "Disruption of food and water supplies",
        "Increased risk of disease outbreaks"
      ],
      precautions: [
        "Strengthen building codes for climate resilience",
        "Improve emergency response systems",
        "Develop climate-adaptive infrastructure"
      ],
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "bg-red-500"
    }
  ];

  // Handle filtering and selection functions
  const handleYearChange = (value: string) => {
    setYear(value);
    toast({
      title: "Year Updated",
      description: `Data now showing for ${value}`,
      duration: 2000,
    });
  };

  const handleEmissionTypeChange = (value: string) => {
    setEmissionType(value);
    toast({
      title: "Emission Type Updated",
      description: `Now showing ${value === 'co2' ? 'Carbon Dioxide' : value === 'co' ? 'Carbon Monoxide' : 'Methane'} data`,
      duration: 2000,
    });
  };

  // Map error handler
  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate checking if the map loaded successfully
      const mapContainer = document.querySelector('.mapboxgl-map');
      if (!mapContainer) {
        setMapError(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Get emission type display name
  const getEmissionDisplayName = () => {
    switch(emissionType) {
      case 'co2': return 'Carbon Dioxide (CO₂)';
      case 'co': return 'Carbon Monoxide (CO)';
      case 'ch4': return 'Methane (CH₄)';
      default: return 'Emissions';
    }
  };

  // Climate impact description based on emission type
  const getClimateImpact = () => {
    switch(emissionType) {
      case 'co2': 
        return 'Carbon dioxide is the primary greenhouse gas contributing to global warming. It persists in the atmosphere for hundreds of years, trapping heat and causing long-term climate change.';
      case 'co': 
        return 'While not a direct greenhouse gas, carbon monoxide affects atmospheric chemistry by reacting with hydroxyl radicals, indirectly increasing concentrations of methane and other greenhouse gases.';
      case 'ch4': 
        return 'Methane is a potent greenhouse gas with over 25 times the warming potential of CO₂ over a 100-year period, though it stays in the atmosphere for less time.';
      default: 
        return 'Greenhouse gases trap heat in the Earth\'s atmosphere, leading to global warming and climate change effects worldwide.';
    }
  };

  // Dynamic styling for the title section based on emission type
  const getTitleStyle = () => {
    switch(emissionType) {
      case 'co2': return 'from-blue-800 to-blue-500';
      case 'co': return 'from-orange-800 to-orange-500';
      case 'ch4': return 'from-purple-800 to-purple-500';
      default: return 'from-green-800 to-green-500';
    }
  };

  return (
    <AppLayout>
      <div className="p-4 lg:p-8 space-y-8">
        {/* Dynamic Header Section */}
        <div className={`rounded-lg bg-gradient-to-r ${getTitleStyle()} p-6 text-white`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Global {getEmissionDisplayName()} Emissions</h1>
              <p className="text-lg opacity-90 mt-1">Interactive visualization of worldwide emission patterns ({year})</p>
              <p className="text-sm opacity-75 mt-2 max-w-2xl">{getClimateImpact()}</p>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Badge variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white/20 px-3 py-1 text-sm">
                Data Updated: April 2025
              </Badge>
              <p className="text-xs opacity-75">Source: Global Carbon Project</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <Select value={year} onValueChange={handleYearChange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {yearOptions.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={emissionType} onValueChange={handleEmissionTypeChange}>
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
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => toast({
              title: "Data Downloaded",
              description: "Emissions data has been downloaded successfully."
            })}>
              Download Data
            </Button>
            
            <Button size="sm" onClick={() => toast({
              title: "Report Generated",
              description: "A detailed report has been sent to your email."
            })}>
              Generate Report
            </Button>
          </div>
        </div>
        
        <Card className="border shadow-lg overflow-hidden">
          <CardHeader className="pb-2 bg-muted/50">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Global {emissionType === 'co2' ? 'CO₂' : emissionType === 'co' ? 'CO' : 'CH₄'} Emissions Map ({year})
              </CardTitle>
              
              <Badge variant={mapError ? "destructive" : "outline"}>
                {mapError ? "Map Visualization Issue" : "Interactive Map"}
              </Badge>
            </div>
            <CardDescription>
              {mapStyle === 'choropleth' 
                ? 'Color intensity represents emission levels by country' 
                : mapStyle === 'bubble' 
                ? 'Bubble size represents total emissions volume' 
                : 'Hexagonal cells show emission density by region'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 p-0">
            <div className="h-[600px] w-full relative bg-slate-100 dark:bg-slate-900">
              {!mapError ? (
                <WorldMap 
                  year={year} 
                  emissionType={emissionType} 
                  mapStyle={mapStyle} 
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div className="bg-background/80 backdrop-blur-sm p-6 rounded-lg max-w-2xl shadow-lg border">
                    <Globe className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">Map Visualization Unavailable</h3>
                    <p className="text-muted-foreground mb-4">
                      We're experiencing issues loading the interactive map. Please check our alternative data visualizations below.
                    </p>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="p-3 border rounded-lg text-center bg-background">
                        <h4 className="font-semibold text-lg">
                          {emissionType === 'co2' ? '36.8' : emissionType === 'co' ? '1.2' : '8.3'} Gt
                        </h4>
                        <p className="text-xs text-muted-foreground">Global Emissions ({year})</p>
                      </div>
                      <div className="p-3 border rounded-lg text-center bg-background">
                        <h4 className="font-semibold text-lg">
                          {emissionType === 'co2' ? '+1.2%' : emissionType === 'co' ? '-0.5%' : '+2.1%'}
                        </h4>
                        <p className="text-xs text-muted-foreground">Year-over-Year Change</p>
                      </div>
                      <div className="p-3 border rounded-lg text-center bg-background">
                        <h4 className="font-semibold text-lg">
                          {emissionType === 'co2' ? '4.8' : emissionType === 'co' ? '0.2' : '1.1'} t
                        </h4>
                        <p className="text-xs text-muted-foreground">Per Capita Average</p>
                      </div>
                    </div>
                    <Button className="mt-6 mx-auto" onClick={() => window.location.reload()}>
                      Reload Map
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Climate Hazards and Precautions Section */}
        <Card className="border shadow-lg overflow-hidden">
          <CardHeader className="bg-muted/50">
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" />
              Climate Hazards & Precautions
            </CardTitle>
            <CardDescription>
              Environmental threats associated with increasing {getEmissionDisplayName()} emissions
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                {climateHazards.map((hazard) => (
                  <Button
                    key={hazard.id}
                    variant={activeHazard === hazard.id ? "default" : "outline"}
                    className="flex gap-2 items-center"
                    onClick={() => setActiveHazard(hazard.id === activeHazard ? null : hazard.id)}
                  >
                    <span className={`p-1 rounded-full ${hazard.color} text-white`}>
                      {hazard.icon}
                    </span>
                    {hazard.title}
                  </Button>
                ))}
              </div>
              
              {activeHazard && (
                <div className="mt-6 bg-muted/30 rounded-lg p-4 border animate-fade-in">
                  {climateHazards.filter(h => h.id === activeHazard).map(hazard => (
                    <div key={hazard.id} className="space-y-4">
                      <div className="flex gap-3 items-center">
                        <span className={`p-2 rounded-full ${hazard.color} text-white`}>
                          {hazard.icon}
                        </span>
                        <div>
                          <h3 className="font-semibold text-lg">{hazard.title}</h3>
                          <p className="text-muted-foreground">{hazard.description}</p>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6 pt-2">
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            Potential Impacts
                          </h4>
                          <ul className="space-y-2">
                            {hazard.impacts.map((impact, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="rounded-full bg-amber-500/10 p-1 mt-0.5">
                                  <MapPin className="h-3 w-3 text-amber-500" />
                                </span>
                                <span className="text-sm">{impact}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-green-500" />
                            Precautions & Mitigations
                          </h4>
                          <ul className="space-y-2">
                            {hazard.precautions.map((precaution, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="rounded-full bg-green-500/10 p-1 mt-0.5">
                                  <Info className="h-3 w-3 text-green-500" />
                                </span>
                                <span className="text-sm">{precaution}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {!activeHazard && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Climate Hazards Information</AlertTitle>
                  <AlertDescription>
                    Select a climate hazard above to view detailed information about its impacts and recommended precautions.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="regional">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="regional">Regional Comparison</TabsTrigger>
            <TabsTrigger value="historical">Historical Trends</TabsTrigger>
            <TabsTrigger value="percapita">Per Capita Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="regional" className="pt-4 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Regional Emission Comparison
                </CardTitle>
                <CardDescription>
                  Comparing {getEmissionDisplayName()} emissions across major global regions in {year}
                </CardDescription>
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
          
          <TabsContent value="historical" className="pt-4 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Historical Emission Trends
                </CardTitle>
                <CardDescription>
                  {getEmissionDisplayName()} emission patterns over time (2018-{year})
                </CardDescription>
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
          
          <TabsContent value="percapita" className="pt-4 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Per Capita Emission Analysis
                </CardTitle>
                <CardDescription>
                  {getEmissionDisplayName()} emissions per person across different regions
                </CardDescription>
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

        {/* Mitigation Strategies */}
        <Card className="border shadow-lg">
          <CardHeader className="bg-muted/50">
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              Emission Reduction Strategies
            </CardTitle>
            <CardDescription>
              Approaches to mitigate {getEmissionDisplayName()} emissions and their environmental impact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h3 className="font-medium text-lg">Policy Measures</h3>
                <Separator />
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <Badge variant="outline" className="mt-0.5">01</Badge>
                    <span>Carbon pricing through taxes or cap-and-trade systems</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Badge variant="outline" className="mt-0.5">02</Badge>
                    <span>Renewable energy mandates and subsidies</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Badge variant="outline" className="mt-0.5">03</Badge>
                    <span>Emissions standards for vehicles and industry</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Badge variant="outline" className="mt-0.5">04</Badge>
                    <span>International climate agreements and partnerships</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium text-lg">Technological Solutions</h3>
                <Separator />
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <Badge variant="outline" className="mt-0.5">01</Badge>
                    <span>Carbon capture and storage (CCS) implementation</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Badge variant="outline" className="mt-0.5">02</Badge>
                    <span>Renewable energy deployment (solar, wind, hydro)</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Badge variant="outline" className="mt-0.5">03</Badge>
                    <span>Electric vehicles and sustainable transportation</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Badge variant="outline" className="mt-0.5">04</Badge>
                    <span>Energy-efficient building design and retrofitting</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium text-lg">Individual Actions</h3>
                <Separator />
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <Badge variant="outline" className="mt-0.5">01</Badge>
                    <span>Reducing energy consumption at home and work</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Badge variant="outline" className="mt-0.5">02</Badge>
                    <span>Choosing low-carbon transportation options</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Badge variant="outline" className="mt-0.5">03</Badge>
                    <span>Adopting plant-rich diets with less meat consumption</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Badge variant="outline" className="mt-0.5">04</Badge>
                    <span>Supporting sustainable and local products and services</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default WorldMapView;
