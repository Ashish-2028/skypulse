'use client';

import { useMemo } from 'react';
import { getWeatherCondition } from '@/utils/weatherCodes';
import styles from './WeatherBackground.module.css';

interface WeatherBackgroundProps {
  weatherCode: number;
  isDay: boolean;
  theme: 'light' | 'dark';
}

// Seeded pseudo-random to avoid hydration mismatch (deterministic for same index)
function seeded(index: number, offset: number = 0): number {
  const x = Math.sin((index + 1) * 9301 + offset * 4967) * 49297;
  return x - Math.floor(x);
}

export default function WeatherBackground({ weatherCode, isDay, theme }: WeatherBackgroundProps) {
  const condition = getWeatherCondition(weatherCode);
  const visualMode = theme === 'dark' ? 'night' : (isDay ? 'day' : 'night');
  const bgClass = `${styles.background} ${styles[condition.background]} ${styles[visualMode]}`;

  // Pre-compute particle styles once (deterministic)
  const rainStyles = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => ({
      left: `${seeded(i, 1) * 100}%`,
      animationDelay: `${seeded(i, 2) * 2}s`,
      animationDuration: `${0.4 + seeded(i, 3) * 0.4}s`,
      opacity: 0.15 + seeded(i, 4) * 0.2,
    })), []);

  const snowStyles = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => {
      const size = 4 + seeded(i, 10) * 6;
      return {
        left: `${seeded(i, 11) * 100}%`,
        animationDelay: `${seeded(i, 12) * 5}s`,
        animationDuration: `${3 + seeded(i, 13) * 4}s`,
        width: `${size}px`,
        height: `${size}px`,
        opacity: 0.3 + seeded(i, 14) * 0.4,
      };
    }), []);

  const starStyles = useMemo(() =>
    Array.from({ length: 60 }, (_, i) => {
      const size = 1 + seeded(i, 20) * 2.5;
      return {
        left: `${seeded(i, 21) * 100}%`,
        top: `${seeded(i, 22) * 70}%`,
        animationDelay: `${seeded(i, 23) * 4}s`,
        width: `${size}px`,
        height: `${size}px`,
      };
    }), []);

  const cloudStyles = useMemo(() =>
    Array.from({ length: 4 }, (_, i) => ({
      top: `${8 + i * 18}%`,
      animationDelay: `${i * 5}s`,
      animationDuration: `${25 + seeded(i, 30) * 15}s`,
      transform: `scale(${0.5 + seeded(i, 31) * 0.7})`,
    })), []);

  return (
    <div className={bgClass} aria-hidden="true">
      {/* Ambient gradient orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.orb3} />

      {/* Rain */}
      {(condition.background === 'rainy' || condition.background === 'stormy') && (
        <div className={styles.rainContainer}>
          {rainStyles.map((style, i) => (
            <div key={i} className={styles.raindrop} style={style} />
          ))}
        </div>
      )}

      {/* Snow */}
      {condition.background === 'snowy' && (
        <div className={styles.snowContainer}>
          {snowStyles.map((style, i) => (
            <div key={i} className={styles.snowflake} style={style} />
          ))}
        </div>
      )}

      {/* Stars for night mode */}
      {visualMode === 'night' && (
        <div className={styles.stars}>
          {starStyles.map((style, i) => (
            <div key={i} className={styles.star} style={style} />
          ))}
        </div>
      )}

      {/* Lightning for storms */}
      {condition.background === 'stormy' && (
        <div className={styles.lightning} />
      )}

      {/* Cloud drift */}
      {(condition.background === 'cloudy' || condition.background === 'foggy') && (
        <div className={styles.cloudsContainer}>
          {cloudStyles.map((style, i) => (
            <div
              key={i}
              className={styles.cloud}
              style={{
                ...style,
                opacity: visualMode === 'night' ? 0.03 + seeded(i, 32) * 0.04 : 0.06 + seeded(i, 32) * 0.06,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
