# 📝 Ejemplos Prácticos de Tests

Esta guía contiene ejemplos paso a paso de cómo escribir tests para diferentes escenarios.

---

## 📚 Tabla de Contenidos

1. [Ejemplo 1: Test Simple de Función Pura](#ejemplo-1-test-simple-de-función-pura)
2. [Ejemplo 2: Test con Múltiples Casos](#ejemplo-2-test-con-múltiples-casos)
3. [Ejemplo 3: Test de Función Asíncrona](#ejemplo-3-test-de-función-asíncrona)
4. [Ejemplo 4: Test con Mock de API](#ejemplo-4-test-con-mock-de-api)
5. [Ejemplo 5: Test de localStorage](#ejemplo-5-test-de-localstorage)
6. [Ejemplo 6: Test de Manejo de Errores](#ejemplo-6-test-de-manejo-de-errores)

---

## Ejemplo 1: Test Simple de Función Pura

### 🎯 Objetivo
Testear una función que formatea temperatura.

### 📝 Código a Testear

```javascript
// src/utils/format.js
export function formatTemp(value, unit = 'C') {
  return `${Math.round(value)} °${unit}`;
}
```

### ✅ Test Paso a Paso

```javascript
// src/utils/__tests__/format.test.js
import { formatTemp } from '../format.js';

describe('formatTemp', () => {
  
  // PASO 1: Test básico con valores normales
  test('debe formatear 25.7°C como "26 °C"', () => {
    // ARRANGE: Preparamos el dato de entrada
    const temperatura = 25.7;
    
    // ACT: Ejecutamos la función
    const resultado = formatTemp(temperatura);
    
    // ASSERT: Verificamos que el resultado sea correcto
    expect(resultado).toBe('26 °C');
  });
  
  // PASO 2: Test con números negativos
  test('debe manejar temperaturas negativas', () => {
    const resultado = formatTemp(-5.3);
    expect(resultado).toBe('-5 °C');
  });
  
  // PASO 3: Test con parámetro opcional
  test('debe formatear en Fahrenheit cuando se especifica', () => {
    const resultado = formatTemp(77, 'F');
    expect(resultado).toBe('77 °F');
  });
  
  // PASO 4: Test de redondeo
  test('debe redondear correctamente', () => {
    expect(formatTemp(20.4)).toBe('20 °C'); // Redondea hacia abajo
    expect(formatTemp(20.5)).toBe('21 °C'); // Redondea hacia arriba
    expect(formatTemp(20.6)).toBe('21 °C'); // Redondea hacia arriba
  });
});
```

### 🎓 Conceptos Aprendidos
- ✅ Estructura básica de un test (AAA: Arrange, Act, Assert)
- ✅ Uso de `describe` para agrupar tests
- ✅ Uso de `test` para definir un caso de prueba
- ✅ Uso de `expect().toBe()` para verificar igualdad

---

## Ejemplo 2: Test con Múltiples Casos

### 🎯 Objetivo
Testear múltiples casos similares de forma eficiente.

### 📝 Código a Testear

```javascript
// src/utils/format.js
export function formatWind(kmh) {
  return `${Math.round(kmh)} km/h`;
}
```

### ✅ Test con test.each

```javascript
// src/utils/__tests__/format.test.js
import { formatWind } from '../format.js';

describe('formatWind', () => {
  
  // MÉTODO 1: Tests individuales (repetitivo)
  test('debe formatear 10.2 km/h', () => {
    expect(formatWind(10.2)).toBe('10 km/h');
  });
  
  test('debe formatear 25.8 km/h', () => {
    expect(formatWind(25.8)).toBe('26 km/h');
  });
  
  // MÉTODO 2: test.each (más eficiente)
  test.each([
    // [entrada, salida esperada]
    [10.2, '10 km/h'],
    [25.8, '26 km/h'],
    [0, '0 km/h'],
    [100.5, '101 km/h'],
    [5.4, '5 km/h'],
    [5.5, '6 km/h']
  ])('formatWind(%d) debe retornar "%s"', (entrada, esperado) => {
    expect(formatWind(entrada)).toBe(esperado);
  });
});
```

### 🎓 Conceptos Aprendidos
- ✅ Uso de `test.each()` para tests parametrizados
- ✅ Cómo evitar repetición de código
- ✅ Formato de tabla para casos de prueba

---

## Ejemplo 3: Test de Función Asíncrona

### 🎯 Objetivo
Testear una función que hace una llamada HTTP.

### 📝 Código a Testear

```javascript
// src/api/weather.js
export async function fetchWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Error al obtener datos del clima');
  }
  
  const data = await response.json();
  return data.current;
}
```

### ✅ Test Asíncrono

```javascript
// src/api/__tests__/weather.test.js
import { fetchWeather } from '../weather.js';

describe('fetchWeather', () => {
  
  // IMPORTANTE: El test debe ser async
  test('debe obtener datos del clima', async () => {
    // ARRANGE: Preparamos las coordenadas
    const lat = 4.6097;
    const lon = -74.0817;
    
    // ACT: Ejecutamos la función (con await)
    const weather = await fetchWeather(lat, lon);
    
    // ASSERT: Verificamos que tenga los datos esperados
    expect(weather).toBeDefined();
    expect(weather.temperature_2m).toBeDefined();
    expect(typeof weather.temperature_2m).toBe('number');
  });
  
  // Test de error
  test('debe lanzar error con coordenadas inválidas', async () => {
    // Usamos rejects.toThrow para promesas que fallan
    await expect(fetchWeather(999, 999))
      .rejects.toThrow('Error al obtener datos del clima');
  });
});
```

### 🎓 Conceptos Aprendidos
- ✅ Tests asíncronos con `async/await`
- ✅ Uso de `await` antes de `expect`
- ✅ Uso de `rejects.toThrow()` para errores asíncronos
- ✅ Verificación de tipos con `typeof`

---

## Ejemplo 4: Test con Mock de API

### 🎯 Objetivo
Testear sin hacer llamadas HTTP reales (más rápido y confiable).

### 📝 Código a Testear

```javascript
// src/api/geocoding.js
export async function geocodeCity(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Error al conectar con el servicio');
  }
  
  const data = await response.json();
  
  if (!data.results?.length) {
    throw new Error(`No se encontró la ciudad "${city}"`);
  }
  
  return data.results[0];
}
```

### ✅ Test con Mock

```javascript
// src/api/__tests__/geocoding.test.js
import { geocodeCity } from '../geocoding.js';

// Guardamos el fetch original
const originalFetch = global.fetch;

describe('geocodeCity', () => {
  
  // Restauramos fetch después de cada test
  afterEach(() => {
    global.fetch = originalFetch;
  });
  
  // CASO 1: Respuesta exitosa
  test('debe obtener coordenadas de Bogotá', async () => {
    // 🎭 MOCK: Simulamos la respuesta de la API
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [{
          name: 'Bogotá',
          country: 'Colombia',
          latitude: 4.6097,
          longitude: -74.0817
        }]
      })
    });
    
    // ACT: Llamamos a la función
    const location = await geocodeCity('Bogotá');
    
    // ASSERT: Verificamos los datos
    expect(location.name).toBe('Bogotá');
    expect(location.country).toBe('Colombia');
    expect(location.latitude).toBe(4.6097);
    expect(location.longitude).toBe(-74.0817);
    
    // Verificamos que fetch fue llamado
    expect(global.fetch).toHaveBeenCalled();
  });
  
  // CASO 2: Ciudad no encontrada
  test('debe lanzar error si la ciudad no existe', async () => {
    // 🎭 MOCK: Simulamos respuesta sin resultados
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] })
    });
    
    // ASSERT: Verificamos que lance error
    await expect(geocodeCity('CiudadInexistente'))
      .rejects.toThrow(/no se encontró/i);
  });
  
  // CASO 3: Error de red
  test('debe manejar error de red', async () => {
    // 🎭 MOCK: Simulamos error de red
    global.fetch = jest.fn().mockRejectedValue(
      new Error('Network error')
    );
    
    await expect(geocodeCity('Bogotá'))
      .rejects.toThrow('Network error');
  });
  
  // CASO 4: Error HTTP (status 500)
  test('debe manejar error del servidor', async () => {
    // 🎭 MOCK: Simulamos error 500
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500
    });
    
    await expect(geocodeCity('Bogotá'))
      .rejects.toThrow(/error al conectar/i);
  });
});
```

### 🎓 Conceptos Aprendidos
- ✅ Mocking de `fetch` con `jest.fn()`
- ✅ `mockResolvedValue()` para simular promesas exitosas
- ✅ `mockRejectedValue()` para simular errores
- ✅ `afterEach()` para limpiar mocks
- ✅ `toHaveBeenCalled()` para verificar llamadas

---

## Ejemplo 5: Test de localStorage

### 🎯 Objetivo
Testear funciones que usan localStorage.

### 📝 Código a Testear

```javascript
// src/utils/storage.js
const KEY = 'weather_recent_cities';
const MAX_ITEMS = 5;

export function getRecentCities() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
}

export function saveCity(city) {
  const cities = getRecentCities()
    .filter(c => c.toLowerCase() !== city.toLowerCase());
  cities.unshift(city);
  localStorage.setItem(KEY, JSON.stringify(cities.slice(0, MAX_ITEMS)));
}

export function clearCities() {
  localStorage.removeItem(KEY);
}
```

### ✅ Test de localStorage

```javascript
// src/utils/__tests__/storage.test.js
import { getRecentCities, saveCity, clearCities } from '../storage.js';

describe('Storage - localStorage', () => {
  
  // 🧹 Limpiamos localStorage antes de cada test
  beforeEach(() => {
    localStorage.clear();
  });
  
  // 🧹 Limpiamos después de cada test
  afterEach(() => {
    localStorage.clear();
  });
  
  // TEST 1: Estado inicial
  test('debe retornar array vacío cuando no hay datos', () => {
    const cities = getRecentCities();
    
    expect(cities).toEqual([]);
    expect(Array.isArray(cities)).toBe(true);
  });
  
  // TEST 2: Guardar ciudad
  test('debe guardar una ciudad', () => {
    // ACT: Guardamos una ciudad
    saveCity('Bogotá');
    
    // ASSERT: Verificamos que se guardó
    const cities = getRecentCities();
    expect(cities).toEqual(['Bogotá']);
  });
  
  // TEST 3: Múltiples ciudades
  test('debe guardar múltiples ciudades', () => {
    saveCity('Bogotá');
    saveCity('Medellín');
    saveCity('Cali');
    
    const cities = getRecentCities();
    
    // La última guardada debe estar primero
    expect(cities).toEqual(['Cali', 'Medellín', 'Bogotá']);
  });
  
  // TEST 4: Evitar duplicados
  test('debe evitar duplicados (case-insensitive)', () => {
    saveCity('Bogotá');
    saveCity('Medellín');
    saveCity('bogotá'); // Mismo nombre, diferente capitalización
    
    const cities = getRecentCities();
    
    expect(cities.length).toBe(2);
    expect(cities[0]).toBe('bogotá'); // La más reciente
    expect(cities[1]).toBe('Medellín');
  });
  
  // TEST 5: Límite de 5 ciudades
  test('debe limitar a máximo 5 ciudades', () => {
    // Guardamos 7 ciudades
    for (let i = 1; i <= 7; i++) {
      saveCity(`Ciudad${i}`);
    }
    
    const cities = getRecentCities();
    
    expect(cities.length).toBe(5);
    expect(cities[0]).toBe('Ciudad7'); // La más reciente
    expect(cities[4]).toBe('Ciudad3'); // La más antigua guardada
  });
  
  // TEST 6: Limpiar ciudades
  test('debe eliminar todas las ciudades', () => {
    saveCity('Bogotá');
    saveCity('Medellín');
    
    clearCities();
    
    const cities = getRecentCities();
    expect(cities).toEqual([]);
  });
  
  // TEST 7: Datos corruptos
  test('debe manejar datos corruptos en localStorage', () => {
    // Simulamos datos inválidos
    localStorage.setItem('weather_recent_cities', 'esto-no-es-json');
    
    const cities = getRecentCities();
    
    // Debe retornar array vacío en lugar de fallar
    expect(cities).toEqual([]);
  });
});
```

### 🎓 Conceptos Aprendidos
- ✅ Uso de `beforeEach()` y `afterEach()`
- ✅ Testing de localStorage (disponible en jsdom)
- ✅ Verificación de arrays con `toEqual()`
- ✅ Manejo de datos corruptos
- ✅ Tests de límites y casos extremos

---

## Ejemplo 6: Test de Manejo de Errores

### 🎯 Objetivo
Verificar que las funciones manejen errores correctamente.

### 📝 Código a Testear

```javascript
// src/utils/validacion.js
export function validarEmail(email) {
  if (!email) {
    throw new Error('El email es requerido');
  }
  
  if (typeof email !== 'string') {
    throw new Error('El email debe ser un string');
  }
  
  if (!email.includes('@')) {
    throw new Error('El email debe contener @');
  }
  
  if (!email.includes('.')) {
    throw new Error('El email debe contener un dominio válido');
  }
  
  return true;
}
```

### ✅ Test de Errores

```javascript
// src/utils/__tests__/validacion.test.js
import { validarEmail } from '../validacion.js';

describe('validarEmail', () => {
  
  // CASO EXITOSO
  test('debe aceptar email válido', () => {
    expect(validarEmail('test@example.com')).toBe(true);
  });
  
  // ERRORES: Usamos una función anónima para capturar el error
  test('debe lanzar error si el email está vacío', () => {
    expect(() => validarEmail('')).toThrow('El email es requerido');
  });
  
  test('debe lanzar error si el email es null', () => {
    expect(() => validarEmail(null)).toThrow('El email es requerido');
  });
  
  test('debe lanzar error si el email no es string', () => {
    expect(() => validarEmail(123)).toThrow('El email debe ser un string');
  });
  
  test('debe lanzar error si falta @', () => {
    expect(() => validarEmail('testexample.com'))
      .toThrow('El email debe contener @');
  });
  
  test('debe lanzar error si falta dominio', () => {
    expect(() => validarEmail('test@example'))
      .toThrow('El email debe contener un dominio válido');
  });
  
  // Test con expresión regular (más flexible)
  test('debe lanzar algún error para email inválido', () => {
    expect(() => validarEmail('invalid')).toThrow();
  });
  
  // Test con regex en el mensaje
  test('debe mencionar "email" en el mensaje de error', () => {
    expect(() => validarEmail('')).toThrow(/email/i);
  });
});
```

### 🎓 Conceptos Aprendidos
- ✅ Testing de funciones que lanzan errores
- ✅ Uso de función anónima `() => función()` con `toThrow()`
- ✅ Verificación de mensajes de error específicos
- ✅ Uso de regex para mensajes flexibles `/texto/i`

---

## 🎯 Ejercicio Final: Pon a Prueba lo Aprendido

### Desafío
Crea tests para esta función:

```javascript
// src/utils/calculadora.js
export function calcularDescuento(precio, porcentajeDescuento) {
  // TODO: Implementa esta función
  // Debe calcular el precio final después del descuento
  // Ejemplo: calcularDescuento(100, 10) = 90
}
```

### Tests que debes escribir:
1. ✅ Caso normal: 10% de descuento en $100
2. ✅ Sin descuento: 0% de descuento
3. ✅ Descuento completo: 100% de descuento
4. ✅ Error: Precio negativo
5. ✅ Error: Descuento mayor a 100%
6. ✅ Error: Parámetros faltantes

### Solución

```javascript
// src/utils/__tests__/calculadora.test.js
import { calcularDescuento } from '../calculadora.js';

describe('calcularDescuento', () => {
  
  test('debe calcular 10% de descuento en $100', () => {
    expect(calcularDescuento(100, 10)).toBe(90);
  });
  
  test('debe retornar precio original con 0% descuento', () => {
    expect(calcularDescuento(100, 0)).toBe(100);
  });
  
  test('debe retornar 0 con 100% descuento', () => {
    expect(calcularDescuento(100, 100)).toBe(0);
  });
  
  test('debe lanzar error con precio negativo', () => {
    expect(() => calcularDescuento(-100, 10))
      .toThrow('El precio no puede ser negativo');
  });
  
  test('debe lanzar error con descuento mayor a 100%', () => {
    expect(() => calcularDescuento(100, 150))
      .toThrow('El descuento no puede ser mayor a 100%');
  });
  
  test('debe lanzar error si faltan parámetros', () => {
    expect(() => calcularDescuento()).toThrow();
    expect(() => calcularDescuento(100)).toThrow();
  });
});
```

---

## 📊 Checklist de Testing

Usa esta lista para verificar que tus tests sean completos:

- [ ] ✅ **Caso normal**: Funciona con datos válidos
- [ ] ✅ **Casos extremos**: Valores límite (0, máximo, mínimo)
- [ ] ✅ **Errores**: Datos inválidos, null, undefined
- [ ] ✅ **Tipos**: Verifica tipos de datos correctos
- [ ] ✅ **Async**: Usa async/await si es necesario
- [ ] ✅ **Mocks**: Simula APIs y dependencias externas
- [ ] ✅ **Limpieza**: beforeEach/afterEach para estado limpio
- [ ] ✅ **Nombres**: Descripciones claras y específicas

---

## 🎉 ¡Felicidades!

Has completado los ejemplos prácticos de testing. Ahora estás listo para:

1. ✅ Escribir tests para tu propio código
2. ✅ Entender tests escritos por otros
3. ✅ Contribuir a proyectos con tests
4. ✅ Ser un desarrollador más profesional

**Recuerda**: Los tests son tu mejor amigo. Te salvarán de bugs y te darán confianza en tu código. 🛡️
