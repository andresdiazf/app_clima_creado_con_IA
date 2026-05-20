// src/api/geocoding.js
// Convierte el nombre de una ciudad en coordenadas lat/lon
// usando la API gratuita de Open-Meteo (sin API key)

const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';

/**
 * @param {string} city - Nombre de la ciudad
 * @returns {{ name, country, latitude, longitude }}
 */
export async function geocodeCity(city) {
  const url = `${GEO_URL}?name=${encodeURIComponent(city)}&count=1&language=es`;
  const res  = await fetch(url);

  if (!res.ok) throw new Error('Error al conectar con el servicio de geocodificación.');

  const data = await res.json();

  if (!data.results?.length) {
    throw new Error(`No se encontró la ciudad "${city}". Verifica el nombre e intenta de nuevo.`);
  }

  const { name, country, latitude, longitude } = data.results[0];
  return { name, country, latitude, longitude };
}
