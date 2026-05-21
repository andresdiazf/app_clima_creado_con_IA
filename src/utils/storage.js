// src/utils/storage.js
// Persiste las ciudades buscadas recientemente en localStorage

const KEY     = 'weather_recent_cities';
const MAX_ITEMS = 5;

/**
 * Devuelve la lista de ciudades recientes
 * @returns {string[]}
 */
export function getRecentCities() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
}

/**
 * Agrega una ciudad al historial (sin duplicados, máximo MAX_ITEMS)
 * @param {string} city
 */
export function saveCity(city) {
  const cities = getRecentCities().filter(c => c.toLowerCase() !== city.toLowerCase());
  cities.unshift(city);
  localStorage.setItem(KEY, JSON.stringify(cities.slice(0, MAX_ITEMS)));
}


/**
 * Elimina una ciudad específica del historial
 * @param {string} city
 */
export function deleteCity(city) {
  const cities = getRecentCities().filter(c => c.toLowerCase() !== city.toLowerCase());
  localStorage.setItem(KEY, JSON.stringify(cities));
}

/**
 * Elimina todas las ciudades guardadas
 */
export function clearCities() {
  localStorage.removeItem(KEY);
}
