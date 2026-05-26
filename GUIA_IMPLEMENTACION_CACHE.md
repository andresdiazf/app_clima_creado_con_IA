# 🚀 Guía de Implementación del Sistema de Caché

## 📊 Estado Actual

### ✅ YA IMPLEMENTADO

1. **Solicitud Optimizada a la API** ✅
   - Solo se solicitan los datos meteorológicos necesarios
   - Variables específicas: temperatura, humedad, viento, precipitación, código del clima

2. **Múltiples Ciudades en Paralelo** ✅
   - Función `getMultipleCitiesWeather()` en `weather.improved.js`
   - Ejecuta peticiones en paralelo con `Promise.all()`

### ✅ RECIÉN IMPLEMENTADO

3. **Sistema de Caché con Expiración** ✅
   - Archivo: `src/utils/cache.js`
   - Almacenamiento en localStorage con timestamp
   - TTL configurable (default: 10 minutos)
   - Limpieza automática de caché expirado

4. **Soporte para Modo Offline** ✅
   - Detecta cuando no hay conexión
   - Usa datos en caché aunque hayan expirado
   - Indicadores visuales de estado
   - Sincronización automática al recuperar conexión

---

## 📁 Archivos Creados

### 1. Sistema de Caché
- ✅ `src/utils/cache.js` - Sistema completo de caché
- ✅ `src/utils/__tests__/cache.test.js` - Tests del caché (30+ tests)

### 2. API con Caché
- ✅ `src/api/weather.cached.js` - Versión con caché de la API

### 3. Aplicación con Caché
- ✅ `src/app.cached.js` - App con soporte de caché y offline

### 4. Estilos
- ✅ `styles/cache-indicators.css` - Estilos para indicadores

### 5. Documentación
- ✅ `ESTADO_OPTIMIZACIONES.md` - Estado de optimizaciones
- ✅ `GUIA_IMPLEMENTACION_CACHE.md` - Esta guía

---

## 🔧 Cómo Implementar

### Opción 1: Implementación Completa (Recomendada)

#### Paso 1: Actualizar index.html

Agrega el nuevo CSS y cambia el script:

```html
<!-- En el <head>, después de los otros CSS -->
<link rel="stylesheet" href="styles/cache-indicators.css">

<!-- Al final del <body>, reemplaza el script actual -->
<script type="module" src="src/app.cached.js"></script>
```

#### Paso 2: Agregar Botón de Refresh (Opcional)

En `index.html`, después del botón de búsqueda:

```html
<button class="refresh-btn" id="refresh-btn" aria-label="Refrescar">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M1 4v6h6M23 20v-6h-6"/>
    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
  </svg>
  Refrescar
</button>
```

#### Paso 3: Ejecutar Tests

```bash
npm test
```

Deberías ver:
```
PASS  src/utils/__tests__/cache.test.js
PASS  src/utils/__tests__/format.test.js
PASS  src/utils/__tests__/storage.test.js
PASS  src/api/__tests__/api-errors.test.js

Test Suites: 4 passed, 4 total
Tests:       69 passed, 69 total
```

#### Paso 4: Probar la Aplicación

1. Abre `index.html` en el navegador
2. Busca una ciudad (ej: "Bogotá")
3. Busca la misma ciudad de nuevo → Verás "📦 Datos del caché"
4. Abre DevTools → Network → Offline
5. Busca la misma ciudad → Verás "⚠️ Sin conexión - Mostrando datos guardados"

---

### Opción 2: Implementación Gradual

#### Fase 1: Solo Caché Básico

1. Copia `src/utils/cache.js` a tu proyecto
2. Usa las funciones básicas en tu código:

```javascript
import { setCache, getCache } from './utils/cache.js';

// Guardar datos
setCache('bogota', weatherData, 10 * 60 * 1000); // 10 minutos

// Recuperar datos
const cached = getCache('bogota');
if (cached) {
  console.log('Usando caché');
} else {
  console.log('Obteniendo datos frescos');
}
```

