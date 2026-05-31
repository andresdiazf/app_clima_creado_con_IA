# 🔐 Guía de Seguridad - Weather App

**Para Desarrolladores**

---

## Tabla de Contenidos

1. [Principios de Seguridad](#principios)
2. [Variables de Entorno](#variables-entorno)
3. [Protección XSS](#xss)
4. [Validación de Entrada](#validacion)
5. [Almacenamiento Seguro](#almacenamiento)
6. [APIs y Datos](#apis)
7. [Testing de Seguridad](#testing)
8. [Checklist de Seguridad](#checklist)

---

## 🎯 Principios de Seguridad {#principios}

### 1. Defensa en Profundidad
Múltiples capas de seguridad, no confíes en una sola.

```javascript
// ✅ BUENA PRÁCTICA: Múltiples validaciones
export async function searchWeather(city) {
  // Capa 1: Validación local
  city = city.trim();
  if (!city) return;
  
  try {
    // Capa 2: API sanitiza con encodeURIComponent
    const location = await geocodeCity(city);
    
    // Capa 3: Validación de respuesta
    if (!location?.latitude) throw new Error('Invalid location');
  } catch (err) {
    // Capa 4: Manejo de error seguro
    showError(err.message || 'Error desconocido');
  }
}
```

### 2. Principio de Menor Privilegio
Acceso mínimo necesario.

```javascript
// ✅ BUENO: localStorage local (usuario controlado)
localStorage.setItem(KEY, JSON.stringify(cities));

// ❌ MALO: Servidor con acceso total
serverAPI.saveUserData(sensitiveData); // Si lo hicieras
```

### 3. Datos Sensibles ≠ Texto Plano
Nunca.

```javascript
// ❌ NUNCA HAGAS ESTO
const API_KEY = 'sk-1234567890'; // RIESGO CRÍTICO!

// ✅ SIEMPRE HAZA ESTO
const API_KEY = process.env.VITE_API_KEY;
```

### 4. Confianza Cero
No confíes en entrada del usuario, validar siempre.

```javascript
// ❌ CONFÍA DEMASIADO
const city = userInput; // ¡Podría ser "<script>"!

// ✅ VALIDA SIEMPRE
const city = encodeURIComponent(userInput.trim());
```

---

## 🔑 Variables de Entorno {#variables-entorno}

### Cómo usar `.env`

```bash
# 1. Copiar ejemplo
cp .env.example .env

# 2. Llenar valores (NUNCA subes .env)
# .env (no en git)
WEATHER_API_KEY=tu_clave_aqui
GEOCODING_API_KEY=tu_clave_aqui
```

### Acceder en código

```javascript
// ✅ CORRECTO: Variables centralizadas
import { API_KEY } from './config.js';

// Si agregas backend/build tool
// const API_KEY = import.meta.env.VITE_API_KEY;
```

### Proteger `.env`

```bash
# Verificar que está en .gitignore
cat .gitignore | grep ".env"
# Salida: .env ✅

# Verificar que NO está commiteado
git ls-files | grep ".env"
# (No debe salir nada)
```

---

## 🛡️ Protección XSS {#xss}

### Entender XSS

**XSS** = Inyección de código malicioso en HTML

```javascript
// ❌ VULNERABLE: Inyección XSS
const city = "<img src=x onerror='alert(1)'>";
document.innerHTML = `<p>${city}</p>`; // ¡Ejecuta alert!

// ✅ SEGURO: textContent no ejecuta HTML
document.textContent = city; // Solo muestra texto
```

### Patrones Seguros

```javascript
// PATRÓN 1: textContent (recomendado)
element.textContent = userInput; // ✅ Seguro

// PATRÓN 2: createElement
const el = document.createElement('div');
el.textContent = userInput; // ✅ Seguro

// PATRÓN 3: insertAdjacentHTML (solo HTML de confianza)
element.insertAdjacentHTML('beforeend', '<button>OK</button>'); // ✅ Si confías
container.insertAdjacentHTML('beforeend', userInput); // ❌ SI NO confías

// PATRÓN 4: Sanitizar antes de innerHTML
const clean = DOMPurify.sanitize(userInput);
element.innerHTML = clean; // ✅ Si sanitizas
```

### En Weather App

```javascript
// ✅ BUENO: Usa textContent
btn.textContent = city; // src/ui/render.js:100

// ✅ BUENO: Datos de API (confiable)
precip.innerHTML = `💧 ${day.precipitationProbability}%`; 
// Aunque mejor sería:
precip.textContent = `💧 ${day.precipitationProbability}%`;
```

---

## ✔️ Validación de Entrada {#validacion}

### Niveles de Validación

```javascript
// NIVEL 1: Tipo
if (typeof city !== 'string') throw new Error('Invalid type');

// NIVEL 2: Largo
if (city.length > 100) throw new Error('Too long');
if (city.length < 2) throw new Error('Too short');

// NIVEL 3: Contenido
if (!/^[a-zñáéíóúüA-ZÑÁÉÍÓÚÜ\s-]*$/.test(city)) {
  throw new Error('Caracteres inválidos');
}

// NIVEL 4: URL encoding
const encoded = encodeURIComponent(city); // Para URLs
```

### Validación en Weather App

```javascript
// src/app.js - Validación actual
async function searchWeather(city) {
  city = city.trim(); // ✅ Nivel 1: Limpia espacios
  if (!city) return;  // ✅ Nivel 2: Rechaza vacío
}

// src/api/geocoding.js - Validación API
const url = `${API_URL}?name=${encodeURIComponent(city)}`; // ✅ Nivel 3
```

### Mejorar Validación

```javascript
// MEJORA PROPUESTA
function validateCity(city) {
  if (typeof city !== 'string') throw new TypeError('City must be string');
  
  const trimmed = city.trim();
  
  if (trimmed.length < 2) throw new Error('City too short');
  if (trimmed.length > 100) throw new Error('City too long');
  
  // Permitir: letras, espacios, guiones, tildes
  if (!/^[a-zñáéíóúüA-ZÑÁÉÍÓÚÜ\s'-]+$/.test(trimmed)) {
    throw new Error('City contiene caracteres inválidos');
  }
  
  return trimmed;
}

// Uso
export async function searchWeather(city) {
  const validCity = validateCity(city); // ✅ Validación robusta
  const location = await geocodeCity(validCity);
  // ...
}
```

---

## 💾 Almacenamiento Seguro {#almacenamiento}

### localStorage Seguro

```javascript
// ✅ SEGURO: Solo datos públicos
localStorage.setItem('recent_cities', JSON.stringify(['Bogotá', 'Madrid']));

// ❌ INSEGURO: Datos sensibles
localStorage.setItem('user_password', password); // ¡NUNCA!
localStorage.setItem('api_key', apiKey);        // ¡NUNCA!
```

### Error Handling

```javascript
// ✅ BUENO: Manejo de errores
function getRecentCities() {
  try {
    const data = localStorage.getItem('weather_cities');
    return JSON.parse(data) ?? [];
  } catch (e) {
    console.error('Error reading localStorage', e);
    return []; // Fallback seguro
  }
}

// ❌ MALO: Sin manejo de errores
function getRecentCities() {
  return JSON.parse(localStorage.getItem('weather_cities')); // Puede fallar
}
```

### Limpiar Datos

```javascript
// Función para borrar datos (implementar en UI)
function clearAllData() {
  try {
    localStorage.removeItem('weather_cities');
    console.log('Data cleared');
  } catch (e) {
    console.error('Error clearing data', e);
  }
}
```

---

## 🌐 APIs y Datos {#apis}

### Llamadas API Seguras

```javascript
// ✅ BUENO: Validar respuesta
export async function fetchWeather(lat, lon) {
  const res = await fetch(url);
  
  if (!res.ok) {
    throw new Error('API error: ' + res.statusText);
  }
  
  const data = await res.json();
  
  // Validar estructura esperada
  if (!data.current) throw new Error('Invalid API response');
  
  return data.current;
}

// ❌ MALO: Sin validación
export async function fetchWeather(lat, lon) {
  const res = await fetch(url);
  const data = await res.json();
  return data.current; // ¿Y si la respuesta es inválida?
}
```

### CORS y Seguridad

```javascript
// Open-Meteo tiene CORS abierto:
// Access-Control-Allow-Origin: *

// Para APIs con CORS cerrado, necesitarías backend (proxy)
// app.js → backend → open-meteo

// Nunca hagas requests directas a APIs con CORS cerrado:
// Error: Access to XMLHttpRequest blocked by CORS policy
```

### Rate Limiting

```javascript
// ✅ BUENO: Debounce para no saturar API
import { debounce } from './utils/debounce.js';

const debouncedSearch = debounce(searchWeather, 500);

document.addEventListener('input', () => {
  debouncedSearch(inputValue); // Max 1 request per 500ms
});

// Implementar debounce
function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
```

---

## 🧪 Testing de Seguridad {#testing}

### Tests XSS

```javascript
// test: XSS injection
import { renderWeather } from '../ui/render.js';

describe('XSS Protection', () => {
  test('no ejecuta scripts en city name', () => {
    const maliciousCity = '<script>alert("XSS")</script>';
    const location = {
      name: maliciousCity,
      country: 'XX',
      latitude: 0,
      longitude: 0,
    };
    
    renderWeather(location, mockWeather);
    
    // Verificar que se muestra como texto, no se ejecuta
    const cityDisplay = document.getElementById('city-display');
    expect(cityDisplay.textContent).toBe(maliciousCity);
    expect(cityDisplay.innerHTML).not.toContain('<script>');
  });
});
```

### Tests Validación

```javascript
describe('Input Validation', () => {
  test('rechaza ciudades vacías', () => {
    expect(() => validateCity('')).toThrow();
    expect(() => validateCity('   ')).toThrow();
  });
  
  test('rechaza ciudades muy largas', () => {
    const longCity = 'a'.repeat(101);
    expect(() => validateCity(longCity)).toThrow();
  });
  
  test('acepta ciudades válidas', () => {
    expect(validateCity('Bogotá')).toBe('Bogotá');
    expect(validateCity('  Madrid  ')).toBe('Madrid');
  });
});
```

### Ejecutar Tests

```bash
npm test                    # Una sola vez
npm run test:watch         # Modo watch
npm run test:coverage      # Con cobertura

# Verificar cobertura
open coverage/lcov-report/index.html
```

---

## 📋 Checklist de Seguridad {#checklist}

### Antes de Commit

- [ ] ¿Hay claves hardcodeadas? (`grep -r "password\|key\|secret" src/`)
- [ ] ¿Usas textContent en lugar de innerHTML? (revisar)
- [ ] ¿Validas entrada del usuario? (revisar)
- [ ] ¿Hay try/catch en APIs? (revisar)
- [ ] ¿Está .env en .gitignore? (verificar)
- [ ] ¿Pasaron los tests? (`npm test`)
- [ ] ¿No hay vulnerabilidades en dependencias? (`npm audit`)

### Antes de Producción

- [ ] ¿HTTPS configurado? (Host responsibility)
- [ ] ¿CSP headers configurados? (Si hay backend)
- [ ] ¿Revisado por otro developer? (Code review)
- [ ] ¿Testing de seguridad completo? (OWASP Top 10)
- [ ] ¿Política de privacidad visible? (Link en footer)
- [ ] ¿Licencia clara? (LICENSE.md)

### Mantenimiento

- [ ] ¿Dependencias actualizadas? (`npm update`)
- [ ] ¿Sin vulnerabilidades conocidas? (`npm audit`)
- [ ] ¿Logs de seguridad revisados? (Si hay backend)
- [ ] ¿Reportes de errores revisados? (Si hay Sentry)

---

## 🚨 Manejo de Vulnerabilidades

### Encontraste una vulnerabilidad?

1. **NO** la publiques en Issues
2. **SÍ** reporta privadamente al mantenedor
3. Dale 30 días para fix
4. Coordina disclosure

### Procesos de Auditoría

```bash
# Auditar dependencias
npm audit

# Auditar código
npm run lint        # Si tienes ESLint
npm test --coverage # Cobertura de tests

# Auditar manualment
# - Revisar XSS vectors
# - Revisar validación
# - Revisar storage
# - Revisar APIs
```

---

## 📚 Recursos

### OWASP Top 10 (2023)
1. Broken Access Control
2. Cryptographic Failures
3. Injection
4. Insecure Design
5. Security Misconfiguration
6. Vulnerable Components
7. Authentication Failures
8. Data Integrity Failures
9. Logging Failures
10. SSRF

### Herramientas

- [OWASP ZAP](https://www.zaproxy.org/) - Security scanner
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Dependency audit
- [Snyk](https://snyk.io/) - Vulnerability database
- [SonarQube](https://www.sonarqube.org/) - Code quality

### Documentación

- [MDN: Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [OWASP](https://owasp.org/)
- [CWE Top 25](https://cwe.mitre.org/top25/)

---

## 🎓 Conclusión

**Seguridad no es una características, es un proceso.**

- ✅ Implementa defensas
- ✅ Testa constantemente
- ✅ Mantén dependencias actualizadas
- ✅ Sé transparente
- ✅ Aprende de errores

**Weather App está construida con seguridad en mente.**

---

**Documento válido desde**: Junio 2024  
**Última revisión**: Junio 2024  
**Mantenedor**: [Tu nombre]
