
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { year, emissionType, sector, regionId } = await req.json();
    
    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Sample data (in a real app, this would come from your database)
    const globalTrendData = [
      { year: '2018', co2: 8200, co: 92, ch4: 44, sector },
      { year: '2019', co2: 8400, co: 94, ch4: 45, sector },
      { year: '2020', co2: 7800, co: 88, ch4: 43, sector },
      { year: '2021', co2: 8300, co: 93, ch4: 46, sector },
      { year: '2022', co2: 8600, co: 96, ch4: 47, sector },
      { year: '2023', co2: 8800, co: 98, ch4: 48, sector },
    ];

    const regionData = [
      { region: 'US', co2: 2300, co: 24, ch4: 8, sector },
      { region: 'Europe', co2: 1800, co: 18, ch4: 6, sector },
      { region: 'India', co2: 1400, co: 22, ch4: 12, sector },
      { region: 'China', co2: 2700, co: 28, ch4: 16, sector },
      { region: 'Rest of World', co2: 2600, co: 26, ch4: 14, sector },
    ];

    const stationIntensityData = [
      { region: 'US', stations: 12, intensity: 192, sector },
      { region: 'Europe', stations: 16, intensity: 112, sector },
      { region: 'India', stations: 8, intensity: 175, sector },
      { region: 'China', stations: 20, intensity: 135, sector },
      { region: 'Rest of World', stations: 18, intensity: 144, sector },
    ];

    const efficiencyData = [
      { region: 'US', efficiency: 87, emissions: 2300, stations: 12, sector },
      { region: 'Europe', efficiency: 92, emissions: 1800, stations: 16, sector },
      { region: 'India', efficiency: 84, emissions: 1400, stations: 8, sector },
      { region: 'China', efficiency: 81, emissions: 2700, stations: 20, sector },
      { region: 'Rest of World', efficiency: 79, emissions: 2600, stations: 18, sector },
    ];

    const threats = [
      { id: 1, region: 'Global', threat: 'Rising atmospheric CO2 concentration', impact: 'Global warming, ocean acidification', severity: 'High' },
      { id: 2, region: 'Coastal', threat: 'Sea level rise', impact: 'Coastal flooding, habitat destruction', severity: 'High' },
      { id: 3, region: 'US', threat: 'Increased frequency of extreme weather events', impact: 'Infrastructure damage, economic losses', severity: 'Medium' },
      { id: 4, region: 'Europe', threat: 'Changing precipitation patterns', impact: 'Agricultural disruption, water scarcity', severity: 'Medium' },
      { id: 5, region: 'India', threat: 'Heat stress', impact: 'Human health impacts, decreased productivity', severity: 'High' },
      { id: 6, region: 'China', threat: 'Air quality deterioration', impact: 'Respiratory diseases, reduced visibility', severity: 'High' },
    ];

    const safetyMeasures = [
      { id: 1, measure: 'Carbon capture and storage', effectiveness: 'Medium', implementation: 'Industrial scale projects', sector: 'Energy' },
      { id: 2, measure: 'Renewable energy transition', effectiveness: 'High', implementation: 'Policy and infrastructure', sector: 'Energy' },
      { id: 3, measure: 'Improved energy efficiency', effectiveness: 'Medium', implementation: 'Building codes, appliance standards', sector: 'Industry' },
      { id: 4, measure: 'Public transportation investment', effectiveness: 'Medium', implementation: 'Urban planning, infrastructure', sector: 'Transportation' },
      { id: 5, measure: 'Sustainable agriculture', effectiveness: 'Medium', implementation: 'Farming practices, land management', sector: 'Agriculture' },
      { id: 6, measure: 'Reforestation', effectiveness: 'High', implementation: 'Land restoration, conservation', sector: 'Forestry' },
    ];

    // Return the appropriate data based on the request
    let responseData = {};
    
    if (regionId) {
      // Filter data for a specific region if regionId is provided
      responseData = {
        regionData: regionData.filter(item => item.region.toLowerCase() === regionId.toLowerCase()),
        globalTrendData: globalTrendData.filter(item => item.year === year),
        threats: threats.filter(item => item.region === regionId || item.region === 'Global'),
        safetyMeasures: safetyMeasures.filter(item => item.sector === sector)
      };
    } else {
      // Return all data
      responseData = {
        globalTrendData,
        regionData,
        stationIntensityData,
        efficiencyData,
        threats,
        safetyMeasures
      };
    }

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
