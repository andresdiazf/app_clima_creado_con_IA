/**
 * Tests para la funcionalidad de pronóstico de 7 días
 * 
 * Estos tests verifican que:
 * 1. La función fetchWeatherForecast obtiene datos correctamente
 * 2. Los datos se transforman al formato esperado
 * 3. Se manejan errores de red y API
 */

import { fetchWeatherForecast } from '../weather.js';

// Mock de fetch global
const originalFetch = global.fetch;

describe('Pronóstico de 7 días - fetchWeatherForecast', () => {
  
  afterEach(() => {
    // Restaurar fetch original después de cada test
    global.fetch = originalFetch;
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 1: Obtener pronóstico exitosamente
  // ═══════════════════════════════════════════════════════════════════════════
  test('debe obtener pronóstico de 7 días correctamente', async () => {
    // ARRANGE: Preparar datos de respuesta simulada
    const mockResponse = {
      daily: {
        time: ['2024-01-01', '2024-01-02', '2024-01-03'],
        weathercode: [0, 1, 61],
        temperature_2m_max: [25, 26, 22],
        temperature_2m_min: [15, 16, 14],
        precipitation_probability_max: [10, 20, 80],
        windspeed_10m_max: [12, 15, 20],
      }
    };

    // Mock de fetch que retorna datos exitosos
    global.fetch = async () => ({
      ok: true,
      json: async () => mockResponse
    });

    // ACT: Ejecutar la función
    const result = await fetchWeatherForecast(4.6, -74.1, 3);

    // ASSERT: Verificar resultados
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      date: '2024-01-01',
      weathercode: 0,
      tempMax: 25,
      tempMin: 15,
      precipitationProbability: 10,
      windSpeed: 12,
    });
    expect(result[1].tempMax).toBe(26);
    expect(result[2].precipitationProbability).toBe(80);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 2: Verificar parámetros de la llamada a la API
  // ═══════════════════════════════════════════════════════════════════════════
  test('debe llamar a la API con los parámetros correctos', async () => {
    // ARRANGE: Mock de respuesta y capturar URL
    let capturedUrl = '';
    global.fetch = async (url) => {
      capturedUrl = url;
      return {
        ok: true,
        json: async () => ({
          daily: {
            time: ['2024-01-01'],
            weathercode: [0],
            temperature_2m_max: [25],
            temperature_2m_min: [15],
            precipitation_probability_max: [10],
            windspeed_10m_max: [12],
          }
        })
      };
    };

    // ACT: Ejecutar con coordenadas específicas
    await fetchWeatherForecast(4.6097, -74.0817, 7);

    // ASSERT: Verificar que la URL contiene los parámetros esperados
    expect(capturedUrl).toContain('latitude=4.6097');
    expect(capturedUrl).toContain('longitude=-74.0817');
    expect(capturedUrl).toContain('forecast_days=7');
    expect(capturedUrl).toContain('daily=');
    expect(capturedUrl).toContain('temperature_2m_max');
    expect(capturedUrl).toContain('temperature_2m_min');
    expect(capturedUrl).toContain('precipitation_probability_max');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 3: Usar valor por defecto de 7 días
  // ═══════════════════════════════════════════════════════════════════════════
  test('debe usar 7 días por defecto si no se especifica', async () => {
    // ARRANGE: Capturar URL
    let capturedUrl = '';
    global.fetch = async (url) => {
      capturedUrl = url;
      return {
        ok: true,
        json: async () => ({
          daily: {
            time: ['2024-01-01'],
            weathercode: [0],
            temperature_2m_max: [25],
            temperature_2m_min: [15],
            precipitation_probability_max: [10],
            windspeed_10m_max: [12],
          }
        })
      };
    };

    // ACT: Llamar sin especificar días
    await fetchWeatherForecast(4.6, -74.1);

    // ASSERT: Verificar que usa 7 días por defecto
    expect(capturedUrl).toContain('forecast_days=7');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 4: Manejar error de red
  // ═══════════════════════════════════════════════════════════════════════════
  test('debe lanzar error cuando falla la conexión', async () => {
    // ARRANGE: Simular error de red
    global.fetch = async () => {
      throw new Error('Network error');
    };

    // ACT & ASSERT: Verificar que lanza error
    await expect(fetchWeatherForecast(4.6, -74.1))
      .rejects
      .toThrow('Network error');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 5: Manejar respuesta no exitosa de la API
  // ═══════════════════════════════════════════════════════════════════════════
  test('debe lanzar error cuando la API retorna error', async () => {
    // ARRANGE: Simular respuesta con error (status 500)
    global.fetch = async () => ({
      ok: false,
      status: 500,
    });

    // ACT & ASSERT: Verificar que lanza error apropiado
    await expect(fetchWeatherForecast(4.6, -74.1))
      .rejects
      .toThrow('Error al obtener el pronóstico del clima');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 6: Transformar datos correctamente
  // ═══════════════════════════════════════════════════════════════════════════
  test('debe transformar arrays de la API a objetos por día', async () => {
    // ARRANGE: Datos en formato de API (arrays paralelos)
    const mockResponse = {
      daily: {
        time: ['2024-01-01', '2024-01-02'],
        weathercode: [0, 61],
        temperature_2m_max: [28, 24],
        temperature_2m_min: [18, 16],
        precipitation_probability_max: [5, 75],
        windspeed_10m_max: [10, 18],
      }
    };

    global.fetch = async () => ({
      ok: true,
      json: async () => mockResponse
    });

    // ACT: Obtener pronóstico
    const result = await fetchWeatherForecast(4.6, -74.1, 2);

    // ASSERT: Verificar transformación correcta
    expect(result).toHaveLength(2);
    
    // Primer día
    expect(result[0]).toMatchObject({
      date: '2024-01-01',
      weathercode: 0,
      tempMax: 28,
      tempMin: 18,
      precipitationProbability: 5,
      windSpeed: 10,
    });

    // Segundo día
    expect(result[1]).toMatchObject({
      date: '2024-01-02',
      weathercode: 61,
      tempMax: 24,
      tempMin: 16,
      precipitationProbability: 75,
      windSpeed: 18,
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 7: Manejar diferentes números de días
  // ═══════════════════════════════════════════════════════════════════════════
  test('debe funcionar con diferentes cantidades de días', async () => {
    // ARRANGE: Respuesta con 3 días
    const mockResponse = {
      daily: {
        time: ['2024-01-01', '2024-01-02', '2024-01-03'],
        weathercode: [0, 1, 2],
        temperature_2m_max: [25, 26, 27],
        temperature_2m_min: [15, 16, 17],
        precipitation_probability_max: [10, 20, 30],
        windspeed_10m_max: [12, 13, 14],
      }
    };

    global.fetch = async () => ({
      ok: true,
      json: async () => mockResponse
    });

    // ACT: Solicitar 3 días
    const result = await fetchWeatherForecast(4.6, -74.1, 3);

    // ASSERT: Verificar que retorna 3 días
    expect(result).toHaveLength(3);
    expect(result[0].date).toBe('2024-01-01');
    expect(result[1].date).toBe('2024-01-02');
    expect(result[2].date).toBe('2024-01-03');
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 8: Verificar estructura de datos retornados
  // ═══════════════════════════════════════════════════════════════════════════
  test('cada día debe tener todas las propiedades requeridas', async () => {
    // ARRANGE
    const mockResponse = {
      daily: {
        time: ['2024-01-01'],
        weathercode: [0],
        temperature_2m_max: [25],
        temperature_2m_min: [15],
        precipitation_probability_max: [10],
        windspeed_10m_max: [12],
      }
    };

    global.fetch = async () => ({
      ok: true,
      json: async () => mockResponse
    });

    // ACT
    const result = await fetchWeatherForecast(4.6, -74.1, 1);

    // ASSERT: Verificar que tiene todas las propiedades
    const day = result[0];
    expect(day).toHaveProperty('date');
    expect(day).toHaveProperty('weathercode');
    expect(day).toHaveProperty('tempMax');
    expect(day).toHaveProperty('tempMin');
    expect(day).toHaveProperty('precipitationProbability');
    expect(day).toHaveProperty('windSpeed');
    
    // Verificar tipos de datos
    expect(typeof day.date).toBe('string');
    expect(typeof day.weathercode).toBe('number');
    expect(typeof day.tempMax).toBe('number');
    expect(typeof day.tempMin).toBe('number');
    expect(typeof day.precipitationProbability).toBe('number');
    expect(typeof day.windSpeed).toBe('number');
  });

});
