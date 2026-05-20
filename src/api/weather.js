// src/api/weather.js
// Obtiene datos meteorológicos actuales desde Open-Meteo

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
