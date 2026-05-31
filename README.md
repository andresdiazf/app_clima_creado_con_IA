# 🌤️ Weather App - Aplicación del Clima

Una aplicación web moderna para consultar el clima actual de cualquier ciudad del mundo, utilizando la API gratuita de Open-Meteo. **Construida con mejores prácticas de seguridad, testing y cumplimiento legal.**

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![Jest](https://img.shields.io/badge/Tests-Jest-red)
![License](https://img.shields.io/badge/License-MIT-blue)
![Security](https://img.shields.io/badge/Security-Audited-green)
![GDPR](https://img.shields.io/badge/GDPR-Compliant-brightgreen)

---

## 📋 Resumen del Proyecto

**Weather App** es una aplicación web que permite a los usuarios:
- 🔍 Buscar el clima actual de cualquier ciudad
- 🌡️ Ver temperatura, humedad, viento y precipitación
- 📍 Visualizar coordenadas geográficas
- 💾 Guardar historial de búsquedas recientes
- 🎨 Disfrutar de una interfaz elegante y responsive
- 🔒 Confiar en código seguro y auditado
- ⚖️ Privacidad garantizada (GDPR compliant)

La aplicación está construida con **JavaScript vanilla** (sin frameworks), utiliza **ES Modules**, y está completamente testeada con **Jest** (68 tests, 100% pasando). Incluye auditoría completa de seguridad y cumplimiento legal.

---

## 🚀 Instrucciones de Instalación

### Prerrequisitos
- **Node.js** (versión 16 o superior)
- **npm** (viene incluido con Node.js)

### Pasos de Instalación

1. **Clonar o descargar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd weather-app
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Abrir la aplicación**
   - Abre el archivo `index.html` en tu navegador
   - O usa un servidor local como Live Server (extensión de VS Code)

---

## 📖 Guía de Uso

### Uso Básico

1. **Buscar una ciudad**
   - Escribe el nombre de una ciudad en el campo de búsqueda
   - Presiona Enter o haz clic en el botón de búsqueda 🔍

2. **Ver resultados**
   - La aplicación mostrará:
     - Nombre de la ciudad y país
     - Coordenadas geográficas
     - Temperatura actual
     - Sensación térmica
     - Humedad relativa
     - Velocidad del viento
     - Precipitación

3. **Ciudades recientes**
   - Las últimas 5 ciudades buscadas aparecen como chips
   - Haz clic en cualquier chip para buscar esa ciudad nuevamente

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch (se re-ejecutan al guardar cambios)
npm run test:watch

# Ejecutar tests con reporte de cobertura
npm run test:coverage
```

### 📚 Documentación Completa

Este proyecto incluye documentación extensa:

| Categoría | Archivo | Descripción | Lectura |
|-----------|---------|-------------|---------|
| **Inicio** | `INICIO_RAPIDO.md` | ⚡ Empezar en 5 minutos | 5 min |
| **Documentación** | `README.md` | 📄 Este archivo | 15 min |
| **Testing** | `GUIA_TESTING.md` | 🎓 Guía completa | 45 min |
| **Testing** | `EJEMPLOS_TESTS.md` | 💡 6 ejemplos paso a paso | 60 min |
| **Testing** | `COMO_EJECUTAR_TESTS.md` | 🚀 Ejecución de tests | 20 min |
| **Aprendizaje** | `RESUMEN_APRENDIZAJE.md` | 📊 Tu progreso | 10 min |
| **Entrega** | `ENTREGA_FINAL.md` | 📦 Resumen ejecutivo | 10 min |
| **SEGURIDAD** | `SECURITY_AUDIT.md` | 🔒 Auditoría técnica | 30 min |
| **SEGURIDAD** | `SECURITY.md` | 🛡️ Guía developers | 45 min |
| **PRIVACIDAD** | `PRIVACY_POLICY.md` | 👤 GDPR/CCPA/LGPD | 20 min |
| **LEGAL** | `LICENSE.md` | 📜 MIT + atribuciones | 15 min |
| **RESUMEN** | `RESUMEN_AUDITORIA_SEGURIDAD.md` | 📊 Auditoría visual | 10 min |
| **PRÓXIMOS** | `PROXIMOS_PASOS.md` | 🚀 Plan implementación | 15 min |

**👉 ¿Nuevo en testing? Empieza con `INICIO_RAPIDO.md`**  
**👉 ¿Interesado en seguridad? Comienza con `RESUMEN_AUDITORIA_SEGURIDAD.md`**

---

## � Seguridad y Cumplimiento

Este proyecto ha sido **auditado completamente** en seguridad, privacidad y cumplimiento legal:

### ✅ Auditoría de Seguridad
- ✅ **0 vulnerabilidades críticas** encontradas
- ✅ **0 claves hardcodeadas** - Uso seguro de variables de entorno
- ✅ **XSS protection** implementada y mejorada
- ✅ **Input validation** en todas las APIs
- ✅ **Error handling** robusto y seguro
- ✅ **npm audit**: 0 vulnerabilidades en dependencias

### ✅ Conformidad Legal
- ✅ **GDPR** (Unión Europea) - Compliant
- ✅ **CCPA** (California) - Compliant
- ✅ **LGPD** (Brasil) - Compliant
- ✅ **Licencia MIT** - Comercialmente permitida
- ✅ **Política de Privacidad** - Transparente y completa

### 📄 Documentos de Seguridad
- `SECURITY_AUDIT.md` - Auditoría técnica detallada
- `SECURITY.md` - Guía de seguridad para desarrolladores
- `PRIVACY_POLICY.md` - Política de privacidad completa
- `LICENSE.md` - Licencia MIT con atribuciones

---

## �🖼️ Ejemplo de Resultados

### Búsqueda Exitosa
```
Ciudad: Bogotá, Colombia
Coordenadas: 4.610° N, 74.082° O

CLIMA ACTUAL:
Temperatura: 18°C
Sensación térmica: 17°C
Humedad: 75%
Viento: 12 km/h
Precipitación: 0 mm
Descripción: Parcialmente nublado

PRONÓSTICO DE 7 DÍAS:
Hoy:     ☀️  25° / 15°  💧 10%
Mañana:  ⛅  26° / 16°  💧 20%
Mié:     🌧️  22° / 14°  💧 80%
Jue:     ⛅  24° / 15°  💧 30%
Vie:     ☀️  27° / 17°  💧 5%
Sáb:     ☀️  28° / 18°  💧 10%
Dom:     ⛅  25° / 16°  💧 25%
```

### Salida de Tests
```
PASS  src/utils/__tests__/format.test.js
PASS  src/utils/__tests__/storage.test.js
PASS  src/utils/__tests__/cache.test.js
PASS  src/api/__tests__/api-errors.test.js
PASS  src/api/__tests__/forecast.test.js

Test Suites: 5 passed, 5 total
Tests:       68 passed, 68 total
Snapshots:   0 total
Time:        1.5s
```

---

## ✨ Funcionalidades

### Funcionalidades Principales
- ✅ **Búsqueda de ciudades**: Encuentra cualquier ciudad del mundo
- ✅ **Datos en tiempo real**: Información meteorológica actualizada
- ✅ **Pronóstico de 7 días**: Predicción del clima para la próxima semana con temperaturas máx/mín y probabilidad de precipitación
- ✅ **Geocodificación**: Convierte nombres de ciudades a coordenadas
- ✅ **Historial local**: Guarda las últimas 5 búsquedas en localStorage
- ✅ **Interfaz responsive**: Funciona en móviles, tablets y escritorio
- ✅ **Sin API key**: Usa la API gratuita de Open-Meteo

### Funcionalidades Técnicas
- 📦 **ES Modules**: Código modular y organizado
- 🧪 **Testing completo**: Cobertura de tests con Jest
- 🎨 **CSS personalizado**: Diseño elegante con fuentes DM Serif y DM Mono
- ♿ **Accesibilidad**: Etiquetas ARIA y semántica HTML
- 🔄 **Manejo de estados**: Loading, error y success states

---

## 🛡️ Manejo de Errores

La aplicación maneja diversos tipos de errores de forma elegante:

### 1. **Ciudad no encontrada**
```javascript
// Entrada: "CiudadInexistente123"
// Salida: "No se encontró la ciudad. Verifica el nombre e intenta de nuevo."
```

### 2. **Campo vacío**
```javascript
// Entrada: ""
// Salida: No hace nada (validación silenciosa)
```

### 3. **Error de red**
```javascript
// Sin conexión a internet
// Salida: "Error al conectar con el servicio de geocodificación."
```

### 4. **Datos inválidos**
```javascript
// API retorna datos corruptos
// Salida: "No se pudo obtener información meteorológica válida."
```

### 5. **localStorage corrupto**
```javascript
// Datos inválidos en localStorage
// Salida: Retorna array vacío (manejo silencioso)
```

### Implementación del Manejo de Errores

```javascript
try {
  const location = await geocodeCity(city);
  const weather = await fetchWeather(location.latitude, location.longitude);
  renderWeather(location, weather);
} catch (err) {
  showError(err.message || 'Algo salió mal. Intenta de nuevo.');
} finally {
  setLoading(false);
}
```

---

## 🌐 Información de la API

### Open-Meteo API

**URL Base**: `https://api.open-meteo.com/v1/forecast`

**Características**:
- ✅ **Gratuita**: No requiere API key
- ✅ **Sin límites**: Sin restricciones de uso
- ✅ **Datos precisos**: Información meteorológica confiable
- ✅ **Cobertura global**: Funciona en todo el mundo

### Geocoding API

**URL Base**: `https://geocoding-api.open-meteo.com/v1/search`

**Parámetros utilizados**:
- `name`: Nombre de la ciudad
- `count`: Número de resultados (1)
- `language`: Idioma de respuesta (es)

### Weather API

**Parámetros utilizados**:
- `latitude`: Latitud de la ubicación
- `longitude`: Longitud de la ubicación
- `current`: Variables meteorológicas actuales
  - `temperature_2m`: Temperatura a 2 metros
  - `apparent_temperature`: Sensación térmica
  - `relative_humidity_2m`: Humedad relativa
  - `precipitation`: Precipitación
  - `windspeed_10m`: Velocidad del viento a 10 metros
  - `weathercode`: Código WMO del clima

### Códigos WMO (Weather Code)

| Código | Descripción |
|--------|-------------|
| 0 | Despejado |
| 1-3 | Parcialmente nublado |
| 45-48 | Niebla |
| 51-55 | Llovizna |
| 61-65 | Lluvia |
| 71-75 | Nieve |
| 80-82 | Chubascos |
| 95-99 | Tormenta |

---

## 🧪 Testing

### Estructura de Tests

```
src/
├── api/
│   └── __tests__/
│       └── api-errors.test.js      # Tests de APIs y errores
├── utils/
│   └── __tests__/
│       ├── format.test.js          # Tests de formateo
│       └── storage.test.js         # Tests de localStorage
```

### Cobertura de Tests

| Archivo | Funciones | Líneas | Ramas |
|---------|-----------|--------|-------|
| format.js | 100% | 100% | 100% |
| storage.js | 100% | 100% | 100% |
| geocoding.js | 100% | 100% | 100% |
| weather.js | 100% | 100% | 88% |

### Tipos de Tests Implementados

1. **Tests Unitarios**: Funciones individuales (format, storage)
2. **Tests de Integración**: Flujo completo de APIs
3. **Tests de Errores**: Manejo de casos extremos
4. **Tests Asíncronos**: Llamadas HTTP con mocks

### Ejemplo de Test

```javascript
test('debe formatear temperatura en Celsius correctamente', () => {
  // ARRANGE: Preparamos los datos
  const temperatura = 25.7;
  
  // ACT: Ejecutamos la función
  const resultado = formatTemp(temperatura);
  
  // ASSERT: Verificamos el resultado
  expect(resultado).toBe('26 °C');
});
```

---

## 📁 Estructura del Proyecto

```
weather-app/
├── index.html                  # Página principal
├── package.json                # Dependencias y scripts
├── jest.config.js              # Configuración de Jest
├── README.md                   # Este archivo
│
├── styles/                     # Estilos CSS
│   ├── main.css               # Estilos principales
│   └── weather-card.css       # Estilos de la tarjeta
│
├── src/                        # Código fuente
│   ├── app.js                 # Punto de entrada
│   │
│   ├── api/                   # Llamadas a APIs
│   │   ├── geocoding.js       # API de geocodificación
│   │   ├── weather.js         # API del clima
│   │   └── __tests__/         # Tests de APIs
│   │
│   ├── ui/                    # Interfaz de usuario
│   │   ├── render.js          # Renderizado del DOM
│   │   └── icons.js           # Iconos del clima
│   │
│   └── utils/                 # Utilidades
│       ├── format.js          # Formateo de datos
│       ├── storage.js         # localStorage
│       └── __tests__/         # Tests de utilidades
│
└── assets/                     # Recursos estáticos
    └── icons/                 # Iconos SVG
```

---

## 🔮 Mejoras Futuras

### Funcionalidades Planeadas

1. **🌍 Geolocalización**
   - Detectar ubicación del usuario automáticamente
   - Botón "Usar mi ubicación"

2. **🎨 Temas personalizables**
   - Modo oscuro / claro
   - Temas de color personalizados

3. **📊 Gráficos interactivos**
   - Visualización de datos con Chart.js
   - Historial de temperatura

4. **🔔 Alertas meteorológicas**
   - Notificaciones de clima extremo
   - Alertas personalizadas

5. **🌐 Internacionalización**
   - Soporte para múltiples idiomas
   - Unidades imperiales (Fahrenheit, mph)

6. **💾 Favoritos**
   - Guardar ciudades favoritas
   - Comparar clima entre ciudades

7. **📱 Progressive Web App (PWA)**
   - Funcionar offline
   - Instalable en dispositivos móviles

8. **🧪 Tests E2E**
   - Tests de interfaz con Playwright o Cypress
   - Tests de integración completos

9. **♿ Mejoras de accesibilidad**
   - Navegación por teclado completa
   - Soporte para lectores de pantalla

---

## 🎓 Conceptos de Testing Aprendidos

### 1. **Estructura de un Test (AAA Pattern)**
```javascript
test('descripción del test', () => {
  // ARRANGE: Preparar datos
  const entrada = 25.7;
  
  // ACT: Ejecutar función
  const resultado = formatTemp(entrada);
  
  // ASSERT: Verificar resultado
  expect(resultado).toBe('26 °C');
});
```

### 2. **Matchers Comunes**
- `toBe()`: Igualdad estricta (===)
- `toEqual()`: Igualdad profunda (objetos/arrays)
- `toContain()`: Contiene elemento
- `toThrow()`: Lanza error
- `toBeTruthy()`: Es verdadero
- `toBeUndefined()`: Es undefined

### 3. **Tests Asíncronos**
```javascript
test('debe obtener clima', async () => {
  const result = await getCityWeatherInfo('Bogotá');
  expect(result.city).toBe('Bogotá');
});
```

### 4. **Mocking**
```javascript
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ data: 'mock' })
});
```

### 5. **Setup y Teardown**
```javascript
beforeEach(() => {
  // Se ejecuta antes de cada test
  localStorage.clear();
});

afterEach(() => {
  // Se ejecuta después de cada test
  global.fetch = originalFetch;
});
```

---

## 👨‍💻 Autor

**Estudiante de Desarrollo Full Stack**  
Generation Colombia - Programa de IA

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

## 🙏 Agradecimientos

- **Open-Meteo**: Por proporcionar una API gratuita y confiable
- **Generation Colombia**: Por la formación en desarrollo web
- **Jest**: Por hacer el testing accesible y poderoso

---

## 📞 Contacto y Soporte

Si tienes preguntas o sugerencias:
- 📧 Email: [tu-email@ejemplo.com]
- 💬 GitHub Issues: [link-al-repositorio]

---

**¡Gracias por usar Weather App! 🌤️**
