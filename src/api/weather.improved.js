// src/api/weather.js
// Obtiene datos meteorológicos actuales desde Open-Meteo API

import { geocodeCity } from './geocoding.js';
import { describeWeatherCode } from '../utils/format.js';

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════════════════════════════════════════

const WX_URL = 'https://api.open-meteo.com/v1/forecast';

// Timeout para las peticiones HTTP (en milisegundos)
const REQUEST_TIMEOUT = 10000; // 10 segundos

// Variables meteorológicas que se solicitan a la API
const WEATHER_VARIABLES = [
  'temperature_2m',
  'apparent_temperature',
  'relative_humidity_2m',
  'precipitation',
  'windspeed_10m',
  'weathercode',
];

// ═══════════════════════════════════════════════════════════════════════════
// TIPOS (para documentación)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * @typedef {Object} WeatherData
 * @property {number} temperature_2m - Temperatura actual en °C
 * @property {number} apparent_temperature - Sensación térmica en °C
 * @property {number} relative_humidity_2m - Humedad relativa en %
 * @property {number} precipitation - Precipitación en mm
 * @property {number} windspeed_10m - Velocidad del viento en km/h
 * @property {number} weathercode - Código WMO del clima
 */

/**
 * @typedef {Object} CityWeatherInfo
 * @property {string} city - Nombre de la ciudad
 * @property {string} country - País de la ciudad
 * @property {number} temperature - Temperatura actual en °C
 * @property {string} description - Descripción del clima
 * @property {number} humidity - Humedad relativa en %
 * @property {number} windSpeed - Velocidad del viento en km/h
 * @property {number} feelsLike - Sensación térmica en °C
 * @property {number} precipitation - Precipitación en mm
 */

/**
 * @typedef {Object} WeatherError
 * @property {string} error - Mensaje de error
 * @property {string} [code] - Código de error (opcional)
 */

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Valida las coordenadas geográficas
 * 
 * @private
 * @param {number} lat - Latitud
 * @param {number} lon - Longitud
 * @throws {Error} Si las coordenadas son inválidas
 */
function validateCoordinates(lat, lon) {
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    throw new Error('Las coordenadas deben ser números.');
  }
  
  if (lat < -90 || lat > 90) {
    throw new Error(`Latitud inválida: ${lat}. Debe estar entre -90 y 90.`);
  }
  
  if (lon < -180 || lon > 180) {
    throw new Error(`Longitud inválida: ${lon}. Debe estar entre -180 y 180.`);
  }
}

/**
 * Valida los datos meteorológicos recibidos de la API
 * 
 * @private
 * @param {any} data - Datos a validar
 * @returns {boolean} true si los datos son válidos
 */
function isValidWeatherData(data) {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  // Verificar que existan las propiedades requeridas
  const requiredFields = ['temperature_2m', 'weathercode'];
  return requiredFields.every(field => 
    field in data && typeof data[field] === 'number'
  );
}

/**
 * Crea una petición fetch con timeout
 * 
 * @private
 * @param {string} url - URL a la que hacer la petición
 * @param {number} timeout - Timeout en milisegundos
 * @returns {Promise<Response>} Respuesta de la petición
 * @throws {Error} Si la petición excede el timeout
 */
