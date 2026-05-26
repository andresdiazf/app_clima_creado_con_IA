// src/app.cached.js
// Punto de entrada con soporte de caché y modo offline

import { geocodeCity } from './api/geocoding.js';
import { getCityWeatherInfoCached, refreshCityWeather } from './api/weather.cached.js';
import { saveCity } from './utils/storage.js';
import {
  setLoading,
  showError,
  hideError,
  renderWeather,
  renderRecentCities,
} from './ui/render.js';

// ═══════════════════════════════════════════════════════════════════════════
// ESTADO DE LA APLICACIÓN
// ═══════════════════════════════════════════════════════════════════════════

let isOffline = !navigator.onLine;

// ═══════════════════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Muestra un mensaje de advertencia cuando se usan datos en caché
 */
function showCacheWarning(expired, offline) {
  const warningEl = document.getElementById('cache-warning');
  
  if (!warningEl) {
    // Crear elemento de advertencia si no existe
    const warning = document.createElement('div');
    warning.id = 'cache-warning';
    warning.className = 'cache-warning';
    document.querySelector('.container').prepend(warning);
  }
  
  const warning = document.getElementById('cache-warning');
  
  if (offline) {
    warning.textContent = '⚠️ Sin conexión - Mostrando datos guardados';
    warning.className = 'cache-warning offline';
  } else if (expired) {
    warning.textContent = '📦 Mostrando datos del caché';
    warning.className = 'cache-warning expired';
  } else {
    warning.textContent = '📦 Datos del caché';
    warning.className = 'cache-warning';
  }
  
  warning.style.display = 'block';
}

/**
 * Oculta el mensaje de advertencia de caché
 */
function hideCacheWarning() {
  const warningEl = document.getElementById('cache-warning');
  if (warningEl) {
    warningEl.style.display = 'none';
  }
}

/**
 * Actualiza el indicador de estado de conexión
 */
function updateConnectionStatus() {
  const statusEl = document.getElementById('connection-status');
  
  if (!statusEl) {
    // Crear elemento de estado si no existe
    const status = document.createElement('div');
    status.id = 'connection-status';
    status.className = 'connection-status';
    document.querySelector('.header').appendChild(status);
  }
  
  const status = document.getElementById('connection-status');
  
  if (isOffline) {
    status.textContent = '🔴 Sin conexión';
    status.className = 'connection-status offline';
    status.style.display = 'block';
  } else {
    status.textContent = '🟢 Conectado';
    status.className = 'connection-status online';
    // Ocultar después de 2 segundos
    setTimeout(() => {
      status.style.display = 'none';
    }, 2000);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// FLUJO PRINCIPAL CON CACHÉ
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Busca el clima para una ciudad usando caché
 * @param {string} city - Nombre de la ciudad
 * @param {boolean} forceRefresh - Forzar actualización ignorando caché
 */
async function searchWeather(city, forceRefresh = false) {
  city = city.trim();
  if (!city) return;

  hideError();
  hideCacheWarning();
  setLoading(true);

  try {
    // Obtener clima con soporte de caché
    const result = await getCityWeatherInfoCached(city, { forceRefresh });
    
    if (!result.success) {
      throw new Error(result.error || 'No se pudo obtener el clima');
    }
    
    // Mostrar advertencia si viene del caché o está offline
    if (result.fromCache || result.offline) {
      showCacheWarning(result.expired, result.offline);
    }
    
    // Obtener coordenadas para renderizar
    const location = await geocodeCity(city);
    
    // Guardar en historial
    saveCity(location.name);
    
    // Renderizar datos
    renderWeather(location, {
      temperature_2m: result.data.temperature,
      apparent_temperature: result.data.feelsLike,
      relative_humidity_2m: result.data.humidity,
      windspeed_10m: result.data.windSpeed,
      precipitation: result.data.precipitation,
      weathercode: getWeatherCodeFromDescription(result.data.description)
    });
    
    renderRecentCities(selectRecentCity);

  } catch (err) {
    showError(err.message || 'Algo salió mal. Intenta de nuevo.');
  } finally {
    setLoading(false);
  }
}

/**
 * Refresca el clima de la ciudad actual (ignora caché)
 */
async function refreshCurrentWeather() {
  const cityInput = document.getElementById('city-input');
  const city = cityInput.value.trim();
  
  if (!city) {
    showError('Ingresa una ciudad primero');
    return;
  }
  
  await searchWeather(city, true);
}

/**
 * Función auxiliar para obtener código del clima desde descripción
 * (Simplificada - en producción usarías un mapeo completo)
 */
function getWeatherCodeFromDescription(description) {
  const codeMap = {
    'Despejado': 0,
    'Parcialmente nublado': 2,
    'Nublado': 3,
    'Lluvia ligera': 61,
    'Lluvia moderada': 63,
    'Tormenta eléctrica': 95
  };
  
  return codeMap[description] || 0;
}

// ═══════════════════════════════════════════════════════════════════════════
// CALLBACK PARA CIUDADES RECIENTES
// ═══════════════════════════════════════════════════════════════════════════

function selectRecentCity(city) {
  document.getElementById('city-input').value = city;
  searchWeather(city);
}

// ═══════════════════════════════════════════════════════════════════════════
// EVENTOS
// ═══════════════════════════════════════════════════════════════════════════

// Búsqueda con botón
document.getElementById('search-btn')
  .addEventListener('click', () => {
    const city = document.getElementById('city-input').value;
    searchWeather(city);
  });

// Búsqueda con Enter
document.getElementById('city-input')
  .addEventListener('keydown', e => {
    if (e.key === 'Enter') searchWeather(e.target.value);
  });

// Botón de refresh (agregar al HTML si no existe)
const refreshBtn = document.getElementById('refresh-btn');
if (refreshBtn) {
  refreshBtn.addEventListener('click', refreshCurrentWeather);
}

// ═══════════════════════════════════════════════════════════════════════════
// EVENTOS DE CONEXIÓN
// ═══════════════════════════════════════════════════════════════════════════

// Detectar cuando se pierde la conexión
window.addEventListener('offline', () => {
  isOffline = true;
  updateConnectionStatus();
  console.log('📴 Conexión perdida - Modo offline activado');
});

// Detectar cuando se recupera la conexión
window.addEventListener('online', () => {
  isOffline = false;
  updateConnectionStatus();
  console.log('📶 Conexión recuperada');
  
  // Opcional: Refrescar datos automáticamente
  const cityInput = document.getElementById('city-input');
  if (cityInput.value.trim()) {
    console.log('🔄 Actualizando datos...');
    searchWeather(cityInput.value, true);
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// INICIALIZACIÓN
// ═══════════════════════════════════════════════════════════════════════════

renderRecentCities(selectRecentCity);
updateConnectionStatus();

// Mostrar mensaje inicial si está offline
if (isOffline) {
  console.log('⚠️ Iniciando en modo offline');
}

console.log('✅ Aplicación con caché inicializada');
console.log('💡 Tip: Los datos se guardan por 10 minutos');
