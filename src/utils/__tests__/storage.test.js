// src/utils/__tests__/storage.test.js
// 🎓 TESTS PARA FUNCIONES DE ALMACENAMIENTO
// Estos tests verifican que localStorage funcione correctamente

import {
  getRecentCities,
  saveCity,
  deleteCity,
  clearCities
} from '../storage.js';

// ═══════════════════════════════════════════════════════════════════════════
// 📚 LECCIÓN 6: Mocks y Setup/Teardown
// ═══════════════════════════════════════════════════════════════════════════
// Cuando testeas código que usa localStorage, necesitas:
//   1. Limpiar el estado antes de cada test (beforeEach)
//   2. Simular localStorage si no existe (mock)

describe('Storage - Almacenamiento de ciudades', () => {
  
  // 🧹 LIMPIEZA: Se ejecuta ANTES de cada test
  beforeEach(() => {
    // Limpiamos localStorage para empezar con estado limpio
    localStorage.clear();
  });

  // 🧹 LIMPIEZA: Se ejecuta DESPUÉS de cada test
  afterEach(() => {
    localStorage.clear();
  });

  // ═══════════════════════════════════════════════════════════════════════
  // Tests de getRecentCities
  // ═══════════════════════════════════════════════════════════════════════

  test('debe retornar array vacío cuando no hay ciudades guardadas', () => {
    const ciudades = getRecentCities();
    
    expect(ciudades).toEqual([]);
    // 👆 toEqual() compara arrays/objetos por contenido
    expect(Array.isArray(ciudades)).toBe(true);
  });

  test('debe retornar ciudades guardadas', () => {
    // ARRANGE: Guardamos datos manualmente en localStorage
    localStorage.setItem('weather_recent_cities', JSON.stringify(['Bogotá', 'Medellín']));
    
    // ACT: Obtenemos las ciudades
    const ciudades = getRecentCities();
    
    // ASSERT: Verificamos
    expect(ciudades).toEqual(['Bogotá', 'Medellín']);
    expect(ciudades.length).toBe(2);
  });

  test('debe manejar datos corruptos en localStorage', () => {
    // Simulamos datos inválidos
    localStorage.setItem('weather_recent_cities', 'esto-no-es-json-válido');
    
    const ciudades = getRecentCities();
    
    // Debe retornar array vacío en lugar de fallar
    expect(ciudades).toEqual([]);
  });

  // ═══════════════════════════════════════════════════════════════════════
  // Tests de saveCity
  // ═══════════════════════════════════════════════════════════════════════

  test('debe guardar una ciudad nueva', () => {
    // ACT: Guardamos una ciudad
    saveCity('Bogotá');
    
    // ASSERT: Verificamos que se guardó
    const ciudades = getRecentCities();
    expect(ciudades).toEqual(['Bogotá']);
  });

  test('debe agregar ciudades al inicio de la lista', () => {
    saveCity('Bogotá');
    saveCity('Medellín');
    saveCity('Cali');
    
    const ciudades = getRecentCities();
    
    // La última guardada debe estar primero
    expect(ciudades[0]).toBe('Cali');
    expect(ciudades[1]).toBe('Medellín');
    expect(ciudades[2]).toBe('Bogotá');
  });

  test('debe evitar duplicados (case-insensitive)', () => {
    saveCity('Bogotá');
    saveCity('Medellín');
    saveCity('bogotá'); // Mismo nombre, diferente capitalización
    
    const ciudades = getRecentCities();
    
    // Solo debe haber 2 ciudades, y Bogotá debe estar al inicio
    expect(ciudades.length).toBe(2);
    expect(ciudades[0]).toBe('bogotá');
    expect(ciudades[1]).toBe('Medellín');
  });

  test('debe limitar a máximo 5 ciudades', () => {
    // Guardamos 7 ciudades
    saveCity('Ciudad1');
    saveCity('Ciudad2');
    saveCity('Ciudad3');
    saveCity('Ciudad4');
    saveCity('Ciudad5');
    saveCity('Ciudad6');
    saveCity('Ciudad7');
    
    const ciudades = getRecentCities();
    
    // Solo debe haber 5
    expect(ciudades.length).toBe(5);
    // Las más recientes deben estar primero
    expect(ciudades[0]).toBe('Ciudad7');
    expect(ciudades[4]).toBe('Ciudad3');
  });

  // ═══════════════════════════════════════════════════════════════════════
  // Tests de deleteCity
  // ═══════════════════════════════════════════════════════════════════════

  test('debe eliminar una ciudad específica', () => {
    // ARRANGE: Guardamos varias ciudades
    saveCity('Bogotá');
    saveCity('Medellín');
    saveCity('Cali');
    
    // ACT: Eliminamos una
    deleteCity('Medellín');
    
    // ASSERT: Verificamos que se eliminó
    const ciudades = getRecentCities();
    expect(ciudades).toEqual(['Cali', 'Bogotá']);
    expect(ciudades).not.toContain('Medellín');
  });

  test('debe ser case-insensitive al eliminar', () => {
    saveCity('Bogotá');
    deleteCity('bogotá'); // Minúsculas
    
    const ciudades = getRecentCities();
    expect(ciudades).toEqual([]);
  });

  test('no debe fallar si la ciudad no existe', () => {
    saveCity('Bogotá');
    
    // Intentamos eliminar una ciudad que no existe
    expect(() => deleteCity('CiudadInexistente')).not.toThrow();
    
    // Bogotá debe seguir ahí
    const ciudades = getRecentCities();
    expect(ciudades).toEqual(['Bogotá']);
  });

  // ═══════════════════════════════════════════════════════════════════════
  // Tests de clearCities
  // ═══════════════════════════════════════════════════════════════════════

  test('debe eliminar todas las ciudades', () => {
    // ARRANGE: Guardamos varias ciudades
    saveCity('Bogotá');
    saveCity('Medellín');
    saveCity('Cali');
    
    // ACT: Limpiamos todo
    clearCities();
    
    // ASSERT: No debe haber ciudades
    const ciudades = getRecentCities();
    expect(ciudades).toEqual([]);
  });

  test('no debe fallar si no hay ciudades guardadas', () => {
    expect(() => clearCities()).not.toThrow();
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 CONCEPTOS CLAVE APRENDIDOS:
// ═══════════════════════════════════════════════════════════════════════════
// 1. beforeEach/afterEach: Limpian el estado entre tests
// 2. localStorage: Se puede usar directamente en tests con jsdom
// 3. toContain(): Verifica si un array contiene un elemento
// 4. not.toContain(): Verifica que NO contenga un elemento
// 5. toThrow(): Verifica que una función lance un error
// 6. not.toThrow(): Verifica que NO lance error
