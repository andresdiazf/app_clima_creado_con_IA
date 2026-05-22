// src/api/__tests__/api-errors.test.js
// 🎓 TESTS PARA MANEJO DE ERRORES EN APIs
// Estos tests verifican que la aplicación maneje errores correctamente

import { getCityWeatherInfo, fetchWeather } from '../weather.js';
import { geocodeCity } from '../geocoding.js';

// ═══════════════════════════════════════════════════════════════════════════
// 📚 LECCIÓN 7: Mocking de APIs (Simulación)
// ═══════════════════════════════════════════════════════════════════════════
// Cuando testeas código que hace llamadas HTTP:
//   1. NO quieres hacer llamadas reales (son lentas y pueden fallar)
//   2. Usas "mocks" para simular las respuestas
//   3. Guardas el fetch original para restaurarlo después

const originalFetch = global.fetch;

// Función helper para crear mocks
function createMockFetch(response) {
  return () => Promise.resolve(response);
}

describe('API Weather/Geocoding - Manejo de Errores', () => {
  
  // 🧹 Restauramos fetch después de cada test
  afterEach(() => {
    global.fetch = originalFetch;
  });

  // ═══════════════════════════════════════════════════════════════════════
  // 📚 LECCIÓN 8: Tests Asíncronos (async/await)
  // ═══════════════════════════════════════════════════════════════════════
  // Cuando una función es async, el test también debe ser async
  // Usamos "await" para esperar el resultado

  test('debe retornar error si falta el parámetro de ciudad', async () => {
    // ❌ Casos inválidos: sin ciudad, null, string vacío
    
    // getCityWeatherInfo retorna un objeto con error en lugar de lanzar
    const result1 = await getCityWeatherInfo();
    expect(result1.error).toBeDefined();
    
    const result2 = await getCityWeatherInfo(null);
    expect(result2.error).toBeDefined();
    
    const result3 = await getCityWeatherInfo("");
    expect(result3.error).toBeDefined();
  });

  test('debe retornar error para nombre de ciudad no válido', async () => {
    // 🎭 MOCK: Simulamos que la API no encuentra la ciudad
    global.fetch = createMockFetch({
      ok: true,
      json: async () => ({ results: [] }) // Sin resultados
    });
    
    // Verificamos que lance error con mensaje específico
    await expect(geocodeCity('CiudadInexistente123'))
      .rejects.toThrow(/no se encontró/i);
    // 👆 /no se encontró/i es una expresión regular (case-insensitive)
  });

  test('debe manejar fallo de red en geocoding', async () => {
    // 🎭 MOCK: Simulamos un error de red
    global.fetch = () => Promise.reject(new Error('Network error'));
    
    await expect(geocodeCity('Bogotá'))
      .rejects.toThrow(/network error/i);
  });

  test('debe manejar fallo de red en weather', async () => {
    // 🎭 MOCK MÚLTIPLE: Primera llamada exitosa, segunda falla
    let callCount = 0;
    global.fetch = () => {
      callCount++;
      if (callCount === 1) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ 
            results: [{ 
              name: 'Bogotá', 
              country: 'CO', 
              latitude: 4.6, 
              longitude: -74.1 
            }] 
          })
        });
      } else {
        return Promise.reject(new Error('Network error'));
      }
    };
    
    // getCityWeatherInfo hace 2 llamadas: geocoding + weather
    const result = await getCityWeatherInfo('Bogotá');
    expect(result.error).toBeDefined();
  });

  // ═══════════════════════════════════════════════════════════════════════
  // Tests adicionales para casos extremos
  // ═══════════════════════════════════════════════════════════════════════

  test('debe manejar respuesta HTTP no exitosa (status 500)', async () => {
    // 🎭 MOCK: Simulamos error del servidor
    global.fetch = createMockFetch({
      ok: false,
      status: 500
    });
    
    await expect(geocodeCity('Bogotá'))
      .rejects.toThrow(/error al conectar/i);
  });

  test('debe manejar datos meteorológicos inválidos', async () => {
    // 🎭 MOCK: Geocoding exitoso, pero weather retorna datos inválidos
    let callCount = 0;
    global.fetch = () => {
      callCount++;
      if (callCount === 1) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ 
            results: [{ 
              name: 'Bogotá', 
              country: 'CO', 
              latitude: 4.6, 
              longitude: -74.1 
            }] 
          })
        });
      } else {
        return Promise.resolve({
          ok: true,
          json: async () => ({ 
            current: {} // Datos vacíos/inválidos
          })
        });
      }
    };
    
    const result = await getCityWeatherInfo('Bogotá');
    expect(result.error).toBeDefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Tests de casos exitosos (Happy Path)
// ═══════════════════════════════════════════════════════════════════════════

describe('API Weather/Geocoding - Casos Exitosos', () => {
  
  afterEach(() => {
    global.fetch = originalFetch;
  });

  test('debe obtener información del clima correctamente', async () => {
    // 🎭 MOCK: Simulamos respuestas exitosas
    let callCount = 0;
    global.fetch = () => {
      callCount++;
      if (callCount === 1) {
        // Primera llamada: geocoding
        return Promise.resolve({
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
      } else {
        // Segunda llamada: weather
        return Promise.resolve({
          ok: true,
          json: async () => ({ 
            current: {
              temperature_2m: 18.5,
              apparent_temperature: 17.2,
              relative_humidity_2m: 75,
              precipitation: 0,
              windspeed_10m: 12,
              weathercode: 2
            }
          })
        });
      }
    };
    
    const result = await getCityWeatherInfo('Bogotá');
    
    // ✅ Verificamos que tenga los datos esperados
    expect(result.city).toBe('Bogotá');
    expect(result.temperature).toBe(18.5);
    expect(result.description).toBe('Parcialmente nublado');
    expect(result.error).toBeUndefined();
  });

  test('fetchWeather debe retornar datos del clima', async () => {
    // 🎭 MOCK: Respuesta exitosa de la API
    global.fetch = createMockFetch({
      ok: true,
      json: async () => ({ 
        current: {
          temperature_2m: 25,
          weathercode: 0
        }
      })
    });
    
    const weather = await fetchWeather(4.6, -74.1);
    
    expect(weather.temperature_2m).toBe(25);
    expect(weather.weathercode).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 CONCEPTOS CLAVE APRENDIDOS:
// ═══════════════════════════════════════════════════════════════════════════
// 1. Mocking manual de fetch (sin jest.fn())
// 2. Funciones helper para crear mocks
// 3. Manejo de múltiples llamadas con contador
// 4. rejects.toThrow(): Verifica que una promesa sea rechazada
// 5. async/await: Maneja código asíncrono en tests
// 6. /regex/i: Expresiones regulares para verificar mensajes (i = case-insensitive)