#### Fase 2: Agregar Soporte Offline

```javascript
import { getCacheWithOfflineSupport } from './utils/cache.js';

const result = getCacheWithOfflineSupport('bogota');

if (result) {
  if (result.offline) {
    showWarning('Sin conexión - datos antiguos');
  }
  displayWeather(result.data);
}
```

#### Fase 3: Usar fetchWithCache

```javascript
import { fetchWithCache } from './utils/cache.js';

const result = await fetchWithCache(
  'bogota',
  () => getCityWeatherInfo('Bogotá'),
  { ttl: 10 * 60 * 1000 }
);

if (result.success) {
  displayWeather(result.data);
}
```

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Uso Básico del Caché

```javascript
import { getCityWeatherInfoCached } from './api/weather.cached.js';

async function getWeather(city) {
  const result = await getCityWeatherInfoCached(city);
  
  if (result.success) {
    console.log(`Temperatura: ${result.data.temperature}°C`);
    
    if (result.fromCache) {
      console.log('📦 Datos del caché');
    } else {
      console.log('🌐 Datos frescos');
    }
  } else {
    console.error('Error:', result.error);
  }
}
```

### Ejemplo 2: Forzar Actualización

```javascript
// Ignorar caché y obtener datos frescos
const result = await getCityWeatherInfoCached('Bogotá', {
  forceRefresh: true
});
```

### Ejemplo 3: Múltiples Ciudades con Caché

```javascript
import { getMultipleCitiesWeatherCached } from './api/weather.cached.js';

const cities = ['Bogotá', 'Medellín', 'Cali'];
const results = await getMultipleCitiesWeatherCached(cities);

results.forEach(result => {
  if (result.success) {
    console.log(`${result.data.city}: ${result.data.temperature}°C`);
    if (result.fromCache) console.log('  (del caché)');
  }
});
```

### Ejemplo 4: Pre-cargar Ciudades

```javascript
import { preloadCitiesWeather } from './api/weather.cached.js';

// Pre-cargar ciudades principales al iniciar la app
const stats = await preloadCitiesWeather([
  'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena'
]);

console.log(`Pre-cargadas: ${stats.success}/${stats.total}`);
```

### Ejemplo 5: Verificar Estado del Caché

```javascript
import { checkCityWeatherCache } from './api/weather.cached.js';

const cacheInfo = checkCityWeatherCache('Bogotá');

if (cacheInfo) {
  console.log('Hay datos en caché');
  console.log('Expirado:', cacheInfo.expired);
} else {
  console.log('No hay datos en caché');
}
```

### Ejemplo 6: Estadísticas del Caché

```javascript
import { getCacheStats } from './utils/cache.js';

const stats = getCacheStats();

console.log(`Total: ${stats.total}`);
console.log(`Válidas: ${stats.valid}`);
console.log(`Expiradas: ${stats.expired}`);

stats.entries.forEach(entry => {
  console.log(`${entry.key}: ${entry.age}s de antigüedad`);
});
```

---

## 🎨 Personalización

### Cambiar Tiempo de Expiración

```javascript
// En src/utils/cache.js, cambia:
const DEFAULT_TTL = 10 * 60 * 1000; // 10 minutos

// A:
const DEFAULT_TTL = 5 * 60 * 1000;  // 5 minutos
// o
const DEFAULT_TTL = 30 * 60 * 1000; // 30 minutos
```

### Personalizar Mensajes

```javascript
// En src/app.cached.js, modifica showCacheWarning():
if (offline) {
  warning.textContent = 'Tu mensaje personalizado';
}
```

### Cambiar Estilos

Edita `styles/cache-indicators.css` para personalizar colores y animaciones.

---

## 🧪 Testing

### Ejecutar Tests del Caché

```bash
# Solo tests de caché
npm test -- cache.test.js

# Con cobertura
npm run test:coverage
```

### Tests Implementados