async function fetchWithTimeout(url, timeout = REQUEST_TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`La petición excedió el tiempo límite de ${timeout / 1000} segundos.`);
    }
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIONES PRINCIPALES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Obtiene los datos meteorológicos actuales para unas coordenadas específicas.
 * 
 * Esta función hace una petición a la API de Open-Meteo para obtener información
 * meteorológica en tiempo real. Incluye validación de coordenadas, manejo de
 * errores y timeout para evitar peticiones colgadas.
 * 
 * @async
 * @param {number} lat - Latitud de la ubicación (-90 a 90)
 * @param {number} lon - Longitud de la ubicación (-180 a 180)
 * @param {Object} [options] - Opciones adicionales
 * @param {number} [options.timeout=10000] - Timeout en milisegundos
 * @param {string} [options.windspeedUnit='kmh'] - Unidad de velocidad del viento ('kmh' o 'mph')
 * @param {string} [options.timezone='auto'] - Zona horaria ('auto' o IANA timezone)
 * 
 * @returns {Promise<WeatherData>} Datos meteorológicos actuales
 * 
 * @throws {Error} Si las coordenadas son inválidas
 * @throws {Error} Si la API retorna un error (status !== 200)
 * @throws {Error} Si la petición excede el timeout
 * @throws {Error} Si los datos recibidos son inválidos
 * 
 * @example
 * // Obtener clima de Bogotá
 * const weather = await fetchWeather(4.6097, -74.0817);
 * console.log(`Temperatura: ${weather.temperature_2m}°C`);
 * 
 * @example
 * // Con opciones personalizadas
 * const weather = await fetchWeather(4.6097, -74.0817, {
 *   timeout: 5000,
 *   windspeedUnit: 'mph',
 *   timezone: 'America/Bogota'
 * });
 * 
 * @see {@link https://open-meteo.com/en/docs|Open-Meteo API Documentation}
 */
export async function fetchWeather(lat, lon, options = {}) {
  // 1. Validar parámetros de entrada
  validateCoordinates(lat, lon);
  
  // 2. Configurar opciones con valores por defecto
  const {
    timeout = REQUEST_TIMEOUT,
    windspeedUnit = 'kmh',
    timezone = 'auto'
  } = options;
  
  // 3. Construir parámetros de la petición
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: WEATHER_VARIABLES.join(','),
    windspeed_unit: windspeedUnit,
    timezone: timezone,
  });
  
  const url = `${WX_URL}?${params}`;
  
  try {
    // 4. Hacer petición con timeout
    const response = await fetchWithTimeout(url, timeout);
    
    // 5. Verificar respuesta HTTP
    if (!response.ok) {
      throw new Error(
        `Error HTTP ${response.status}: ${response.statusText}. ` +
        `No se pudieron obtener los datos del clima.`
      );
    }
    
    // 6. Parsear respuesta JSON
    const data = await response.json();
    
    // 7. Validar datos recibidos
    if (!data.current || !isValidWeatherData(data.current)) {
      throw new Error(
        'La API retornó datos inválidos o incompletos. ' +
        'Por favor, intenta de nuevo más tarde.'
      );
    }
    
    // 8. Retornar datos del clima
    return data.current;
    
  } catch (error) {
    // 9. Mejorar mensajes de error comunes
    if (error.message.includes('Failed to fetch')) {
      throw new Error(
        'No se pudo conectar con el servicio meteorológico. ' +
        'Verifica tu conexión a internet.'
      );
    }
    
    // Re-lanzar el error original si ya tiene un mensaje descriptivo
    throw error;
  }
}

/**
 * Obtiene información meteorológica completa para una ciudad.
 * 
 * Esta función es un wrapper de alto nivel que combina geocodificación y
 * obtención de datos meteorológicos. Primero convierte el nombre de la ciudad
 * en coordenadas, luego obtiene el clima actual, y finalmente formatea los
 * datos en un objeto fácil de usar.
 * 
 * A diferencia de fetchWeather(), esta función NO lanza errores, sino que
 * retorna un objeto con la propiedad 'error' en caso de fallo. Esto facilita
 * el manejo de errores en la UI.
 * 
 * @async
 * @param {string} cityName - Nombre de la ciudad (ej: "Bogotá", "New York")
 * @param {Object} [options] - Opciones adicionales
 * @param {number} [options.timeout=10000] - Timeout en milisegundos
 * @param {string} [options.windspeedUnit='kmh'] - Unidad de velocidad del viento
 * 
 * @returns {Promise<CityWeatherInfo|WeatherError>} Información del clima o error
 * 
 * @example
 * // Uso básico
 * const result = await getCityWeatherInfo('Bogotá');
 * 
 * if (result.error) {
 *   console.error('Error:', result.error);
 * } else {
 *   console.log(`${result.city}: ${result.temperature}°C`);
 *   console.log(`Descripción: ${result.description}`);
 * }
 * 
 * @example
 * // Con opciones personalizadas
 * const result = await getCityWeatherInfo('London', {
 *   timeout: 5000,
 *   windspeedUnit: 'mph'
 * });
 * 
 * @example
 * // Manejo de errores en React/UI
 * const WeatherComponent = () => {
 *   const [weather, setWeather] = useState(null);
 *   
 *   useEffect(() => {
 *     getCityWeatherInfo('Madrid').then(result => {
 *       if (result.error) {
 *         showErrorMessage(result.error);
 *       } else {
 *         setWeather(result);
 *       }
 *     });
 *   }, []);
 *   
 *   return weather ? <WeatherCard data={weather} /> : <Loading />;
 * };
 */
