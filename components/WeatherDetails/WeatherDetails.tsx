'use client';

import { CurrentWeather, TemperatureUnit, WindSpeedUnit } from '@/types/weather';
import {
  formatTemperature,
  formatWindSpeed,
  formatPressure,
  formatVisibility,
  formatHumidity,
  getWindDirection,
  getUVLevel,
} from '@/utils/formatters';
import styles from './WeatherDetails.module.css';

interface WeatherDetailsProps {
  current: CurrentWeather;
  tempUnit: TemperatureUnit;
  windUnit: WindSpeedUnit;
}

// Inline SVG detail icons
function WindIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round">
      <path d="M17.7 7.7A2.5 2.5 0 0 1 17 13H2" />
      <path d="M9.6 4.6A2 2 0 0 1 11 9H2" />
      <path d="M12.6 19.4A2 2 0 1 0 14 15H2" />
    </svg>
  );
}

function HumidityIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="var(--color-rain)" opacity="0.2" stroke="var(--color-rain)" strokeWidth="1.5" />
    </svg>
  );
}

function UVIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="5" fill="#fbbf24" opacity="0.3" stroke="#fbbf24" strokeWidth="1.5" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <line key={a} x1={12 + 8 * Math.cos((a * Math.PI) / 180)} y1={12 + 8 * Math.sin((a * Math.PI) / 180)} x2={12 + 10.5 * Math.cos((a * Math.PI) / 180)} y2={12 + 10.5 * Math.sin((a * Math.PI) / 180)} stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
      ))}
    </svg>
  );
}

function FeelsLikeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="9" y="2" width="6" height="16" rx="3" stroke="var(--color-temp-warm)" strokeWidth="1.5" />
      <circle cx="12" cy="18" r="4" fill="var(--color-temp-warm)" opacity="0.3" stroke="var(--color-temp-warm)" strokeWidth="1.5" />
      <rect x="11" y="8" width="2" height="8" rx="1" fill="var(--color-temp-warm)" opacity="0.5" />
    </svg>
  );
}

function VisibilityIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" fill="var(--accent)" opacity="0.2" />
    </svg>
  );
}

function PressureIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="var(--color-temp-mid)" strokeWidth="1.5" />
      <path d="M12 7v5l3 3" stroke="var(--color-temp-mid)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1.5" fill="var(--color-temp-mid)" />
    </svg>
  );
}

function DewPointIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 2.69l4 4a5.66 5.66 0 1 1-8 0z" fill="var(--color-rain)" opacity="0.15" stroke="var(--color-rain)" strokeWidth="1.5" />
      <circle cx="12" cy="14" r="2" fill="var(--color-rain)" opacity="0.3" />
    </svg>
  );
}

function CloudCoverIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="var(--text-secondary)" opacity="0.15" stroke="var(--text-secondary)" strokeWidth="1.5" />
    </svg>
  );
}

const iconMap: Record<string, () => React.ReactElement> = {
  Wind: WindIcon,
  Humidity: HumidityIcon,
  'UV Index': UVIcon,
  'Feels Like': FeelsLikeIcon,
  Visibility: VisibilityIcon,
  Pressure: PressureIcon,
  'Dew Point': DewPointIcon,
  'Cloud Cover': CloudCoverIcon,
};

export default function WeatherDetails({ current, tempUnit, windUnit }: WeatherDetailsProps) {
  const uvInfo = getUVLevel(current.uvIndex);

  const details = [
    {
      label: 'Wind',
      value: formatWindSpeed(current.windSpeed, windUnit),
      subtitle: getWindDirection(current.windDirection),
    },
    {
      label: 'Humidity',
      value: formatHumidity(current.humidity),
      subtitle: current.humidity > 70 ? 'High' : current.humidity > 40 ? 'Moderate' : 'Low',
    },
    {
      label: 'UV Index',
      value: current.uvIndex.toFixed(1),
      subtitle: uvInfo.level,
      accentColor: uvInfo.color,
    },
    {
      label: 'Feels Like',
      value: formatTemperature(current.feelsLike, tempUnit),
      subtitle: current.feelsLike > current.temperature ? 'Warmer' : current.feelsLike < current.temperature ? 'Cooler' : 'Same',
    },
    {
      label: 'Visibility',
      value: formatVisibility(current.visibility),
      subtitle: current.visibility > 10 ? 'Excellent' : current.visibility > 5 ? 'Good' : 'Poor',
    },
    {
      label: 'Pressure',
      value: formatPressure(current.pressure),
      subtitle: current.pressure > 1013 ? 'High' : current.pressure < 1013 ? 'Low' : 'Normal',
    },
    {
      label: 'Dew Point',
      value: formatTemperature(current.dewPoint, tempUnit),
      subtitle: current.dewPoint > 20 ? 'Muggy' : current.dewPoint > 10 ? 'Comfortable' : 'Dry',
    },
    {
      label: 'Cloud Cover',
      value: `${current.cloudCover}%`,
      subtitle: current.cloudCover > 80 ? 'Overcast' : current.cloudCover > 50 ? 'Partly cloudy' : 'Mostly clear',
    },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
        Weather Details
      </h2>
      <div className={styles.grid}>
        {details.map((detail) => {
          const IconComponent = iconMap[detail.label];
          return (
            <div key={detail.label} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>
                  {IconComponent && <IconComponent />}
                </span>
                <span className={styles.cardLabel}>{detail.label}</span>
              </div>
              <div
                className={styles.cardValue}
                style={detail.accentColor ? { color: detail.accentColor } : undefined}
              >
                {detail.value}
              </div>
              <div className={styles.cardSubtitle}>{detail.subtitle}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
