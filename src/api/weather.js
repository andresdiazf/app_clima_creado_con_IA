// src/api/weather.js
// Obtiene datos meteorológicos desde Open-Meteo

// ✅ BUENA PRÁCTICA: Importar configuración desde un lugar central
import {
  WEATHER_API_URL,
  WEATHER_CURRENT_PARAMS,
  WEATHER_DAILY_PARAMS,
} from '../config.js';
import { geocodeCity } from './geocoding.js';
import { describeWeatherCode } from '../utils/format.js';

/**
 * Obtiene el clima actual para unas coordenadas
 * 
 * @param {number} lat - Latitud
 * @param {number} lon - Longitud
 * @returns {Promise<object>} Datos del clima actual de Open-Meteo
 * @throws {Error} Si la API falla o no hay conexión
 */
export async function fetchWeather(lat, lon) {
  const params = new URLSearchParams({
    latitude:       lat,
    longitude:      lon,
    current:        WEATHER_CURRENT_PARAMS.join(','),
    windspeed_unit: 'kmh',
    timezone:       'auto',
  });

  const res = await fetch(`${WEATHER_API_URL}?${params}`);

  if (!res.ok) throw new Error('Error al obtener los datos del clima.');

  const data = await res.json();
  return data.current;
}

/**
 * Obtiene el pronóstico del clima para los próximos días
 * 
 * @param {number} lat - Latitud
 * @param {number} lon - Longitud
 * @param {number} days - Número de días (default: 7, máximo: 16)
 * @returns {Promise<Array>} Array con pronóstico diario
 * @throws {Error} Si la API falla o no hay conexión
 */
export async function fetchWeatherForecast(lat, lon, days = 7) {
  const params = new URLSearchParams({
    latitude:       lat,
    longitude:      lon,
    daily:          WEATHER_DAILY_PARAMS.join(','),
    windspeed_unit: 'kmh',
    timezone:       'auto',
    forecast_days:  days,
  });

  const res = await fetch(`${WEATHER_API_URL}?${params}`);

  if (!res.ok) throw new Error('Error al obtener el pronóstico del clima.');

  const data = await res.json();

  // Transformar arrays paralelos de la API en objetos por día
  // La API retorna: { time: [...], temp_max: [...] }
  // Nosotros queremos: [{ date, tempMax, ... }, ...]
  const forecast = [];
  for (let i = 0; i < data.daily.time.length; i++) {
    forecast.push({
      date:                    data.daily.time[i],
      weathercode:             data.daily.weathercode[i],
      tempMax:                 data.daily.temperature_2m_max[i],
      tempMin:                 data.daily.temperature_2m_min[i],
      precipitationProbability: data.daily.precipitation_probability_max[i],
      windSpeed:               data.daily.windspeed_10m_max[i],
    });
  }

  return forecast;
}

/**
 * Obtiene información meteorológica resumida para una ciudad
 * 
 * @param {string} cityName - Nombre de la ciudad
 * @returns {Promise<{ city: string, temperature: number, description: string }|{ error: string }>}
 */
export async function getCityWeatherInfo(cityName) {
  try {
    if (!cityName || typeof cityName !== 'string') {
      throw new Error('Debes proporcionar un nombre de ciudad válido.');
    }
    const location = await geocodeCity(cityName);
    const wx = await fetchWeather(location.latitude, location.longitude);

    if (!wx || typeof wx.temperature_2m !== 'number' || typeof wx.weathercode !== 'number') {
      throw new Error('No se pudo obtener información meteorológica válida.');
    }

    return {
      city:        location.name,
      temperature: wx.temperature_2m,
      description: describeWeatherCode(wx.weathercode),
    };
  } catch (err) {
    return {
      error: err.message || 'Error desconocido al obtener el clima.',
    };
  }
}
