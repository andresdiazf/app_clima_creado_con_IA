# 🧪 Guía de Pruebas en el Navegador

## 📋 Cómo Probar el Sistema de Caché con DevTools (F12)

Esta guía te muestra paso a paso cómo verificar que el sistema de caché funciona correctamente.

---

## 🚀 PASO 1: Preparar la Aplicación

### 1.1 Actualizar index.html

Primero, asegúrate de que `index.html` use la versión con caché:

```html
<!-- Al final del <body>, ANTES de cerrar </body> -->

<!-- ❌ COMENTAR O ELIMINAR ESTA LÍNEA: -->
<!-- <script type="module" src="src/app.js"></script> -->

<!-- ✅ AGREGAR ESTA LÍNEA: -->
<script type="module" src="src/app.cached.js"></script>
```

### 1.2 Agregar CSS de Indicadores

En el `<head>`, después de los otros CSS:

```html
<link rel="stylesheet" href="styles/cache-indicators.css">
```

### 1.3 Abrir en el Navegador

1. Abre `index.html` en tu navegador (Chrome, Edge, o Firefox)
2. O usa Live Server si tienes VS Code

---

## 🔍 PASO 2: Abrir DevTools (F12)

### Opción 1: Teclado
- Presiona **F12**
- O **Ctrl + Shift + I** (Windows/Linux)
- O **Cmd + Option + I** (Mac)

### Opción 2: Menú
1. Click derecho en la página
2. Selecciona "Inspeccionar" o "Inspect"

### Configurar DevTools

Una vez abierto:
1. Ve a la pestaña **Console** (Consola)
2. Mantén DevTools abierto durante todas las pruebas

---

## 📦 PASO 3: Probar Caché Básico

### 3.1 Primera Búsqueda (Sin Caché)

1. **En la aplicación:**
   - Escribe "Bogotá" en el campo de búsqueda
   - Presiona Enter o click en el botón 🔍

2. **En la Consola (F12):**
   - Deberías ver algo como:
   ```
   ✅ Aplicación con caché inicializada
   💡 Tip: Los datos se guardan por 10 minutos
   ```

3. **En la aplicación:**
   - Se muestra el clima de Bogotá
   - **NO** debe aparecer el mensaje "📦 Datos del caché"

### 3.2 Segunda Búsqueda (Con Caché)

1. **En la aplicación:**
   - Borra el campo de búsqueda
   - Escribe "Bogotá" de nuevo
   - Presiona Enter

2. **Resultado esperado:**
   - ✅ Los datos aparecen **INSTANTÁNEAMENTE** (mucho más rápido)
   - ✅ Aparece el mensaje: **"📦 Datos del caché"** (verde o azul)
   - ✅ En la consola: No hay nuevas peticiones HTTP

### 3.3 Verificar en la Pestaña Network

1. **Abrir Network:**
   - En DevTools, click en la pestaña **Network** (Red)
   - Asegúrate que esté grabando (botón rojo activo)

2. **Limpiar y buscar:**
   - Click en el botón 🚫 (Clear) en Network
   - Busca "Bogotá" de nuevo

3. **Verificar:**
   - ✅ **NO** debe aparecer una petición a `api.open-meteo.com`
   - ✅ Solo verás peticiones a archivos locales (JS, CSS)
   - ✅ Esto confirma que usa el caché

---

## 🔴 PASO 4: Probar Modo Offline

### 4.1 Activar Modo Offline

1. **En DevTools:**
   - Ve a la pestaña **Network** (Red)
   - Busca el checkbox **"Offline"** en la parte superior
   - ✅ **Marca el checkbox "Offline"**

   **Ubicación del checkbox:**
   ```
   Network
   ┌─────────────────────────────────────────┐
   │ 🔴 ⚫ 🚫  [✓] Offline  [Throttling ▼]  │
   │                                         │
   └─────────────────────────────────────────┘
   ```

