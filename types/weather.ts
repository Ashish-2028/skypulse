// Types for Open-Meteo API responses and app state

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string; // State/province
  timezone: string;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  pressure: number;
  cloudCover: number;
  uvIndex: number;
  visibility: number;
  dewPoint: number;
  isDay: boolean;
}

export interface HourlyForecast {
  time: string[];
  temperature: number[];
  feelsLike: number[];
  humidity: number[];
  weatherCode: number[];
  windSpeed: number[];
  windDirection: number[];
  precipitationProbability: number[];
  precipitation: number[];
  visibility: number[];
  uvIndex: number[];
  isDay: number[];
}

export interface DailyForecast {
  time: string[];
  weatherCode: number[];
  temperatureMax: number[];
  temperatureMin: number[];
  sunrise: string[];
  sunset: string[];
  uvIndexMax: number[];
  precipitationSum: number[];
  precipitationProbabilityMax: number[];
  windSpeedMax: number[];
  windDirection: number[];
}

export interface AirQualityData {
  europeanAqi: number;
  usAqi: number;
  pm2_5: number;
  pm10: number;
  ozone: number;
  nitrogenDioxide: number;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast;
  daily: DailyForecast;
  location: LocationData;
  airQuality: AirQualityData | null;
}

export interface LocationData {
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'kmh' | 'mph';
export type PrecipitationUnit = 'mm' | 'inch';

export interface UserSettings {
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
  precipitationUnit: PrecipitationUnit;
  theme: 'light' | 'dark';
}

export interface SavedLocation extends LocationData {
  id: string;
}
