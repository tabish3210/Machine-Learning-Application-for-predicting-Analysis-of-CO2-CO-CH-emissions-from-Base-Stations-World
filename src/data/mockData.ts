
import { BaseStation, EmissionData, PredictionData, RegionalData } from "../types";

// Mock base station data
export const baseStations: BaseStation[] = [
  {
    id: "bs-001",
    name: "North America Station 1",
    location: {
      lat: 40.7128,
      lng: -74.006,
      country: "United States",
      region: "North America"
    },
    emissions: {
      co2: 52.3,
      co: 1.8,
      ch4: 0.7
    },
    efficiency: 78,
    lastUpdated: "2023-12-15T14:23:00Z"
  },
  {
    id: "bs-002",
    name: "European Station Alpha",
    location: {
      lat: 48.8566,
      lng: 2.3522,
      country: "France",
      region: "Europe"
    },
    emissions: {
      co2: 45.7,
      co: 1.2,
      ch4: 0.5
    },
    efficiency: 85,
    lastUpdated: "2023-12-15T15:45:00Z"
  },
  {
    id: "bs-003",
    name: "Asian Station Prime",
    location: {
      lat: 35.6762,
      lng: 139.6503,
      country: "Japan",
      region: "Asia"
    },
    emissions: {
      co2: 68.2,
      co: 2.1,
      ch4: 0.9
    },
    efficiency: 72,
    lastUpdated: "2023-12-15T12:15:00Z"
  },
  {
    id: "bs-004",
    name: "South American Hub",
    location: {
      lat: -23.5505,
      lng: -46.6333,
      country: "Brazil",
      region: "South America"
    },
    emissions: {
      co2: 59.4,
      co: 1.9,
      ch4: 0.8
    },
    efficiency: 75,
    lastUpdated: "2023-12-15T17:30:00Z"
  },
  {
    id: "bs-005",
    name: "African Link Station",
    location: {
      lat: -33.9249,
      lng: 18.4241,
      country: "South Africa",
      region: "Africa"
    },
    emissions: {
      co2: 63.1,
      co: 2.0,
      ch4: 0.85
    },
    efficiency: 70,
    lastUpdated: "2023-12-15T13:10:00Z"
  },
  {
    id: "bs-006",
    name: "Oceania Tower",
    location: {
      lat: -33.8688,
      lng: 151.2093,
      country: "Australia",
      region: "Oceania"
    },
    emissions: {
      co2: 48.6,
      co: 1.5,
      ch4: 0.62
    },
    efficiency: 82,
    lastUpdated: "2023-12-15T16:40:00Z"
  },
  {
    id: "bs-007",
    name: "North American Station 2",
    location: {
      lat: 34.0522,
      lng: -118.2437,
      country: "United States",
      region: "North America"
    },
    emissions: {
      co2: 54.8,
      co: 1.7,
      ch4: 0.75
    },
    efficiency: 76,
    lastUpdated: "2023-12-15T18:20:00Z"
  },
  {
    id: "bs-008",
    name: "European Network Node",
    location: {
      lat: 52.5200,
      lng: 13.4050,
      country: "Germany",
      region: "Europe"
    },
    emissions: {
      co2: 44.3,
      co: 1.3,
      ch4: 0.55
    },
    efficiency: 88,
    lastUpdated: "2023-12-15T19:05:00Z"
  }
];

// Mock historical emission data for time series
export const historicalEmissions: EmissionData[] = [
  { date: "2023-01", co2: 48.2, co: 1.5, ch4: 0.65 },
  { date: "2023-02", co2: 49.7, co: 1.6, ch4: 0.68 },
  { date: "2023-03", co2: 51.4, co: 1.7, ch4: 0.70 },
  { date: "2023-04", co2: 52.9, co: 1.8, ch4: 0.73 },
  { date: "2023-05", co2: 53.5, co: 1.8, ch4: 0.74 },
  { date: "2023-06", co2: 54.2, co: 1.9, ch4: 0.75 },
  { date: "2023-07", co2: 55.7, co: 2.0, ch4: 0.78 },
  { date: "2023-08", co2: 56.3, co: 2.0, ch4: 0.79 },
  { date: "2023-09", co2: 55.8, co: 1.9, ch4: 0.77 },
  { date: "2023-10", co2: 54.5, co: 1.8, ch4: 0.75 },
  { date: "2023-11", co2: 53.7, co: 1.7, ch4: 0.74 },
  { date: "2023-12", co2: 52.9, co: 1.7, ch4: 0.73 }
];

// Mock prediction data for future emissions
export const predictionData: PredictionData[] = [
  {
    date: "2024-01",
    co2: { predicted: 53.2, lowerBound: 51.8, upperBound: 54.6 },
    co: { predicted: 1.8, lowerBound: 1.6, upperBound: 2.0 },
    ch4: { predicted: 0.74, lowerBound: 0.70, upperBound: 0.78 }
  },
  {
    date: "2024-02",
    co2: { predicted: 53.8, lowerBound: 52.1, upperBound: 55.5 },
    co: { predicted: 1.8, lowerBound: 1.6, upperBound: 2.0 },
    ch4: { predicted: 0.75, lowerBound: 0.71, upperBound: 0.79 }
  },
  {
    date: "2024-03",
    co2: { predicted: 54.5, lowerBound: 52.5, upperBound: 56.5 },
    co: { predicted: 1.9, lowerBound: 1.7, upperBound: 2.1 },
    ch4: { predicted: 0.76, lowerBound: 0.71, upperBound: 0.81 }
  },
  {
    date: "2024-04",
    co2: { predicted: 55.2, lowerBound: 53.0, upperBound: 57.4 },
    co: { predicted: 1.9, lowerBound: 1.7, upperBound: 2.1 },
    ch4: { predicted: 0.77, lowerBound: 0.72, upperBound: 0.82 }
  },
  {
    date: "2024-05",
    co2: { predicted: 55.8, lowerBound: 53.5, upperBound: 58.1 },
    co: { predicted: 2.0, lowerBound: 1.8, upperBound: 2.2 },
    ch4: { predicted: 0.78, lowerBound: 0.73, upperBound: 0.83 }
  },
  {
    date: "2024-06",
    co2: { predicted: 56.4, lowerBound: 53.9, upperBound: 58.9 },
    co: { predicted: 2.0, lowerBound: 1.8, upperBound: 2.2 },
    ch4: { predicted: 0.79, lowerBound: 0.74, upperBound: 0.84 }
  }
];

// Mock regional data
export const regionalData: RegionalData[] = [
  { region: "North America", co2: 53.5, co: 1.75, ch4: 0.73, stationCount: 15 },
  { region: "Europe", co2: 45.0, co: 1.25, ch4: 0.53, stationCount: 18 },
  { region: "Asia", co2: 68.0, co: 2.20, ch4: 0.92, stationCount: 24 },
  { region: "South America", co2: 59.0, co: 1.90, ch4: 0.81, stationCount: 10 },
  { region: "Africa", co2: 63.0, co: 2.10, ch4: 0.88, stationCount: 8 },
  { region: "Oceania", co2: 48.5, co: 1.50, ch4: 0.63, stationCount: 6 }
];