2. **Verificar:**
   - En la esquina superior derecha de la página
   - Debe aparecer: **"🔴 Sin conexión"**

### 4.2 Buscar con Modo Offline

1. **En la aplicación:**
   - Busca "Bogotá" de nuevo (debe estar en caché)
   - Presiona Enter

2. **Resultado esperado:**
   - ✅ Los datos se muestran correctamente
   - ✅ Aparece: **"⚠️ Sin conexión - Mostrando datos guardados"** (amarillo)
   - ✅ El indicador muestra: **"🔴 Sin conexión"**

3. **En la Consola:**
   - Deberías ver:
   ```
   📴 Conexión perdida - Modo offline activado
   ```

### 4.3 Intentar Buscar Ciudad Nueva (Sin Caché)

1. **En la aplicación:**
   - Busca una ciudad que NO hayas buscado antes (ej: "París")
   - Presiona Enter

2. **Resultado esperado:**
   - ❌ Aparece un mensaje de error
   - ❌ No se muestran datos (porque no hay caché)
   - ✅ Esto es correcto: sin conexión y sin caché = no hay datos

### 4.4 Desactivar Modo Offline

1. **En DevTools:**
   - Ve a Network
   - ❌ **Desmarca el checkbox "Offline"**

2. **Verificar:**
   - Debe aparecer: **"🟢 Conectado"** (se oculta después de 2 segundos)

3. **En la Consola:**
   - Deberías ver:
   ```
   📶 Conexión recuperada
   🔄 Actualizando datos...
   ```

---

## 🕐 PASO 5: Probar Expiración del Caché

### 5.1 Ver Datos en localStorage

1. **En DevTools:**
   - Ve a la pestaña **Application** (Aplicación)
   - En el panel izquierdo, expande **Local Storage**
   - Click en tu dominio (ej: `file://` o `localhost`)

2. **Buscar entradas de caché:**
   - Busca claves que empiecen con `weather_cache_`
   - Ejemplo: `weather_cache_city_bogota`

3. **Ver contenido:**
   - Click en la clave
   - Verás un JSON con:
   ```json
   {
     "data": { ... },
     "timestamp": 1234567890,
     "ttl": 600000,
     "key": "weather_cache_city_bogota"
   }
   ```

### 5.2 Verificar Timestamp

1. **En la Consola:**
   ```javascript
   // Copiar y pegar este código:
   const cacheKey = 'weather_cache_city_bogota';
   const item = localStorage.getItem(cacheKey);
   const entry = JSON.parse(item);
   const age = (Date.now() - entry.timestamp) / 1000; // segundos
   const remaining = (entry.ttl - (Date.now() - entry.timestamp)) / 1000; // segundos
   
   console.log(`Edad del caché: ${Math.floor(age)} segundos`);
   console.log(`Expira en: ${Math.floor(remaining)} segundos`);
   ```

2. **Resultado:**
   - Verás cuánto tiempo tiene el caché
   - Y cuánto falta para que expire (default: 10 minutos = 600 segundos)

### 5.3 Forzar Expiración (Para Pruebas)

**Opción 1: Esperar 10 minutos** (no recomendado 😅)

**Opción 2: Modificar TTL en el código**

En `src/utils/cache.js`, cambia temporalmente:
```javascript
// Cambiar de:
const DEFAULT_TTL = 10 * 60 * 1000; // 10 minutos

// A:
const DEFAULT_TTL = 10 * 1000; // 10 segundos (solo para pruebas)
```

Luego:
1. Recarga la página (F5)
2. Busca "Bogotá"
3. Espera 11 segundos
4. Busca "Bogotá" de nuevo
5. Debe hacer una nueva petición (no usar caché)

**¡IMPORTANTE!** Restaura el valor original después de probar.

---

## 📊 PASO 6: Ver Estadísticas del Caché

### 6.1 En la Consola

Copia y pega este código:

