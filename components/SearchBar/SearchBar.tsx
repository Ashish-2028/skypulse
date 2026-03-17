'use client';

import { useState, useEffect, useRef } from 'react';
import { GeocodingResult, LocationData } from '@/types/weather';
import { searchLocations } from '@/services/geocodingApi';
import { useDebounce } from '@/hooks/useDebounce';
import { useGeolocation } from '@/hooks/useGeolocation';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  onLocationSelect: (location: LocationData) => void;
}

export default function SearchBar({ onLocationSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const { getLocation, loading: geoLoading } = useGeolocation();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const search = async () => {
      setSearching(true);
      try {
        const data = await searchLocations(debouncedQuery);
        setResults(data);
        setIsOpen(true);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    };
    search();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (result: GeocodingResult) => {
    onLocationSelect({
      name: result.name,
      country: result.country,
      admin1: result.admin1,
      latitude: result.latitude,
      longitude: result.longitude,
      timezone: result.timezone,
    });
    setQuery('');
    setIsOpen(false);
    setResults([]);
  };

  const handleGeolocate = async () => {
    try {
      const coords = await getLocation();
      // Reverse geocode by searching nearby
      const nearby = await searchLocations(
        `${coords.latitude.toFixed(2)},${coords.longitude.toFixed(2)}`
      );
      if (nearby.length > 0) {
        handleSelect(nearby[0]);
      } else {
        onLocationSelect({
          name: 'Current Location',
          country: '',
          latitude: coords.latitude,
          longitude: coords.longitude,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
      }
    } catch {
      // Geolocation error handled by hook
    }
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.inputWrapper}>
        <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          id="search-location"
          className={styles.input}
          type="text"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
        />
        {searching && <div className={styles.spinner} />}
        <button
          id="geolocate-btn"
          className={styles.geoButton}
          onClick={handleGeolocate}
          disabled={geoLoading}
          title="Use my location"
        >
          {geoLoading ? (
            <div className={styles.spinner} />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
          )}
        </button>
      </div>

      {isOpen && results.length > 0 && (
        <div className={styles.dropdown}>
          {results.map((result) => (
            <button
              key={result.id}
              className={styles.resultItem}
              onClick={() => handleSelect(result)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div className={styles.resultText}>
                <span className={styles.resultName}>{result.name}</span>
                <span className={styles.resultMeta}>
                  {result.admin1 ? `${result.admin1}, ` : ''}{result.country}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
