import { getCityWeatherInfo } from '../weather.js';
import { geocodeCity } from '../geocoding.js';

// Mock fetch for network and API error simulation
const originalFetch = global.fetch;

describe('API Weather/Geocoding Error Handling', () => {
  afterEach(() => {
    global.fetch = originalFetch;
  });

  test('Debe lanzar error si falta el parámetro de ciudad', async () => {
    await expect(getCityWeatherInfo()).rejects.toThrow();
    await expect(getCityWeatherInfo(null)).rejects.toThrow();
    await expect(getCityWeatherInfo("")).rejects.toThrow();
  });

  test('Debe lanzar error para nombre de ciudad no válido', async () => {
    // Mock geocoding API to return no results
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] })
    });
    await expect(geocodeCity('CiudadInexistente123')).rejects.toThrow(/no se encontró/i);
  });

  test('Debe manejar fallo de red en geocoding', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    await expect(geocodeCity('Bogotá')).rejects.toThrow(/network error/i);
  });

  test('Debe manejar fallo de red en weather', async () => {
    // Mock geocoding to succeed, weather to fail
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [{ name: 'Bogotá', country: 'CO', latitude: 4.6, longitude: -74.1 }] })
      })
      .mockRejectedValueOnce(new Error('Network error'));
    await expect(getCityWeatherInfo('Bogotá')).rejects.toThrow(/network error/i);
  });
});
