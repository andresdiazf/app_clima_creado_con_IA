// src/app.js
// Punto de entrada: orquesta el flujo completo

import { geocodeCity }   from './api/geocoding.js';
import { fetchWeather }  from './api/weather.js';
import { saveCity }      from './utils/storage.js';
import {
  setLoading,
  showError,
  hideError,
  renderWeather,
  renderRecentCities,
} from './ui/render.js';

// ─── Flujo principal ─────────────────────────────────────────────────────────

/**
 * Busca el clima para una ciudad dada
 * @param {string} city
 */
async function searchWeather(city) {
  city = city.trim();
  if (!city) return;

  hideError();
  setLoading(true);

  try {
    // 1. Ciudad → coordenadas
    const location = await geocodeCity(city);

    // 2. Coordenadas → datos del clima
    const wx = await fetchWeather(location.latitude, location.longitude);

    // 3. Guardar en historial y pintar resultado
    saveCity(location.name);
    renderWeather(location, wx);
    renderRecentCities(selectRecentCity);

  } catch (err) {
    showError(err.message || 'Algo salió mal. Intenta de nuevo.');
  } finally {
    setLoading(false);
  }
}

// ─── Callback para chips de ciudades recientes ───────────────────────────────

function selectRecentCity(city) {
  document.getElementById('city-input').value = city;
  searchWeather(city);
}

// ─── Eventos ─────────────────────────────────────────────────────────────────

document.getElementById('search-btn')
  .addEventListener('click', () => {
    const city = document.getElementById('city-input').value;
    searchWeather(city);
  });

document.getElementById('city-input')
  .addEventListener('keydown', e => {
    if (e.key === 'Enter') searchWeather(e.target.value);
  });

// ─── Inicialización ──────────────────────────────────────────────────────────

renderRecentCities(selectRecentCity);
