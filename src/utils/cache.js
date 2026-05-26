// src/utils/cache.js
// Sistema de caché con expiración temporal y soporte offline

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════════════════════════════════════════

const CACHE_PREFIX = 'weather_cache_';
const DEFAULT_TTL = 10 * 60 * 1000; // 10 minutos en milisegundos

// ═══════════════════════════════════════════════════════════════════════════
// TIPOS (para documentación)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @typedef {Object} CacheEntry
 * @property {any} data - Datos almacenados
 * @property {number} timestamp - Timestamp de cuando se guardó
 * @property {number} ttl - Tiempo de vida en milisegundos
 * @property {string} key - Clave del caché
 */

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Genera una clave de caché normalizada
 * 
 * @private
 * @param {string} key - Clave original
 * @returns {string} Clave normalizada
 */
function getCacheKey(key) {
  return `${CACHE_PREFIX}${key.toLowerCase().trim()}`;
}

/**
 * Verifica si una entrada de caché ha expirado
 * 
 * @private
 * @param {CacheEntry} entry - Entrada de caché
 * @returns {boolean} true si ha expirado
 */
function isExpired(entry) {
  if (!entry || !entry.timestamp || !entry.ttl) {
    return true;
  }
  
  const now = Date.now();
  const age = now - entry.timestamp;
  
  return age > entry.ttl;
}

/**
 * Verifica si hay conexión a internet
 * 
 * @returns {boolean} true si hay conexión
 */
function isOnline() {
  return navigator.onLine;
}

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIONES PRINCIPALES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Guarda datos en caché con expiración temporal.
 * 
 * Los datos se almacenan en localStorage con un timestamp y un tiempo de vida (TTL).
 * Cuando se intenta recuperar los datos, se verifica si han expirado.
 * 
 * @param {string} key - Clave única para identificar los datos
 * @param {any} data - Datos a almacenar (será convertido a JSON)
 * @param {number} [ttl=600000] - Tiempo de vida en milisegundos (default: 10 minutos)
 * 
 * @returns {boolean} true si se guardó exitosamente, false si hubo error
 * 
 * @example
 * // Guardar clima de Bogotá por 10 minutos
 * const weatherData = { temperature: 18, humidity: 75 };
 * setCache('bogota', weatherData);
 * 
 * @example
 * // Guardar con TTL personalizado (5 minutos)
 * setCache('medellin', weatherData, 5 * 60 * 1000);
 */
export function setCache(key, data, ttl = DEFAULT_TTL) {
  try {
    const cacheKey = getCacheKey(key);
    
    const entry = {
      data,
      timestamp: Date.now(),
      ttl,
      key: cacheKey
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(entry));
    return true;
    
  } catch (error) {
    console.error('Error al guardar en caché:', error);
    
    // Si localStorage está lleno, intentar limpiar caché antiguo
    if (error.name === 'QuotaExceededError') {
      clearExpiredCache();
      
      // Intentar guardar de nuevo
      try {
        const cacheKey = getCacheKey(key);
        const entry = { data, timestamp: Date.now(), ttl, key: cacheKey };
        localStorage.setItem(cacheKey, JSON.stringify(entry));
        return true;
      } catch (retryError) {
        console.error('Error al guardar en caché después de limpiar:', retryError);
        return false;
      }
    }
    
    return false;
  }
}

/**
 * Recupera datos del caché si no han expirado.
 * 
 * Verifica si los datos existen y si aún son válidos (no han expirado).
 * Si los datos han expirado, los elimina automáticamente.
 * 
 * @param {string} key - Clave de los datos a recuperar
 * @param {Object} [options] - Opciones adicionales
 * @param {boolean} [options.ignoreExpiration=false] - Ignorar expiración (útil para modo offline)
 * 
 * @returns {any|null} Datos almacenados o null si no existen o expiraron
 * 
 * @example
 * // Recuperar datos normalmente
 * const weatherData = getCache('bogota');
 * if (weatherData) {
 *   console.log('Datos en caché:', weatherData);
 * } else {
 *   console.log('No hay datos o expiraron');
 * }
 * 
 * @example
 * // Recuperar datos ignorando expiración (modo offline)
 * const weatherData = getCache('bogota', { ignoreExpiration: true });
 */
