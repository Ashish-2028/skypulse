'use client';

import { useEffect, useState, useCallback } from 'react';
import { useWeather } from '@/hooks/useWeather';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { TemperatureUnit, WindSpeedUnit, LocationData } from '@/types/weather';
import WeatherBackground from '@/components/WeatherBackground/WeatherBackground';
import SearchBar from '@/components/SearchBar/SearchBar';
import WeatherHero from '@/components/WeatherHero/WeatherHero';
import HourlyForecast from '@/components/HourlyForecast/HourlyForecast';
import DailyForecast from '@/components/DailyForecast/DailyForecast';
import WeatherDetails from '@/components/WeatherDetails/WeatherDetails';
import AirQuality from '@/components/AirQuality/AirQuality';
import SunriseSunset from '@/components/SunriseSunset/SunriseSunset';
import TemperatureChart from '@/components/TemperatureChart/TemperatureChart';
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle';
import UnitToggle from '@/components/UnitToggle/UnitToggle';
import SavedLocations from '@/components/SavedLocations/SavedLocations';

export default function Home() {
  const { weatherData, loading, error, updateLocation, refresh } = useWeather();
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('weather-theme', 'dark');
  const [tempUnit, setTempUnit] = useLocalStorage<TemperatureUnit>('weather-temp-unit', 'celsius');
  const [windUnit] = useLocalStorage<WindSpeedUnit>('weather-wind-unit', 'kmh');
  const [savedLocations, setSavedLocations] = useLocalStorage<LocationData[]>('weather-saved-locations', []);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleUnitToggle = () => {
    setTempUnit((prev) => (prev === 'celsius' ? 'fahrenheit' : 'celsius'));
  };

  const handleLocationSelect = useCallback((location: LocationData) => {
    updateLocation(location);
    setSidebarOpen(false);
  }, [updateLocation]);

  const handleSaveCurrentLocation = useCallback(() => {
    if (weatherData?.location) {
      const loc = weatherData.location;
      const alreadySaved = savedLocations.some(
        (s) => s.latitude === loc.latitude && s.longitude === loc.longitude
      );
      if (!alreadySaved) {
        setSavedLocations((prev) => [...prev, loc]);
      }
    }
  }, [weatherData, savedLocations, setSavedLocations]);

  const handleRemoveLocation = useCallback((index: number) => {
    setSavedLocations((prev) => prev.filter((_, i) => i !== index));
  }, [setSavedLocations]);

  const currentLocation = weatherData?.location || null;

  // Loading state
  if (loading && !weatherData) {
    return (
      <>
        <WeatherBackground weatherCode={0} isDay={true} theme={theme} />
        <div className="appContainer">
          <div className="header">
            <div className="logo">
              <span className="logoIcon">⛅</span>
              SkyPulse
            </div>
            <div className="controls">
              <UnitToggle unit={tempUnit} onToggle={handleUnitToggle} />
              <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
            </div>
          </div>
          <div className="loadingContainer">
            <div className="loadingSpinner" />
            <p className="loadingText">Fetching weather data...</p>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error && !weatherData) {
    return (
      <>
        <WeatherBackground weatherCode={0} isDay={true} theme={theme} />
        <div className="appContainer">
          <div className="header">
            <div className="logo">
              <span className="logoIcon">⛅</span>
              SkyPulse
            </div>
            <div className="controls">
              <UnitToggle unit={tempUnit} onToggle={handleUnitToggle} />
              <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
            </div>
          </div>
          <SearchBar onLocationSelect={handleLocationSelect} />
          <div className="errorContainer">
            <span className="errorIcon">🌧️</span>
            <p className="errorMessage">{error}</p>
            <button className="retryButton" onClick={refresh}>
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!weatherData) return null;

  const { current, hourly, daily, location, airQuality } = weatherData;

  return (
    <>
      <WeatherBackground weatherCode={current.weatherCode} isDay={current.isDay} theme={theme} />

      <div className="appContainer">
        {/* Header */}
        <header className="header">
          <div className="logo">
            <span className="logoIcon">⛅</span>
            SkyPulse
          </div>
          <div className="controls">
            <UnitToggle unit={tempUnit} onToggle={handleUnitToggle} />
            <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
          </div>
        </header>

        {/* Search */}
        <SearchBar onLocationSelect={handleLocationSelect} />

        {/* Main content */}
        <main className="mainContent fadeIn">
          {/* Hero */}
          <WeatherHero
            current={current}
            daily={daily}
            locationName={location.name}
            locationCountry={location.country}
            unit={tempUnit}
          />

          {/* Hourly Forecast */}
          <HourlyForecast hourly={hourly} unit={tempUnit} />

          {/* 7-Day Forecast */}
          <DailyForecast daily={daily} unit={tempUnit} />

          {/* Temperature Chart */}
          <TemperatureChart hourly={hourly} unit={tempUnit} />

          {/* Details Grid */}
          <WeatherDetails
            current={current}
            tempUnit={tempUnit}
            windUnit={windUnit}
          />

          {/* Bottom Row: Sun + Air Quality */}
          <div className="gridRow">
            <SunriseSunset
              sunrise={daily.sunrise[0]}
              sunset={daily.sunset[0]}
            />

            {airQuality && <AirQuality data={airQuality} />}
          </div>
        </main>

        {/* Footer */}
        <footer style={{
          textAlign: 'center',
          padding: '32px 0 16px',
          color: 'var(--text-tertiary)',
          fontSize: '0.8rem',
        }}>
          Powered by <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Open-Meteo</a>
          &nbsp;•&nbsp; Built with Next.js
        </footer>
      </div>

      {/* Saved Locations Sidebar */}
      <SavedLocations
        savedLocations={savedLocations}
        currentLocation={currentLocation}
        onLocationSelect={handleLocationSelect}
        onRemoveLocation={handleRemoveLocation}
        onSaveCurrentLocation={handleSaveCurrentLocation}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
    </>
  );
}
