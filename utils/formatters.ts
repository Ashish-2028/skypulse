// Formatting utilities for weather data display

export function formatTemperature(temp: number, unit: 'celsius' | 'fahrenheit' = 'celsius'): string {
  const value = unit === 'fahrenheit' ? (temp * 9/5) + 32 : temp;
  return `${Math.round(value)}°`;
}

export function formatWindSpeed(speed: number, unit: 'kmh' | 'mph' = 'kmh'): string {
  const value = unit === 'mph' ? speed * 0.621371 : speed;
  return `${Math.round(value)} ${unit === 'mph' ? 'mph' : 'km/h'}`;
}

export function formatPrecipitation(mm: number, unit: 'mm' | 'inch' = 'mm'): string {
  const value = unit === 'inch' ? mm * 0.0393701 : mm;
  return `${value.toFixed(1)} ${unit}`;
}

export function formatPressure(hPa: number): string {
  return `${Math.round(hPa)} hPa`;
}

export function formatVisibility(km: number): string {
  if (km >= 1) return `${km.toFixed(1)} km`;
  return `${Math.round(km * 1000)} m`;
}

export function formatHumidity(percent: number): string {
  return `${Math.round(percent)}%`;
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function formatHour(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  // If it's the current hour, show "Now"
  if (date.getHours() === now.getHours() && date.getDate() === now.getDate()) {
    return 'Now';
  }
  return date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
}

export function formatDay(isoString: string): string {
  const date = new Date(isoString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

  return date.toLocaleDateString([], { weekday: 'short' });
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

export function getUVLevel(index: number): { level: string; color: string } {
  if (index <= 2) return { level: 'Low', color: '#4CAF50' };
  if (index <= 5) return { level: 'Moderate', color: '#FFC107' };
  if (index <= 7) return { level: 'High', color: '#FF9800' };
  if (index <= 10) return { level: 'Very High', color: '#F44336' };
  return { level: 'Extreme', color: '#9C27B0' };
}

export function getAQILevel(aqi: number): { level: string; color: string } {
  if (aqi <= 50) return { level: 'Good', color: '#4CAF50' };
  if (aqi <= 100) return { level: 'Moderate', color: '#FFC107' };
  if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: '#FF9800' };
  if (aqi <= 200) return { level: 'Unhealthy', color: '#F44336' };
  if (aqi <= 300) return { level: 'Very Unhealthy', color: '#9C27B0' };
  return { level: 'Hazardous', color: '#800000' };
}

export function getSunProgress(sunrise: string, sunset: string): number {
  const now = new Date();
  const sunriseDate = new Date(sunrise);
  const sunsetDate = new Date(sunset);
  const totalDaylight = sunsetDate.getTime() - sunriseDate.getTime();
  const elapsed = now.getTime() - sunriseDate.getTime();
  return Math.max(0, Math.min(1, elapsed / totalDaylight));
}