export function getCache(key, options = {}) {
  try {
    const cacheKey = getCacheKey(key);
    const item = localStorage.getItem(cacheKey);
    
    if (!item) {
      return null;
    }
    
    const entry = JSON.parse(item);
    
    // Si se solicita ignorar expiración (modo offline), retornar datos
    if (options.ignoreExpiration) {
      return entry.data;
    }
    
    // Verificar si ha expirado
    if (isExpired(entry)) {
      // Eliminar entrada expirada
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    return entry.data;
    
  } catch (error) {
    console.error('Error al recuperar del caché:', error);
    return null;
  }
}

/**
 * Verifica si existe una entrada en caché y si es válida.
 * 
 * @param {string} key - Clave a verificar
 * @returns {boolean} true si existe y es válida
 * 
 * @example
 * if (hasCache('bogota')) {
 *   console.log('Hay datos en caché para Bogotá');
 * }
 */
export function hasCache(key) {
  const data = getCache(key);
  return data !== null;
}

/**
 * Elimina una entrada específica del caché.
 * 
 * @param {string} key - Clave a eliminar
 * @returns {boolean} true si se eliminó exitosamente
 * 
 * @example
 * deleteCache('bogota');
 */
export function deleteCache(key) {
  try {
    const cacheKey = getCacheKey(key);
    localStorage.removeItem(cacheKey);
    return true;
  } catch (error) {
    console.error('Error al eliminar del caché:', error);
    return false;
  }
}

/**
 * Limpia todas las entradas de caché expiradas.
 * 
 * Útil para liberar espacio en localStorage.
 * 
 * @returns {number} Número de entradas eliminadas
 * 
 * @example
 * const deleted = clearExpiredCache();
 * console.log(`Se eliminaron ${deleted} entradas expiradas`);
 */
export function clearExpiredCache() {
  let deletedCount = 0;
  
  try {
    const keys = Object.keys(localStorage);
    
    for (const key of keys) {
      // Solo procesar claves de caché
      if (!key.startsWith(CACHE_PREFIX)) {
        continue;
      }
      
      try {
        const item = localStorage.getItem(key);
        if (!item) continue;
        
        const entry = JSON.parse(item);
        
        if (isExpired(entry)) {
          localStorage.removeItem(key);
          deletedCount++;
        }
      } catch (error) {
        // Si hay error al parsear, eliminar la entrada corrupta
        localStorage.removeItem(key);
        deletedCount++;
      }
    }
    
  } catch (error) {
    console.error('Error al limpiar caché expirado:', error);
  }
  
  return deletedCount;
}

/**
 * Limpia todo el caché de la aplicación.
 * 
 * @returns {number} Número de entradas eliminadas
 * 
 * @example
 * const deleted = clearAllCache();
 * console.log(`Se eliminaron ${deleted} entradas del caché`);
 */
export function clearAllCache() {
  let deletedCount = 0;
  
  try {
    const keys = Object.keys(localStorage);
    
    for (const key of keys) {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
        deletedCount++;
      }
    }
    
  } catch (error) {
    console.error('Error al limpiar todo el caché:', error);
  }
  
  return deletedCount;
}

/**
 * Obtiene información sobre el estado del caché.
 * 
 * @returns {Object} Estadísticas del caché
 * @property {number} total - Total de entradas
 * @property {number} valid - Entradas válidas (no expiradas)
 * @property {number} expired - Entradas expiradas
 * @property {Array<Object>} entries - Lista de entradas con detalles
 * 
 * @example
 * const stats = getCacheStats();
 * console.log(`Total: ${stats.total}, Válidas: ${stats.valid}, Expiradas: ${stats.expired}`);
 */
