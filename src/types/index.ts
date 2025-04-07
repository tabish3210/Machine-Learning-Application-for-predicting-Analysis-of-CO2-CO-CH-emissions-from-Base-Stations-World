
export interface BaseStation {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    country: string;
    region: string;
  };
  emissions: {
    co2: number;
    co: number;
    ch4: number;
  };
  efficiency: number;
  lastUpdated: string;
}

export interface EmissionData {
  date: string;
  co2: number;
  co: number;
  ch4: number;
}

export interface PredictionData {
  date: string;
  co2: {
    predicted: number;
    lowerBound: number;
    upperBound: number;
  };
  co: {
    predicted: number;
    lowerBound: number;
    upperBound: number;
  };
  ch4: {
    predicted: number;
    lowerBound: number;
    upperBound: number;
  };
}

export interface RegionalData {
  region: string;
  co2: number;
  co: number;
  ch4: number;
  stationCount: number;
}
