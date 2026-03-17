// WMO Weather interpretation codes (WW)
// Maps weather code to human-readable description and icon identifier

export interface WeatherCondition {
  description: string;
  icon: string; // emoji for simplicity
  background: 'clear' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'foggy';
}

const weatherCodeMap: Record<number, WeatherCondition> = {
  0: { description: 'Clear sky', icon: '☀️', background: 'clear' },
  1: { description: 'Mainly clear', icon: '🌤️', background: 'clear' },
  2: { description: 'Partly cloudy', icon: '⛅', background: 'cloudy' },
  3: { description: 'Overcast', icon: '☁️', background: 'cloudy' },
  45: { description: 'Foggy', icon: '🌫️', background: 'foggy' },
  48: { description: 'Depositing rime fog', icon: '🌫️', background: 'foggy' },
  51: { description: 'Light drizzle', icon: '🌦️', background: 'rainy' },
  53: { description: 'Moderate drizzle', icon: '🌦️', background: 'rainy' },
  55: { description: 'Dense drizzle', icon: '🌧️', background: 'rainy' },
  56: { description: 'Light freezing drizzle', icon: '🌧️', background: 'rainy' },
  57: { description: 'Dense freezing drizzle', icon: '🌧️', background: 'rainy' },
  61: { description: 'Slight rain', icon: '🌧️', background: 'rainy' },
  63: { description: 'Moderate rain', icon: '🌧️', background: 'rainy' },
  65: { description: 'Heavy rain', icon: '🌧️', background: 'rainy' },
  66: { description: 'Light freezing rain', icon: '🌧️', background: 'rainy' },
  67: { description: 'Heavy freezing rain', icon: '🌧️', background: 'rainy' },
  71: { description: 'Slight snow', icon: '🌨️', background: 'snowy' },
  73: { description: 'Moderate snow', icon: '🌨️', background: 'snowy' },
  75: { description: 'Heavy snow', icon: '❄️', background: 'snowy' },
  77: { description: 'Snow grains', icon: '❄️', background: 'snowy' },
  80: { description: 'Slight rain showers', icon: '🌦️', background: 'rainy' },
  81: { description: 'Moderate rain showers', icon: '🌧️', background: 'rainy' },
  82: { description: 'Violent rain showers', icon: '⛈️', background: 'stormy' },
  85: { description: 'Slight snow showers', icon: '🌨️', background: 'snowy' },
  86: { description: 'Heavy snow showers', icon: '❄️', background: 'snowy' },
  95: { description: 'Thunderstorm', icon: '⛈️', background: 'stormy' },
  96: { description: 'Thunderstorm with slight hail', icon: '⛈️', background: 'stormy' },
  99: { description: 'Thunderstorm with heavy hail', icon: '⛈️', background: 'stormy' },
};

export function getWeatherCondition(code: number): WeatherCondition {
  return weatherCodeMap[code] || { description: 'Unknown', icon: '🌡️', background: 'clear' as const };
}

export function getWeatherIcon(code: number, isDay: boolean | number): string {
  const condition = getWeatherCondition(code);
  // Replace sun emoji with moon for nighttime clear/partly clear
  if (!isDay || isDay === 0) {
    if (code === 0) return '🌙';
    if (code === 1) return '🌙';
    if (code === 2) return '☁️';
  }
  return condition.icon;
}
