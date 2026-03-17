'use client';

import { useState, useEffect, useCallback } from 'react';
import { WeatherData, LocationData } from '@/types/weather';
import { fetchWeatherData } from '@/services/weatherApi';
import { fetchAirQuality } from '@/services/airQualityApi';
import { DEFAULT_LOCATION } from '@/utils/constants';

export function useWeather() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationData>(DEFAULT_LOCATION);

  const loadWeather = useCallback(async (loc: LocationData) => {
    setLoading(true);
    setError(null);
    try {
      const [weather, airQuality] = await Promise.all([
        fetchWeatherData(loc.latitude, loc.longitude, loc.timezone),
        fetchAirQuality(loc.latitude, loc.longitude),
      ]);

      setWeatherData({
        current: weather.current,
        hourly: weather.hourly,
        daily: weather.daily,
        location: loc,
        airQuality,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeather(location);
  }, [location, loadWeather]);

  const updateLocation = useCallback((newLocation: LocationData) => {
    setLocation(newLocation);
  }, []);

  const refresh = useCallback(() => {
    loadWeather(location);
  }, [location, loadWeather]);

  return { weatherData, loading, error, location, updateLocation, refresh };
}
