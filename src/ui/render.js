// src/ui/render.js
// Construye y actualiza la interfaz del usuario

import { formatTemp, formatWind, formatPrecipitation, formatCoords, describeWeatherCode } from '../utils/format.js';
import { getWeatherIcon } from './icons.js';
import { getRecentCities } from '../utils/storage.js';

// ─── helpers ────────────────────────────────────────────────────────────────

const $ = id => document.getElementById(id);

// ─── Estado de carga ─────────────────────────────────────────────────────────

/**
 * Muestra u oculta el spinner y bloquea el botón
 * @param {boolean} on
 */
export function setLoading(on) {
  $('loader').classList.toggle('active', on);
  $('search-btn').disabled = on;
  if (on) hideCard();
}

// ─── Error ───────────────────────────────────────────────────────────────────

export function showError(msg) {
  const el = $('error-msg');
  el.textContent = msg;
  el.style.display = 'block';
}

export function hideError() {
  $('error-msg').style.display = 'none';
}

// ─── Tarjeta de resultado ────────────────────────────────────────────────────

function hideCard() {
  const card = $('weather-card');
  card.classList.remove('visible');
  card.style.display = 'none';
}

/**
 * Renderiza la tarjeta de clima
 * @param {{ name, country, latitude, longitude }} location
 * @param {object} wx - datos de Open-Meteo current
 */
export function renderWeather(location, wx) {
  // Encabezado
  $('city-display').textContent = `${location.name}, ${location.country}`;
  $('city-coords').textContent  = formatCoords(location.latitude, location.longitude);

  // Temperatura + ícono
  $('weather-icon').textContent  = getWeatherIcon(wx.weathercode);
  $('temp-value').textContent    = Math.round(wx.temperature_2m);
  $('weather-desc').textContent  = describeWeatherCode(wx.weathercode);

  // Stats secundarios
  $('feels-like').textContent      = formatTemp(wx.apparent_temperature);
  $('humidity').textContent        = `${wx.relative_humidity_2m} %`;
  $('wind').textContent            = formatWind(wx.windspeed_10m);
  $('precipitation').textContent   = formatPrecipitation(wx.precipitation);

  // Mostrar tarjeta con animación
  const card = $('weather-card');
  card.style.display = 'block';
  card.getBoundingClientRect(); // forzar reflow
  card.classList.add('visible');
}

// ─── Historial de ciudades recientes ─────────────────────────────────────────

/**
 * Actualiza la lista de búsquedas recientes bajo el input
 * @param {function} onSelect - callback al hacer clic en una ciudad
 */
export function renderRecentCities(onSelect) {
  const container = $('recent-cities');
  const cities    = getRecentCities();

  container.innerHTML = '';

  if (!cities.length) return;

  cities.forEach(city => {
    const btn = document.createElement('button');
    btn.className   = 'recent-chip';
    btn.textContent = city;
    btn.addEventListener('click', () => onSelect(city));
    container.appendChild(btn);
  });
}
