'use client';

import { CurrentWeather, DailyForecast } from '@/types/weather';
import { formatTemperature } from '@/utils/formatters';
import { getWeatherCondition } from '@/utils/weatherCodes';
import { TemperatureUnit } from '@/types/weather';
import WeatherIcon from '@/components/WeatherIcon/WeatherIcon';
import styles from './WeatherHero.module.css';

interface WeatherHeroProps {
  current: CurrentWeather;
  daily: DailyForecast;
  locationName: string;
  locationCountry: string;
  unit: TemperatureUnit;
}

export default function WeatherHero({ current, daily, locationName, locationCountry, unit }: WeatherHeroProps) {
  const condition = getWeatherCondition(current.weatherCode);

  return (
    <div className={`${styles.hero} ${styles[condition.background]}`}>
      <div className={styles.glassOverlay} />
      <div className={styles.content}>
        <div className={styles.location}>
          <svg className={styles.locationIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{locationName}, {locationCountry}</span>
        </div>
        
        <div className={styles.mainTemp}>
          <WeatherIcon code={current.weatherCode} isDay={current.isDay} size={100} />
          <div className={styles.tempBlock}>
            <span className={styles.temperature}>
              {formatTemperature(current.temperature, unit)}
            </span>
            <p className={styles.condition}>{condition.description}</p>
          </div>
        </div>

        <div className={styles.details}>
          <div className={styles.detailPill}>
            <span className={styles.detailLabel}>Feels like</span>
            <span className={styles.detailValue}>{formatTemperature(current.feelsLike, unit)}</span>
          </div>
          <div className={styles.detailPill}>
            <span className={styles.detailLabel}>High</span>
            <span className={styles.detailValue}>{formatTemperature(daily.temperatureMax[0], unit)}</span>
          </div>
          <div className={styles.detailPill}>
            <span className={styles.detailLabel}>Low</span>
            <span className={styles.detailValue}>{formatTemperature(daily.temperatureMin[0], unit)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