- ✅ Guardar y recuperar datos
- ✅ Expiración temporal
- ✅ Limpieza de caché expirado
- ✅ Modo offline
- ✅ fetchWithCache
- ✅ Múltiples entradas
- ✅ Manejo de errores

---

## 📊 Beneficios

### Para el Usuario

- ⚡ **Más rápido**: Datos instantáneos del caché
- 📱 **Funciona offline**: Acceso a datos aunque no haya conexión
- 💰 **Ahorra datos**: Menos peticiones HTTP
- 🔋 **Ahorra batería**: Menos uso de red

### Para el Desarrollador

- 🛡️ **Más robusto**: Maneja errores de red automáticamente
- 🧪 **Testeable**: Sistema completamente testeado
- 📝 **Bien documentado**: JSDoc completo
- 🔧 **Configurable**: TTL y opciones personalizables

### Para la API

- 📉 **Menos carga**: Reduce peticiones a la API
- 💵 **Ahorra costos**: Menos uso de cuota de API
- 🌍 **Más sostenible**: Reduce consumo de recursos

---

## 🔍 Debugging

### Ver Datos en Caché

```javascript
// En la consola del navegador
import { getCacheStats } from './utils/cache.js';
console.table(getCacheStats().entries);
```

### Limpiar Caché Manualmente

```javascript
import { clearAllCache } from './utils/cache.js';
clearAllCache();
console.log('Caché limpiado');
```

### Ver localStorage

```javascript
// En la consola del navegador
Object.keys(localStorage)
  .filter(key => key.startsWith('weather_cache_'))
  .forEach(key => {
    console.log(key, localStorage.getItem(key));
  });
```

---

## ⚠️ Consideraciones

### Limitaciones de localStorage

- **Tamaño máximo**: ~5-10 MB (varía por navegador)
- **Sincrónico**: Puede bloquear el hilo principal con datos grandes
- **Solo strings**: Los objetos se convierten a JSON

### Soluciones

1. **Limpieza automática**: El sistema limpia caché expirado automáticamente
2. **Manejo de errores**: Captura `QuotaExceededError` y limpia caché
3. **Datos compactos**: Solo guarda lo necesario

---

## 🚀 Próximos Pasos

### Mejoras Futuras

1. **IndexedDB**: Para almacenar más datos
2. **Service Worker**: Para caché más avanzado
3. **Compresión**: Comprimir datos antes de guardar
4. **Sincronización**: Sincronizar cambios cuando vuelva la conexión
5. **Priorización**: Caché inteligente basado en uso

---

## 📚 Recursos

### Documentación

- [MDN - localStorage](https://developer.mozilla.org/es/docs/Web/API/Window/localStorage)
- [MDN - Navigator.onLine](https://developer.mozilla.org/es/docs/Web/API/Navigator/onLine)
- [Web.dev - Offline Cookbook](https://web.dev/offline-cookbook/)

### Archivos del Proyecto

- `src/utils/cache.js` - Sistema de caché
- `src/api/weather.cached.js` - API con caché
- `src/app.cached.js` - Aplicación con caché
- `src/utils/__tests__/cache.test.js` - Tests

---

## ✅ Checklist de Implementación

- [ ] Copiar archivos de caché al proyecto
- [ ] Actualizar index.html con nuevo CSS y script
- [ ] Agregar botón de refresh (opcional)
- [ ] Ejecutar tests (`npm test`)
- [ ] Probar en navegador
- [ ] Probar modo offline (DevTools → Network → Offline)
- [ ] Verificar indicadores visuales
- [ ] Revisar consola para logs
- [ ] Hacer commit de cambios

---

## 🎉 ¡Listo!

Tu aplicación ahora tiene:
- ✅ Sistema de caché con expiración
- ✅ Soporte para modo offline
- ✅ Indicadores visuales de estado
- ✅ Tests completos
- ✅ Documentación completa

**¡Disfruta de tu aplicación optimizada! 🚀**
