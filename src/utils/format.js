// src/utils/format.js
// Funciones puras para formatear datos meteorológicos

/**
 * Redondea temperatura y agrega unidad
 * @param {number} value
 * @param {string} unit - 'C' o 'F'
 */
export function formatTemp(value, unit = 'C') {
  return `${Math.round(value)} °${unit}`;
}

/**
 * Formatea velocidad de viento
 * @param {number} kmh
 */
export function formatWind(kmh) {
  return `${Math.round(kmh)} km/h`;
}

/**
 * Formatea precipitación
 * @param {number} mm
 */
export function formatPrecipitation(mm) {
  return `${mm} mm`;
}

/**
 * Formatea coordenadas para mostrar
 * @param {number} lat
 * @param {number} lon
 */
export function formatCoords(lat, lon) {
  const ns = lat >= 0 ? 'N' : 'S';
  const ew = lon >= 0 ? 'E' : 'O';
  return `${Math.abs(lat).toFixed(3)}° ${ns}, ${Math.abs(lon).toFixed(3)}° ${ew}`;
}

// Códigos WMO → descripción en español
const WMO_CODES = {
  0:  'Despejado',
  1:  'Mayormente despejado',
  2:  'Parcialmente nublado',
  3:  'Nublado',
  45: 'Niebla',
  48: 'Niebla con escarcha',
  51: 'Llovizna ligera',
  53: 'Llovizna moderada',
  55: 'Llovizna intensa',
  61: 'Lluvia ligera',
  63: 'Lluvia moderada',
  65: 'Lluvia intensa',
  71: 'Nieve ligera',
  73: 'Nieve moderada',
  75: 'Nieve intensa',
  80: 'Chubascos ligeros',
  81: 'Chubascos moderados',
  82: 'Chubascos intensos',
  95: 'Tormenta eléctrica',
  99: 'Tormenta con granizo',
};

/**
 * Convierte código WMO a descripción legible
 * @param {number} code
 */
export function describeWeatherCode(code) {
  return WMO_CODES[code] ?? `Condición desconocida (${code})`;
}