export function getCacheStats() {
  const stats = {
    total: 0,
    valid: 0,
    expired: 0,
    entries: []
  };
  
  try {
    const keys = Object.keys(localStorage);
    
    for (const key of keys) {
      if (!key.startsWith(CACHE_PREFIX)) {
        continue;
      }
      
      stats.total++;
      
      try {
        const item = localStorage.getItem(key);
        if (!item) continue;
        
        const entry = JSON.parse(item);
        const expired = isExpired(entry);
        
        if (expired) {
          stats.expired++;
        } else {
          stats.valid++;
        }
        
        const age = Date.now() - entry.timestamp;
        const remaining = entry.ttl - age;
        
        stats.entries.push({
          key: key.replace(CACHE_PREFIX, ''),
          timestamp: new Date(entry.timestamp).toISOString(),
          age: Math.floor(age / 1000), // segundos
          remaining: Math.floor(remaining / 1000), // segundos
          expired,
          size: item.length // tamaño aproximado en bytes
        });
        
      } catch (error) {
        console.error(`Error al procesar entrada ${key}:`, error);
      }
    }
    
  } catch (error) {
    console.error('Error al obtener estadísticas del caché:', error);
  }
  
  return stats;
}

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIONES PARA MODO OFFLINE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Obtiene datos del caché con soporte para modo offline.
 * 
 * Si hay conexión, retorna solo datos válidos (no expirados).
 * Si no hay conexión, retorna datos aunque hayan expirado.
 * 
 * @param {string} key - Clave de los datos
 * @returns {Object|null} Objeto con datos y metadatos
 * @property {any} data - Datos almacenados
 * @property {boolean} fromCache - true si viene del caché
 * @property {boolean} expired - true si los datos han expirado
 * @property {boolean} offline - true si no hay conexión
 * 
 * @example
 * const result = getCacheWithOfflineSupport('bogota');
 * 
 * if (result) {
 *   if (result.offline) {
 *     console.log('⚠️ Mostrando datos antiguos (sin conexión)');
 *   } else if (result.expired) {
 *     console.log('⚠️ Datos expirados pero disponibles');
 *   }
 *   console.log('Datos:', result.data);
 * }
 */
export function getCacheWithOfflineSupport(key) {
  const online = isOnline();
  
  // Si estamos online, usar comportamiento normal
  if (online) {
    const data = getCache(key);
    
    if (data) {
      return {
        data,
        fromCache: true,
        expired: false,
        offline: false
      };
    }
    
    return null;
  }
  
  // Si estamos offline, intentar usar datos aunque hayan expirado
  const data = getCache(key, { ignoreExpiration: true });
  
  if (data) {
    // Verificar si realmente están expirados
    const cacheKey = getCacheKey(key);
    const item = localStorage.getItem(cacheKey);
    
    if (item) {
      try {
        const entry = JSON.parse(item);
        const expired = isExpired(entry);
        
        return {
          data,
          fromCache: true,
          expired,
          offline: true
        };
      } catch (error) {
        return {
          data,
          fromCache: true,
          expired: true,
          offline: true
        };
      }
    }
  }
  
  return null;
}

/**
 * Función wrapper para ejecutar una función con soporte de caché.
 * 
 * Primero intenta obtener datos del caché. Si no hay o expiraron,
 * ejecuta la función proporcionada y guarda el resultado en caché.
 * 
 * @async
 * @param {string} key - Clave del caché
 * @param {Function} fetchFn - Función async que obtiene los datos
 * @param {Object} [options] - Opciones
 * @param {number} [options.ttl=600000] - Tiempo de vida del caché
 * @param {boolean} [options.forceRefresh=false] - Forzar actualización
 * 
 * @returns {Promise<Object>} Resultado con datos y metadatos
 * 
 * @example
 * // Uso con función de API
 * const result = await fetchWithCache(
 *   'bogota',
 *   () => getCityWeatherInfo('Bogotá'),
 *   { ttl: 10 * 60 * 1000 }
 * );
 * 
 * if (result.fromCache) {
 *   console.log('Datos del caché');
 * } else {
 *   console.log('Datos frescos de la API');
 * }
 */
export async function fetchWithCache(key, fetchFn, options = {}) {
  const {
    ttl = DEFAULT_TTL,
    forceRefresh = false
  } = options;
  
  // Si no se fuerza refresh, intentar obtener del caché
  if (!forceRefresh) {
    const cachedResult = getCacheWithOfflineSupport(key);
    
    if (cachedResult) {
      return {
        ...cachedResult,
        success: true
      };
    }
  }
  
  // Si no hay en caché o se fuerza refresh, obtener datos frescos
  try {
    const data = await fetchFn();
    
    // Guardar en caché
    setCache(key, data, ttl);
    
    return {
      data,
      fromCache: false,
      expired: false,
      offline: false,
      success: true
    };
    
  } catch (error) {
    // Si falla la petición y estamos offline, intentar usar caché expirado
    if (!isOnline()) {
      const cachedResult = getCacheWithOfflineSupport(key);
      
      if (cachedResult) {
        return {
          ...cachedResult,
          success: true,
          error: error.message
        };
      }
    }
    
    // Si no hay caché disponible, propagar el error
    return {
      data: null,
      fromCache: false,
      expired: false,
      offline: !isOnline(),
      success: false,
      error: error.message || 'Error al obtener datos'
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// INICIALIZACIÓN
// ═══════════════════════════════════════════════════════════════════════════

// Limpiar caché expirado al cargar el módulo
clearExpiredCache();
