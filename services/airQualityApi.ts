// Open-Meteo Air Quality API client

import { AirQualityData } from '@/types/weather';
import { AIR_QUALITY_API } from '@/utils/constants';

interface AirQualityResponse {
  current: {
    european_aqi: number;
    us_aqi: number;
    pm2_5: number;
    pm10: number;
    ozone: number;
    nitrogen_dioxide: number;
  };
}

export async function fetchAirQuality(
  latitude: number,
  longitude: number
): Promise<AirQualityData | null> {
  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: 'european_aqi,us_aqi,pm2_5,pm10,ozone,nitrogen_dioxide',
      timezone: 'auto',
    });

    const response = await fetch(`${AIR_QUALITY_API}/air-quality?${params}`);

    if (!response.ok) return null;

    const data: AirQualityResponse = await response.json();

    return {
      europeanAqi: data.current.european_aqi,
      usAqi: data.current.us_aqi,
      pm2_5: data.current.pm2_5,
      pm10: data.current.pm10,
      ozone: data.current.ozone,
      nitrogenDioxide: data.current.nitrogen_dioxide,
    };
  } catch {
    return null;
  }
}
