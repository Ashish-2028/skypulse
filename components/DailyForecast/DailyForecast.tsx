'use client';

import { DailyForecast as DailyData, TemperatureUnit } from '@/types/weather';
import { formatTemperature, formatDay, formatDate } from '@/utils/formatters';
import WeatherIcon from '@/components/WeatherIcon/WeatherIcon';
import styles from './DailyForecast.module.css';

interface DailyForecastProps {
  daily: DailyData;
  unit: TemperatureUnit;
}

export default function DailyForecast({ daily, unit }: DailyForecastProps) {
  const overallMin = Math.min(...daily.temperatureMin);
  const overallMax = Math.max(...daily.temperatureMax);
  const range = overallMax - overallMin;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        7-Day Forecast
      </h2>
      <div className={styles.dayList}>
        {daily.time.map((_, i) => {
          const minPercent = range > 0 ? ((daily.temperatureMin[i] - overallMin) / range) * 100 : 0;
          const maxPercent = range > 0 ? ((daily.temperatureMax[i] - overallMin) / range) * 100 : 100;

          return (
            <div key={daily.time[i]} className={styles.dayRow}>
              <div className={styles.dayInfo}>
                <span className={styles.dayName}>{formatDay(daily.time[i])}</span>
                <span className={styles.dayDate}>{formatDate(daily.time[i])}</span>
              </div>

              <WeatherIcon code={daily.weatherCode[i]} isDay={true} size={32} />

              {daily.precipitationProbabilityMax[i] > 0 ? (
                <span className={styles.precip}>
                  {daily.precipitationProbabilityMax[i]}%
                </span>
              ) : (
                <span className={styles.precipEmpty}></span>
              )}

              <span className={styles.tempMin}>
                {formatTemperature(daily.temperatureMin[i], unit)}
              </span>

              <div className={styles.tempBar}>
                <div
                  className={styles.tempBarFill}
                  style={{
                    left: `${minPercent}%`,
                    right: `${100 - maxPercent}%`,
                  }}
                />
              </div>

              <span className={styles.tempMax}>
                {formatTemperature(daily.temperatureMax[i], unit)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
