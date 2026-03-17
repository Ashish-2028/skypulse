'use client';

import { useState } from 'react';
import { LocationData } from '@/types/weather';
import styles from './SavedLocations.module.css';

interface SavedLocationsProps {
  savedLocations: LocationData[];
  currentLocation: LocationData | null;
  onLocationSelect: (location: LocationData) => void;
  onRemoveLocation: (index: number) => void;
  onSaveCurrentLocation: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function SavedLocations({
  savedLocations,
  currentLocation,
  onLocationSelect,
  onRemoveLocation,
  onSaveCurrentLocation,
  isOpen,
  onToggle,
}: SavedLocationsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const isCurrentSaved = currentLocation
    ? savedLocations.some(
        (loc) =>
          loc.latitude === currentLocation.latitude &&
          loc.longitude === currentLocation.longitude
      )
    : false;

  return (
    <>
      {/* Toggle button */}
      <button
        id="sidebar-toggle"
        className={styles.toggleBtn}
        onClick={onToggle}
        title="Saved Locations"
        aria-label="Toggle saved locations"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <span className={styles.badge}>{savedLocations.length}</span>
      </button>

      {/* Overlay */}
      {isOpen && <div className={styles.overlay} onClick={onToggle} />}

      {/* Sidebar panel */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            My Locations
          </h2>
          <button className={styles.closeBtn} onClick={onToggle} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Save current */}
        {currentLocation && !isCurrentSaved && (
          <button className={styles.saveCurrentBtn} onClick={onSaveCurrentLocation}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Save {currentLocation.name}
          </button>
        )}

        {/* Saved list */}
        <div className={styles.locationList}>
          {savedLocations.length === 0 ? (
            <div className={styles.emptyState}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5" opacity="0.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <p>No saved locations yet</p>
              <span>Search for a city and save it here for quick access</span>
            </div>
          ) : (
            savedLocations.map((loc, index) => {
              const isCurrent =
                currentLocation &&
                loc.latitude === currentLocation.latitude &&
                loc.longitude === currentLocation.longitude;

              return (
                <div
                  key={`${loc.latitude}-${loc.longitude}`}
                  className={`${styles.locationCard} ${isCurrent ? styles.active : ''}`}
                  onClick={() => onLocationSelect(loc)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className={styles.locationInfo}>
                    <span className={styles.locationName}>{loc.name}</span>
                    <span className={styles.locationCountry}>
                      {loc.admin && `${loc.admin}, `}{loc.country}
                    </span>
                  </div>
                  <div className={styles.locationActions}>
                    {isCurrent && (
                      <span className={styles.currentBadge}>Current</span>
                    )}
                    {hoveredIndex === index && (
                      <button
                        className={styles.removeBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveLocation(index);
                        }}
                        title="Remove"
                        aria-label="Remove location"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>
    </>
  );
}
