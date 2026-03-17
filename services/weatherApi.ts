// Open-Meteo Weather Forecast API client

import { CurrentWeather, HourlyForecast, DailyForecast } from '@/types/weather';
import { API_BASE, HOURLY_PARAMS, DAILY_PARAMS, CURRENT_PARAMS } from '@/utils/constants';

interface ForecastResponse {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    surface_pressure: number;
    cloud_cover: number;
    uv_index: number;
    visibility: number;
    dew_point_2m: number;
    is_day: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    apparent_temperature: number[];
    relative_humidity_2m: number[];
    weather_code: number[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
    precipitation_probability: number[];
    precipitation: number[];
    visibility: number[];
    uv_index: number[];
    is_day: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
    wind_direction_10m_dominant: number[];
  };
}

export async function fetchWeatherData(
  latitude: number,
  longitude: number,
  timezone: string = 'auto'
): Promise<{ current: CurrentWeather; hourly: HourlyForecast; daily: DailyForecast }> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: CURRENT_PARAMS,
    hourly: HOURLY_PARAMS,
    daily: DAILY_PARAMS,
    timezone,
    forecast_days: '7',
  });

  const response = await fetch(`${API_BASE}/forecast?${params}`);

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  const data: ForecastResponse = await response.json();

  const current: CurrentWeather = {
    temperature: data.current.temperature_2m,
    feelsLike: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    windDirection: data.current.wind_direction_10m,
    weatherCode: data.current.weather_code,
    pressure: data.current.surface_pressure,
    cloudCover: data.current.cloud_cover,
    uvIndex: data.current.uv_index,
    visibility: data.current.visibility / 1000, // Convert m to km
    dewPoint: data.current.dew_point_2m,
    isDay: data.current.is_day === 1,
  };

  const hourly: HourlyForecast = {
    time: data.hourly.time,
    temperature: data.hourly.temperature_2m,
    feelsLike: data.hourly.apparent_temperature,
    humidity: data.hourly.relative_humidity_2m,
    weatherCode: data.hourly.weather_code,
    windSpeed: data.hourly.wind_speed_10m,
    windDirection: data.hourly.wind_direction_10m,
    precipitationProbability: data.hourly.precipitation_probability,
    precipitation: data.hourly.precipitation,
    visibility: data.hourly.visibility,
    uvIndex: data.hourly.uv_index,
    isDay: data.hourly.is_day,
  };

  const daily: DailyForecast = {
    time: data.daily.time,
    weatherCode: data.daily.weather_code,
    temperatureMax: data.daily.temperature_2m_max,
    temperatureMin: data.daily.temperature_2m_min,
    sunrise: data.daily.sunrise,
    sunset: data.daily.sunset,
    uvIndexMax: data.daily.uv_index_max,
    precipitationSum: data.daily.precipitation_sum,
    precipitationProbabilityMax: data.daily.precipitation_probability_max,
    windSpeedMax: data.daily.wind_speed_10m_max,
    windDirection: data.daily.wind_direction_10m_dominant,
  };

  return { current, hourly, daily };
}
