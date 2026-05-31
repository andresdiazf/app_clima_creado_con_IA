// src/config.js
// ============================================================
// CONFIGURACIÓN CENTRALIZADA DE LA APLICACIÓN
// ============================================================
//
// ¿Por qué existe este archivo?
// En lugar de tener URLs y valores mágicos dispersos por todo
// el código, los centralizamos aquí. Así:
//   - Si cambia una URL, solo la cambias en UN lugar
//   - Es más fácil de mantener y entender
//   - Simula cómo se usan variables de entorno en proyectos reales
//
// En un proyecto con Node.js/backend usarías:
//   process.env.WEATHER_API_URL
//
// En un proyecto con Vite/React usarías:
//   import.meta.env.VITE_WEATHER_API_URL
//
// En este proyecto educativo (HTML puro) usamos constantes,
// que es la forma correcta para apps frontend sin build tool.
// ============================================================


// ── URLs de APIs ─────────────────────────────────────────────

/**
 * URL base de la API de clima de Open-Meteo
 * Open-Meteo es gratuita y no requiere API key
 * Documentación: https://open-meteo.com/en/docs
 */
export const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * URL base de la API de geocodificación de Open-Meteo
 * Convierte nombres de ciudades a coordenadas lat/lon
 * Documentación: https://open-meteo.com/en/docs/geocoding-api
 */
export const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';


// ── Configuración de la App ──────────────────────────────────

/**
 * Número máximo de ciudades recientes a guardar
 * Se almacenan en localStorage del navegador
 */
export const MAX_RECENT_CITIES = 5;

/**
 * Número de días del pronóstico
 * Open-Meteo soporta hasta 16 días
 */
export const FORECAST_DAYS = 7;

/**
 * Clave usada en localStorage para guardar ciudades recientes
 * Usar un nombre específico evita conflictos con otras apps
 */
export const STORAGE_KEY = 'weather_recent_cities';

/**
 * Tiempo de expiración del caché en milisegundos
 * 10 minutos = 10 * 60 * 1000
 */
export const CACHE_TTL_MS = 10 * 60 * 1000;


// ── Parámetros de la API de Clima ────────────────────────────

/**
 * Variables meteorológicas que pedimos a la API
 * Solo pedimos lo que necesitamos (optimización)
 */
export const WEATHER_CURRENT_PARAMS = [
  'temperature_2m',        // Temperatura actual
  'apparent_temperature',  // Sensación térmica
  'relative_humidity_2m',  // Humedad relativa
  'precipitation',         // Precipitación
  'windspeed_10m',         // Velocidad del viento
  'weathercode',           // Código WMO del clima
];

export const WEATHER_DAILY_PARAMS = [
  'weathercode',                    // Código del clima del día
  'temperature_2m_max',             // Temperatura máxima
  'temperature_2m_min',             // Temperatura mínima
  'precipitation_probability_max',  // Probabilidad de lluvia
  'windspeed_10m_max',              // Viento máximo
];


// ── Información de la App ────────────────────────────────────

export const APP_CONFIG = {
  name: 'Weather App',
  version: '1.0.0',
  author: 'Generation Colombia',
  license: 'MIT',
};
