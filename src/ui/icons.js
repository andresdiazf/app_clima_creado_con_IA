// src/ui/icons.js
// Mapea códigos WMO a emojis representativos

const WMO_ICONS = {
  0:  '☀️',
  1:  '🌤️',
  2:  '⛅',
  3:  '☁️',
  45: '🌫️',
  48: '🌫️',
  51: '🌦️',
  53: '🌦️',
  55: '🌧️',
  61: '🌧️',
  63: '🌧️',
  65: '🌧️',
  71: '🌨️',
  73: '❄️',
  75: '❄️',
  80: '🌦️',
  81: '🌧️',
  82: '⛈️',
  95: '⛈️',
  99: '⛈️',
};

/**
 * Devuelve el emoji para un código WMO
 * @param {number} code
 * @returns {string}
 */
export function getWeatherIcon(code) {
  return WMO_ICONS[code] ?? '🌡️';
}