export async function getCityWeatherInfo(cityName, options = {}) {
  try {
    // 1. Validar parámetros de entrada
    if (!cityName || typeof cityName !== 'string') {
      return {
        error: 'Debes proporcionar un nombre de ciudad válido.',
        code: 'INVALID_INPUT'
      };
    }
    
    // Limpiar y normalizar el nombre de la ciudad
    const normalizedCityName = cityName.trim();
    
    if (normalizedCityName.length === 0) {
      return {
        error: 'El nombre de la ciudad no puede estar vacío.',
        code: 'EMPTY_INPUT'
      };
    }
    
    if (normalizedCityName.length < 2) {
      return {
        error: 'El nombre de la ciudad debe tener al menos 2 caracteres.',
        code: 'INPUT_TOO_SHORT'
      };
    }
    
    // 2. Obtener coordenadas de la ciudad
    let location;
    try {
      location = await geocodeCity(normalizedCityName);
    } catch (error) {
      return {
        error: error.message || 'No se pudo encontrar la ciudad.',
        code: 'GEOCODING_ERROR'
      };
    }
    
    // 3. Obtener datos meteorológicos
    let weatherData;
    try {
      weatherData = await fetchWeather(
        location.latitude,
        location.longitude,
        options
      );
    } catch (error) {
      return {
        error: error.message || 'No se pudieron obtener los datos del clima.',
        code: 'WEATHER_API_ERROR'
      };
    }
    
    // 4. Validar datos meteorológicos
    if (!isValidWeatherData(weatherData)) {
      return {
        error: 'Los datos meteorológicos recibidos son inválidos.',
        code: 'INVALID_WEATHER_DATA'
      };
    }
    
    // 5. Formatear y retornar resultado
    return {
      city: location.name,
      country: location.country || 'Desconocido',
      temperature: weatherData.temperature_2m,
      description: describeWeatherCode(weatherData.weathercode),
      humidity: weatherData.relative_humidity_2m,
      windSpeed: weatherData.windspeed_10m,
      feelsLike: weatherData.apparent_temperature,
      precipitation: weatherData.precipitation,
      // Metadatos adicionales
      coordinates: {
        latitude: location.latitude,
        longitude: location.longitude
      },
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    // Capturar cualquier error inesperado
    console.error('Error inesperado en getCityWeatherInfo:', error);
    
    return {
      error: 'Ocurrió un error inesperado al obtener el clima. Por favor, intenta de nuevo.',
      code: 'UNEXPECTED_ERROR'
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIONES ADICIONALES (OPCIONALES)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Obtiene el clima para múltiples ciudades en paralelo.
 * 
 * @async
 * @param {string[]} cityNames - Array de nombres de ciudades
 * @param {Object} [options] - Opciones adicionales
 * @returns {Promise<Array<CityWeatherInfo|WeatherError>>} Array de resultados
 * 
 * @example
 * const cities = ['Bogotá', 'Medellín', 'Cali'];
 * const results = await getMultipleCitiesWeather(cities);
 * 
 * results.forEach(result => {
 *   if (result.error) {
 *     console.error(`Error: ${result.error}`);
 *   } else {
 *     console.log(`${result.city}: ${result.temperature}°C`);
 *   }
 * });
 */
export async function getMultipleCitiesWeather(cityNames, options = {}) {
  if (!Array.isArray(cityNames)) {
    throw new Error('cityNames debe ser un array de strings.');
  }
  
  // Ejecutar todas las peticiones en paralelo
  const promises = cityNames.map(city => getCityWeatherInfo(city, options));
  
  return Promise.all(promises);
}

/**
 * Verifica si el servicio meteorológico está disponible.
 * 
 * @async
 * @returns {Promise<boolean>} true si el servicio está disponible
 * 
 * @example
 * const isAvailable = await checkWeatherServiceAvailability();
 * if (!isAvailable) {
 *   showErrorMessage('El servicio meteorológico no está disponible');
 * }
 */
export async function checkWeatherServiceAvailability() {
  try {
    // Hacer una petición simple a Bogotá como test
    await fetchWeather(4.6097, -74.0817, { timeout: 5000 });
    return true;
  } catch (error) {
    console.warn('Servicio meteorológico no disponible:', error.message);
    return false;
  }
}