```javascript
// Importar función de estadísticas
import { getCacheStats } from './src/utils/cache.js';

// Ver estadísticas
const stats = getCacheStats();
console.log('📊 Estadísticas del Caché:');
console.log(`Total de entradas: ${stats.total}`);
console.log(`Válidas: ${stats.valid}`);
console.log(`Expiradas: ${stats.expired}`);
console.table(stats.entries);
```

### 6.2 Resultado Esperado

```
📊 Estadísticas del Caché:
Total de entradas: 3
Válidas: 3
Expiradas: 0

┌─────────┬──────────┬─────────────────────┬─────┬───────────┬─────────┬──────┐
│ (index) │   key    │     timestamp       │ age │ remaining │ expired │ size │
├─────────┼──────────┼─────────────────────┼─────┼───────────┼─────────┼──────┤
│    0    │ 'bogota' │ '2026-05-25T...'    │ 45  │   555     │  false  │ 234  │
│    1    │ 'medellin'│ '2026-05-25T...'   │ 30  │   570     │  false  │ 245  │
└─────────┴──────────┴─────────────────────┴─────┴───────────┴─────────┴──────┘
```

---

## 🧹 PASO 7: Limpiar Caché

### 7.1 Limpiar Todo el Caché

En la Consola:

```javascript
import { clearAllCache } from './src/utils/cache.js';

const deleted = clearAllCache();
console.log(`✅ Se eliminaron ${deleted} entradas del caché`);
```

### 7.2 Limpiar Solo Caché Expirado

```javascript
import { clearExpiredCache } from './src/utils/cache.js';

const deleted = clearExpiredCache();
console.log(`✅ Se eliminaron ${deleted} entradas expiradas`);
```

### 7.3 Limpiar Ciudad Específica

