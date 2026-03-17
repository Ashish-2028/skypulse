'use client';

import { AirQualityData } from '@/types/weather';
import { getAQILevel } from '@/utils/formatters';
import styles from './AirQuality.module.css';

interface AirQualityProps {
  data: AirQualityData;
}

export default function AirQuality({ data }: AirQualityProps) {
  const aqiInfo = getAQILevel(data.usAqi);
  const gaugePercent = Math.min(100, (data.usAqi / 300) * 100);

  const pollutants = [
    { label: 'PM2.5', value: data.pm2_5, unit: 'μg/m³' },
    { label: 'PM10', value: data.pm10, unit: 'μg/m³' },
    { label: 'O₃', value: data.ozone, unit: 'μg/m³' },
    { label: 'NO₂', value: data.nitrogenDioxide, unit: 'μg/m³' },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 2h8l4 6v8l-4 6H8l-4-6V8z" />
        </svg>
        Air Quality
      </h2>

      <div className={styles.gaugeSection}>
        <div className={styles.aqiValue} style={{ color: aqiInfo.color }}>
          {data.usAqi}
        </div>
        <div className={styles.aqiLabel} style={{ color: aqiInfo.color }}>
          {aqiInfo.level}
        </div>
        <div className={styles.gaugeBar}>
          <div
            className={styles.gaugeFill}
            style={{
              width: `${gaugePercent}%`,
              background: `linear-gradient(90deg, #4CAF50, #FFC107, #FF9800, #F44336, #9C27B0)`,
            }}
          />
          <div
            className={styles.gaugeIndicator}
            style={{ left: `${gaugePercent}%` }}
          />
        </div>
        <div className={styles.gaugeLabels}>
          <span>Good</span>
          <span>Hazardous</span>
        </div>
      </div>

      <div className={styles.pollutants}>
        {pollutants.map((p) => (
          <div key={p.label} className={styles.pollutant}>
            <span className={styles.pollutantLabel}>{p.label}</span>
            <span className={styles.pollutantValue}>
              {p.value != null ? p.value.toFixed(1) : '--'}
            </span>
            <span className={styles.pollutantUnit}>{p.unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
