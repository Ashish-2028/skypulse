// API endpoints and default configuration

export const API_BASE = 'https://api.open-meteo.com/v1';
export const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1';
export const AIR_QUALITY_API = 'https://air-quality-api.open-meteo.com/v1';

// Default location: New Delhi, India
export const DEFAULT_LOCATION = {
  name: 'New Delhi',
  country: 'India',
  admin1: 'Delhi',
  latitude: 28.6139,
  longitude: 77.2090,
  timezone: 'Asia/Kolkata',
};

export const HOURLY_PARAMS = [
  'temperature_2m',
  'apparent_temperature',
  'relative_humidity_2m',
  'weather_code',
  'wind_speed_10m',
  'wind_direction_10m',
  'precipitation_probability',
  'precipitation',
  'visibility',
  'uv_index',
  'is_day',
].join(',');

export const DAILY_PARAMS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'sunrise',
  'sunset',
  'uv_index_max',
  'precipitation_sum',
  'precipitation_probability_max',
  'wind_speed_10m_max',
  'wind_direction_10m_dominant',
].join(',');

export const CURRENT_PARAMS = [
  'temperature_2m',
  'apparent_temperature',
  'relative_humidity_2m',
  'weather_code',
  'wind_speed_10m',
  'wind_direction_10m',
  'surface_pressure',
  'cloud_cover',
  'uv_index',
  'visibility',
  'dew_point_2m',
  'is_day',
].join(',');
