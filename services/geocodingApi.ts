// Open-Meteo Geocoding API client

import { GeocodingResult } from '@/types/weather';
import { GEOCODING_API } from '@/utils/constants';

interface GeocodingResponse {
  results?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    country_code: string;
    admin1?: string;
    timezone: string;
  }>;
}

export async function searchLocations(query: string, count: number = 8): Promise<GeocodingResult[]> {
  if (!query.trim()) return [];

  const params = new URLSearchParams({
    name: query,
    count: count.toString(),
    language: 'en',
    format: 'json',
  });

  const response = await fetch(`${GEOCODING_API}/search?${params}`);

  if (!response.ok) {
    throw new Error(`Geocoding API error: ${response.status}`);
  }

  const data: GeocodingResponse = await response.json();

  return (data.results || []).map((r) => ({
    id: r.id,
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    country: r.country,
    country_code: r.country_code,
    admin1: r.admin1,
    timezone: r.timezone,
  }));
}
