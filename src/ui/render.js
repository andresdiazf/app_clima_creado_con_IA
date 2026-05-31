// src/ui/render.js
// Construye y actualiza la interfaz del usuario

import { formatTemp, formatWind, formatPrecipitation, formatCoords, describeWeatherCode } from '../utils/format.js';
import { getWeatherIcon } from './icons.js';
import { getRecentCities, deleteCity } from '../utils/storage.js';

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
  if (on) {
    hideCard();
    hideForecast();
  }
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

function hideForecast() {
  const section = $('forecast-section');
  const container = $('forecast-container');
  section.classList.remove('visible');
  container.classList.remove('visible');
  container.style.display = 'none';
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
    const wrapper = document.createElement('div');
    wrapper.className = 'recent-chip-wrapper';

    const btn = document.createElement('button');
    btn.className   = 'recent-chip';
    btn.textContent = city;
    btn.addEventListener('click', () => onSelect(city));

    const delBtn = document.createElement('button');
    delBtn.className = 'delete-chip-btn';
    delBtn.title = 'Eliminar ciudad';
    delBtn.textContent = '✕';
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteCity(city);
      renderRecentCities(onSelect);
    });

    wrapper.appendChild(btn);
    wrapper.appendChild(delBtn);
    container.appendChild(wrapper);
  });
}

// ─── Pronóstico de 7 días ────────────────────────────────────────────────────

/**
 * Renderiza el pronóstico de 7 días
 * @param {Array} forecast - Array con datos diarios del pronóstico
 */
export function renderForecast(forecast) {
  const section = $('forecast-section');
  const container = $('forecast-container');
  
  if (!forecast || forecast.length === 0) {
    section.style.display = 'none';
    container.style.display = 'none';
    return;
  }

  container.innerHTML = '';

  forecast.forEach((day, index) => {
    const dayCard = document.createElement('div');
    dayCard.className = 'forecast-day';

    // Nombre del día
    const dayName = document.createElement('div');
    dayName.className = 'forecast-day-name';
    dayName.textContent = formatDayName(day.date, index);

    // Ícono del clima
    const icon = document.createElement('div');
    icon.className = 'forecast-icon';
    icon.textContent = getWeatherIcon(day.weathercode);

    // Temperaturas
    const temps = document.createElement('div');
    temps.className = 'forecast-temps';
    
    const tempMax = document.createElement('span');
    tempMax.className = 'forecast-temp-max';
    tempMax.textContent = `${Math.round(day.tempMax)}°`;
    
    const tempMin = document.createElement('span');
    tempMin.className = 'forecast-temp-min';
    tempMin.textContent = `${Math.round(day.tempMin)}°`;
    
    temps.appendChild(tempMax);
    temps.appendChild(tempMin);

    // Probabilidad de precipitación
    const precip = document.createElement('div');
    precip.className = 'forecast-precip';
    precip.textContent = `💧 ${day.precipitationProbability || 0}%`;

    // Ensamblar tarjeta
    dayCard.appendChild(dayName);
    dayCard.appendChild(icon);
    dayCard.appendChild(temps);
    dayCard.appendChild(precip);

    container.appendChild(dayCard);
  });

  // Mostrar sección y contenedor con animación
  section.style.display = 'block';
  container.style.display = 'grid';
  section.getBoundingClientRect(); // forzar reflow
  section.classList.add('visible');
  container.classList.add('visible');
}

/**
 * Formatea la fecha para mostrar el nombre del día
 * @param {string} dateStr - Fecha en formato ISO (YYYY-MM-DD)
 * @param {number} index - Índice del día (0 = hoy)
 * @returns {string} Nombre del día
 */
function formatDayName(dateStr, index) {
  if (index === 0) return 'Hoy';
  if (index === 1) return 'Mañana';
  
  const date = new Date(dateStr + 'T00:00:00');
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  return days[date.getDay()];
}

