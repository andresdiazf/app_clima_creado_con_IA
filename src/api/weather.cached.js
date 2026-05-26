// src/api/weather.cached.js
// Versión con caché de la API del clima

import { geocodeCity } from './geocoding.js';
import { fetchWeather, getCityWeatherInfo as getWeatherOriginal } from './weather.js';
import { fetchWithCache, getCacheWithOfflineSupport } from '../utils/cache.js';
import { describeWeatherCode } from '../utils/format.js';

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════════════════════════════════════════

// Tiempo de vida del caché (10 minutos)
const WEATHER_CACHE_TTL = 10 * 60 * 1000;

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Genera una clave de caché para una ciudad
 * 
 * @private
 * @param {string} cityName - Nombre de la ciudad
 * @returns {string} Clave de caché
 */
function getCityWeatherCacheKey(cityName) {
  return `city_${cityName.toLowerCase().trim()}`;
}

/**
 * Genera una clave de caché para coordenadas
 * 
 * @private
 * @param {number} lat - Latitud
 * @param {number} lon - Longitud
 * @returns {string} Clave de caché
 */
function getCoordinatesWeatherCacheKey(lat, lon) {
  // Redondear a 2 decimales para agrupar coordenadas cercanas
  const roundedLat = Math.round(lat * 100) / 100;
  const roundedLon = Math.round(lon * 100) / 100;
  return `coords_${roundedLat}_${roundedLon}`;
}

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIONES PRINCIPALES CON CACHÉ
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Obtiene el clima para unas coordenadas con soporte de caché.
 * 
 * Primero intenta obtener datos del caché. Si no hay o expiraron,
 * hace la petición a la API y guarda el resultado.
 * 
 * @async
 * @param {number} lat - Latitud
 * @param {number} lon - Longitud
 * @param {Object} [options] - Opciones
 * @param {boolean} [options.forceRefresh=false] - Forzar actualización
 * @param {number} [options.ttl] - Tiempo de vida del caché personalizado
 * 
 * @returns {Promise<Object>} Resultado con datos y metadatos
 * 
 * @example
 * const result = await fetchWeatherCached(4.6097, -74.0817);
 * 
 * if (result.fromCache) {
 *   console.log('📦 Datos del caché');
 * } else {
 *   console.log('🌐 Datos frescos de la API');
 * }
 * 
 * if (result.offline) {
 *   console.log('⚠️ Sin conexión - mostrando datos antiguos');
 * }
 */
export async function fetchWeatherCached(lat, lon, options = {}) {
  const cacheKey = getCoordinatesWeatherCacheKey(lat, lon);
  
  const result = await fetchWithCache(
    cacheKey,
    () => fetchWeather(lat, lon),
    {
      ttl: options.ttl || WEATHER_CACHE_TTL,
      forceRefresh: options.forceRefresh || false
    }
  );
  
  return result;
}

/**
 * Obtiene información del clima para una ciudad con soporte de caché.
 * 
 * Esta es la función principal que debes usar en tu aplicación.
 * Maneja automáticamente el caché y el modo offline.
 * 
 * @async
 * @param {string} cityName - Nombre de la ciudad
 * @param {Object} [options] - Opciones
 * @param {boolean} [options.forceRefresh=false] - Forzar actualización
 * @param {number} [options.ttl] - Tiempo de vida del caché personalizado
 * 
 * @returns {Promise<Object>} Resultado con datos y metadatos
 * @property {Object} data - Datos del clima
 * @property {boolean} fromCache - true si viene del caché
 * @property {boolean} expired - true si los datos han expirado
 * @property {boolean} offline - true si no hay conexión
 * @property {boolean} success - true si se obtuvieron datos
 * @property {string} [error] - Mensaje de error si falló
 * 
 * @example
 * // Uso básico
 * const result = await getCityWeatherInfoCached('Bogotá');
 * 
 * if (result.success) {
 *   if (result.offline) {
 *     showWarning('Sin conexión - mostrando datos antiguos');
 *   } else if (result.fromCache) {
 *     console.log('Datos del caché');
 *   }
 *   
 *   displayWeather(result.data);
 * } else {
 *   showError(result.error);
 * }
 * 
 * @example
 * // Forzar actualización
 * const result = await getCityWeatherInfoCached('Medellín', {
 *   forceRefresh: true
 * });
 */
