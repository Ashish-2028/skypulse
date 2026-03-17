'use client';

import { HourlyForecast as HourlyData, TemperatureUnit } from '@/types/weather';
import { formatTemperature, formatHour } from '@/utils/formatters';
import WeatherIcon from '@/components/WeatherIcon/WeatherIcon';
import styles from './HourlyForecast.module.css';

interface HourlyForecastProps {
  hourly: HourlyData;
  unit: TemperatureUnit;
}

export default function HourlyForecast({ hourly, unit }: HourlyForecastProps) {
  const now = new Date();
  const currentHourIndex = hourly.time.findIndex(
    (t) => new Date(t).getHours() === now.getHours() && new Date(t).getDate() === now.getDate()
  );
  const startIndex = Math.max(0, currentHourIndex);
  const hours = Array.from({ length: 48 }, (_, i) => startIndex + i).filter(
    (i) => i < hourly.time.length
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        Hourly Forecast
      </h2>
      <div className={styles.scrollContainer}>
        <div className={styles.hourlyList}>
          {hours.slice(0, 48).map((i) => (
            <div key={hourly.time[i]} className={styles.hourCard}>
              <span className={styles.time}>{formatHour(hourly.time[i])}</span>
              <WeatherIcon code={hourly.weatherCode[i]} isDay={hourly.isDay[i]} size={36} />
              <span className={styles.temp}>
                {formatTemperature(hourly.temperature[i], unit)}
              </span>
              {hourly.precipitationProbability[i] > 0 && (
                <span className={styles.rain}>
                  {hourly.precipitationProbability[i]}%
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
