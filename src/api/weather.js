// src/api/weather.js
// Obtiene datos meteorológicos actuales desde Open-Meteo


import { geocodeCity } from './geocoding.js';
import { describeWeatherCode } from '../utils/format.js';

const WX_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * @param {number} lat
 * @param {number} lon
 * @returns {object} datos del clima actual
 */
export async function fetchWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude:          lat,
    longitude:         lon,
    current:           [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'precipitation',
      'windspeed_10m',
      'weathercode',
    ].join(','),
    windspeed_unit:    'kmh',
    timezone:          'auto',
  });

  const res = await fetch(`${WX_URL}?${params}`);

  if (!res.ok) throw new Error('Error al obtener los datos del clima.');

  const data = await res.json();
  return data.current;
}

/**
 * Obtiene información meteorológica resumida para una ciudad
 * @param {string} cityName
 * @returns {Promise<{ city: string, temperature: number, description: string }>}
 */
export async function getCityWeatherInfo(cityName) {
  try {
    if (!cityName || typeof cityName !== 'string') {
      throw new Error('Debes proporcionar un nombre de ciudad válido.');
    }
    // 1. Obtener coordenadas
    const location = await geocodeCity(cityName);
    // 2. Obtener clima actual
    const wx = await fetchWeather(location.latitude, location.longitude);
    if (!wx || typeof wx.temperature_2m !== 'number' || typeof wx.weathercode !== 'number') {
      throw new Error('No se pudo obtener información meteorológica válida.');
    }
    return {
      city: location.name,
      temperature: wx.temperature_2m,
      description: describeWeatherCode(wx.weathercode)
    };
  } catch (err) {
    // Manejo de errores de red, API o ciudad inválida
    return {
      error: err.message || 'Error desconocido al obtener el clima.'
    };
  }
}