export async function getCityWeatherInfoCached(cityName, options = {}) {
  const cacheKey = getCityWeatherCacheKey(cityName);
  
  const result = await fetchWithCache(
    cacheKey,
    () => getWeatherOriginal(cityName),
    {
      ttl: options.ttl || WEATHER_CACHE_TTL,
      forceRefresh: options.forceRefresh || false
    }
  );
  
  return result;
}

/**
 * Obtiene el clima para múltiples ciudades con caché.
 * 
 * Ejecuta las peticiones en paralelo, usando caché cuando está disponible.
 * 
 * @async
 * @param {string[]} cityNames - Array de nombres de ciudades
 * @param {Object} [options] - Opciones
 * @returns {Promise<Array<Object>>} Array de resultados
 * 
 * @example
 * const cities = ['Bogotá', 'Medellín', 'Cali'];
 * const results = await getMultipleCitiesWeatherCached(cities);
 * 
 * results.forEach(result => {
 *   if (result.success) {
 *     console.log(`${result.data.city}: ${result.data.temperature}°C`);
 *     if (result.fromCache) console.log('  (del caché)');
 *   } else {
 *     console.error(`Error: ${result.error}`);
 *   }
 * });
 */
export async function getMultipleCitiesWeatherCached(cityNames, options = {}) {
  if (!Array.isArray(cityNames)) {
    throw new Error('cityNames debe ser un array de strings.');
  }
  
  // Ejecutar todas las peticiones en paralelo
  const promises = cityNames.map(city => 
    getCityWeatherInfoCached(city, options)
  );
  
  return Promise.all(promises);
}

/**
 * Pre-carga el clima de varias ciudades en segundo plano.
 * 
 * Útil para pre-cargar ciudades populares o favoritas del usuario.
 * 
 * @async
 * @param {string[]} cityNames - Array de nombres de ciudades
 * @returns {Promise<Object>} Estadísticas de la pre-carga
 * 
 * @example
 * // Pre-cargar ciudades principales de Colombia
 * const stats = await preloadCitiesWeather([
 *   'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena'
 * ]);
 * 
 * console.log(`Pre-cargadas: ${stats.success}/${stats.total}`);
 */
export async function preloadCitiesWeather(cityNames) {
  const stats = {
    total: cityNames.length,
    success: 0,
    failed: 0,
    fromCache: 0,
    errors: []
  };
  
  const results = await getMultipleCitiesWeatherCached(cityNames);
  
  results.forEach((result, index) => {
    if (result.success) {
      stats.success++;
      if (result.fromCache) {
        stats.fromCache++;
      }
    } else {
      stats.failed++;
      stats.errors.push({
        city: cityNames[index],
        error: result.error
      });
    }
  });
  
  return stats;
}

/**
 * Verifica el estado del caché para una ciudad.
 * 
 * @param {string} cityName - Nombre de la ciudad
 * @returns {Object|null} Información del caché o null si no existe
 * 
 * @example
 * const cacheInfo = checkCityWeatherCache('Bogotá');
 * 
 * if (cacheInfo) {
 *   console.log(`Edad: ${cacheInfo.age} segundos`);
 *   console.log(`Expira en: ${cacheInfo.remaining} segundos`);
 *   console.log(`Expirado: ${cacheInfo.expired}`);
 * }
 */
export function checkCityWeatherCache(cityName) {
  const cacheKey = getCityWeatherCacheKey(cityName);
  const result = getCacheWithOfflineSupport(cacheKey);
  
  if (!result) {
    return null;
  }
  
  return {
    hasCache: true,
    expired: result.expired,
    offline: result.offline,
    data: result.data
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIONES DE UTILIDAD
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Limpia el caché de clima de una ciudad específica.
 * 
 * @param {string} cityName - Nombre de la ciudad
 * @returns {boolean} true si se eliminó exitosamente
 * 
 * @example
 * clearCityWeatherCache('Bogotá');
 */
export function clearCityWeatherCache(cityName) {
  const cacheKey = getCityWeatherCacheKey(cityName);
  
  try {
    localStorage.removeItem(`weather_cache_${cacheKey}`);
    return true;
  } catch (error) {
    console.error('Error al limpiar caché de ciudad:', error);
    return false;
  }
}

/**
 * Refresca el clima de una ciudad (ignora caché).
 * 
 * @async
 * @param {string} cityName - Nombre de la ciudad
 * @returns {Promise<Object>} Resultado actualizado
 * 
 * @example
 * const result = await refreshCityWeather('Bogotá');
 * console.log('Datos actualizados:', result.data);
 */
export async function refreshCityWeather(cityName) {
  return getCityWeatherInfoCached(cityName, { forceRefresh: true });
}