```javascript
import { clearCityWeatherCache } from './src/api/weather.cached.js';

clearCityWeatherCache('Bogotá');
console.log('✅ Caché de Bogotá eliminado');
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

Marca cada item después de probarlo:

### Caché Básico
- [ ] Primera búsqueda muestra datos (sin caché)
- [ ] Segunda búsqueda es instantánea
- [ ] Aparece mensaje "📦 Datos del caché"
- [ ] No hay peticiones HTTP en Network

### Modo Offline
- [ ] Checkbox "Offline" activa modo offline
- [ ] Aparece indicador "🔴 Sin conexión"
- [ ] Datos en caché se muestran correctamente
- [ ] Aparece mensaje "⚠️ Sin conexión"
- [ ] Ciudad sin caché muestra error
- [ ] Al desactivar offline, aparece "🟢 Conectado"

### localStorage
- [ ] Datos se guardan en Application → Local Storage
- [ ] Claves empiezan con `weather_cache_`
- [ ] Cada entrada tiene timestamp y ttl
- [ ] Puedo ver el contenido JSON

### Estadísticas
- [ ] getCacheStats() muestra información correcta
- [ ] Puedo ver edad y tiempo restante
- [ ] La tabla muestra todas las entradas

### Limpieza
- [ ] clearAllCache() elimina todo
- [ ] clearExpiredCache() solo elimina expirados
- [ ] clearCityWeatherCache() elimina ciudad específica

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Problema 1: No aparece el mensaje de caché

**Causa:** Estás usando `app.js` en lugar de `app.cached.js`

**Solución:**
1. Verifica en `index.html` que uses:
   ```html
   <script type="module" src="src/app.cached.js"></script>
   ```
2. Recarga la página (F5)

### Problema 2: No funciona el modo offline

**Causa:** El checkbox "Offline" no está marcado correctamente

**Solución:**
1. Ve a DevTools → Network
2. Busca el checkbox "Offline" en la parte superior
3. Márcalo y verifica que aparezca el indicador rojo

### Problema 3: Los datos no se guardan en caché

**Causa:** localStorage puede estar deshabilitado

**Solución:**
1. Ve a DevTools → Console
2. Ejecuta: `console.log(localStorage)`
3. Si da error, localStorage está bloqueado
4. Verifica la configuración de privacidad del navegador

### Problema 4: No veo las entradas en localStorage

**Causa:** Estás buscando en el lugar equivocado

**Solución:**
1. DevTools → Application (no Console)
2. Panel izquierdo → Local Storage
3. Expande y click en tu dominio
4. Busca claves con `weather_cache_`

### Problema 5: El caché no expira

**Causa:** El TTL es muy largo (10 minutos)

**Solución para pruebas:**
1. Cambia `DEFAULT_TTL` a 10 segundos
2. O elimina el caché manualmente
3. O espera 10 minutos 😅

---

## 📸 CAPTURAS DE PANTALLA ESPERADAS

### 1. Primera Búsqueda (Sin Caché)
```
┌─────────────────────────────────────┐
│  Clima App                          │
├─────────────────────────────────────┤
│  [Bogotá        ] [🔍]              │
│                                     │
│  Bogotá, Colombia                   │
│  🌤️ 18°C                            │
│  Parcialmente nublado               │
└─────────────────────────────────────┘
```

### 2. Segunda Búsqueda (Con Caché)
```
┌─────────────────────────────────────┐
│  Clima App                          │
├─────────────────────────────────────┤
│  📦 Datos del caché                 │ ← NUEVO
│  [Bogotá        ] [🔍]              │
│                                     │
│  Bogotá, Colombia                   │
│  🌤️ 18°C                            │
│  Parcialmente nublado               │
└─────────────────────────────────────┘
```

### 3. Modo Offline
```
┌─────────────────────────────────────┐
│  Clima App          🔴 Sin conexión │ ← NUEVO
├─────────────────────────────────────┤
│  ⚠️ Sin conexión - datos guardados  │ ← NUEVO
│  [Bogotá        ] [🔍]              │
│                                     │
│  Bogotá, Colombia                   │
│  🌤️ 18°C                            │
│  Parcialmente nublado               │
└─────────────────────────────────────┘
```

---

## 🎓 CONCEPTOS APRENDIDOS

Al completar estas pruebas, habrás aprendido:

- ✅ Cómo usar DevTools para debugging
- ✅ Cómo verificar peticiones HTTP en Network
- ✅ Cómo inspeccionar localStorage
- ✅ Cómo simular modo offline
- ✅ Cómo verificar el funcionamiento del caché
- ✅ Cómo usar la consola para debugging avanzado

---

## 📚 RECURSOS ADICIONALES

### Atajos de DevTools

| Acción | Windows/Linux | Mac |
|--------|---------------|-----|
| Abrir DevTools | F12 o Ctrl+Shift+I | Cmd+Option+I |
| Console | Ctrl+Shift+J | Cmd+Option+J |
| Network | Ctrl+Shift+E | Cmd+Option+E |
| Recargar página | F5 o Ctrl+R | Cmd+R |
| Recargar sin caché | Ctrl+Shift+R | Cmd+Shift+R |
| Limpiar consola | Ctrl+L | Cmd+K |

### Comandos Útiles en Consola

```javascript
// Ver todas las claves de caché
Object.keys(localStorage)
  .filter(k => k.startsWith('weather_cache_'))
  .forEach(k => console.log(k));

// Ver tamaño total del caché
let total = 0;
Object.keys(localStorage).forEach(k => {
  if (k.startsWith('weather_cache_')) {
    total += localStorage.getItem(k).length;
  }
});
console.log(`Tamaño total: ${total} bytes`);

// Simular conexión lenta
// En Network → Throttling → Slow 3G
```

---

## ✅ ¡LISTO!

Ahora sabes cómo:
- ✅ Probar el sistema de caché
- ✅ Verificar el modo offline
- ✅ Usar DevTools para debugging
- ✅ Inspeccionar localStorage
- ✅ Verificar peticiones HTTP

**¡Feliz testing! 🧪✨**
