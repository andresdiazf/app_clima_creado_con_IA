// src/api/geocoding.js
// Convierte el nombre de una ciudad en coordenadas lat/lon
// usando la API gratuita de Open-Meteo (sin API key)

// ✅ BUENA PRÁCTICA: Importar URLs desde config central
// En lugar de escribir la URL aquí directamente, la traemos
// del archivo de configuración. Si cambia la URL, solo
// la actualizamos en config.js y todo el código se actualiza.
import { GEOCODING_API_URL } from '../config.js';

/**
 * Convierte el nombre de una ciudad a coordenadas geográficas
 * 
 * @param {string} city - Nombre de la ciudad a buscar
 * @returns {Promise<{ name: string, country: string, latitude: number, longitude: number }>}
 * @throws {Error} Si la ciudad no se encuentra o hay error de red
 * 
 * @example
 * const location = await geocodeCity('Bogotá');
 * // { name: 'Bogotá', country: 'CO', latitude: 4.61, longitude: -74.08 }
 */
export async function geocodeCity(city) {
  const url = `${GEOCODING_API_URL}?name=${encodeURIComponent(city)}&count=1&language=es`;
  const res  = await fetch(url);

  if (!res.ok) throw new Error('Error al conectar con el servicio de geocodificación.');

  const data = await res.json();

  if (!data.results?.length) {
    throw new Error(`No se encontró la ciudad "${city}". Verifica el nombre e intenta de nuevo.`);
  }

  const { name, country, latitude, longitude } = data.results[0];
  return { name, country, latitude, longitude };
}
