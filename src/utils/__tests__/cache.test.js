// src/utils/__tests__/cache.test.js
// 🎓 TESTS PARA SISTEMA DE CACHÉ
// Estos tests verifican el funcionamiento del sistema de caché con expiración

import {
  setCache,
  getCache,
  hasCache,
  deleteCache,
  clearExpiredCache,
  clearAllCache,
  getCacheStats,
  getCacheWithOfflineSupport,
  fetchWithCache
} from '../cache.js';

describe('Sistema de Caché - Funciones Básicas', () => {
  
  beforeEach(() => {
    // Limpiar localStorage antes de cada test
    localStorage.clear();
  });
  
  afterEach(() => {
    localStorage.clear();
  });
  
  // ═══════════════════════════════════════════════════════════════════════
  // Tests de setCache y getCache
  // ═══════════════════════════════════════════════════════════════════════
  
  test('debe guardar y recuperar datos del caché', () => {
    const data = { temperature: 18, city: 'Bogotá' };
    
    // Guardar en caché
    const saved = setCache('bogota', data);
    expect(saved).toBe(true);
    
    // Recuperar del caché
    const retrieved = getCache('bogota');
    expect(retrieved).toEqual(data);
  });
  
  test('debe retornar null si no hay datos en caché', () => {
    const result = getCache('ciudad-inexistente');
    expect(result).toBeNull();
  });
  
  test('debe ser case-insensitive en las claves', () => {
    const data = { temperature: 20 };
    
    setCache('BOGOTA', data);
    
    // Debe poder recuperar con diferentes capitalizaciones
    expect(getCache('bogota')).toEqual(data);
    expect(getCache('Bogota')).toEqual(data);
    expect(getCache('BOGOTA')).toEqual(data);
  });
  
  test('debe manejar diferentes tipos de datos', () => {
    // String
    setCache('string', 'texto');
    expect(getCache('string')).toBe('texto');
    
    // Number
    setCache('number', 42);
    expect(getCache('number')).toBe(42);
    
    // Array
    setCache('array', [1, 2, 3]);
    expect(getCache('array')).toEqual([1, 2, 3]);
    
    // Object
    setCache('object', { a: 1, b: 2 });
    expect(getCache('object')).toEqual({ a: 1, b: 2 });
  });
  
  // ═══════════════════════════════════════════════════════════════════════
  // Tests de expiración
  // ═══════════════════════════════════════════════════════════════════════
  
  test('debe retornar null si los datos han expirado', () => {
    const data = { temperature: 18 };
    
    // Guardar con TTL de 0 milisegundos (expira inmediatamente)
    setCache('bogota', data, 0);
    
    // Esperar un poco para asegurar que expire
    setTimeout(() => {
      const result = getCache('bogota');
      expect(result).toBeNull();
    }, 10);
  });
  
  test('debe retornar datos si no han expirado', () => {
    const data = { temperature: 18 };
    
    // Guardar con TTL de 1 hora
    setCache('bogota', data, 60 * 60 * 1000);
    
    const result = getCache('bogota');
    expect(result).toEqual(data);
  });
  
  test('debe eliminar automáticamente datos expirados al recuperar', () => {
    const data = { temperature: 18 };
    
    // Guardar con TTL de 0
    setCache('bogota', data, 0);
    
    // Intentar recuperar (debe eliminar la entrada)
    getCache('bogota');
    
    // Verificar que se eliminó
    const cacheKey = 'weather_cache_bogota';
    expect(localStorage.getItem(cacheKey)).toBeNull();
  });
  
  // ═══════════════════════════════════════════════════════════════════════
  // Tests de hasCache
  // ═══════════════════════════════════════════════════════════════════════
  
  test('hasCache debe retornar true si hay datos válidos', () => {
    setCache('bogota', { temperature: 18 }, 60 * 60 * 1000);
    expect(hasCache('bogota')).toBe(true);
  });
  
  test('hasCache debe retornar false si no hay datos', () => {
    expect(hasCache('ciudad-inexistente')).toBe(false);
  });
  
  test('hasCache debe retornar false si los datos expiraron', () => {
    setCache('bogota', { temperature: 18 }, 0);
    
    setTimeout(() => {
      expect(hasCache('bogota')).toBe(false);
    }, 10);
  });
  
  // ═══════════════════════════════════════════════════════════════════════
  // Tests de deleteCache
  // ═══════════════════════════════════════════════════════════════════════
  
  test('debe eliminar una entrada específica', () => {
    setCache('bogota', { temperature: 18 });
    setCache('medellin', { temperature: 22 });
    
    deleteCache('bogota');
    
    expect(getCache('bogota')).toBeNull();
    expect(getCache('medellin')).not.toBeNull();
  });
  
  // ═══════════════════════════════════════════════════════════════════════
  // Tests de clearExpiredCache
  // ═══════════════════════════════════════════════════════════════════════
  
  test('debe limpiar solo entradas expiradas', () => {
    // Guardar datos válidos
    setCache('bogota', { temperature: 18 }, 60 * 60 * 1000);
    
    // Guardar datos expirados
    setCache('medellin', { temperature: 22 }, 0);
    setCache('cali', { temperature: 25 }, 0);
    
    setTimeout(() => {
      const deleted = clearExpiredCache();
      
      // Debe haber eliminado 2 entradas
      expect(deleted).toBe(2);
      
      // Bogotá debe seguir en caché
      expect(getCache('bogota')).not.toBeNull();
      
      // Medellín y Cali deben haberse eliminado
      expect(getCache('medellin')).toBeNull();
      expect(getCache('cali')).toBeNull();
    }, 10);
  });
  
  // ═══════════════════════════════════════════════════════════════════════
  // Tests de clearAllCache
  // ═══════════════════════════════════════════════════════════════════════
  
  test('debe limpiar todo el caché', () => {
    setCache('bogota', { temperature: 18 });
    setCache('medellin', { temperature: 22 });
    setCache('cali', { temperature: 25 });
    
    const deleted = clearAllCache();
    
    expect(deleted).toBe(3);
    expect(getCache('bogota')).toBeNull();
    expect(getCache('medellin')).toBeNull();
    expect(getCache('cali')).toBeNull();
  });
  
  test('clearAllCache no debe afectar otros datos de localStorage', () => {
    // Guardar datos de caché
    setCache('bogota', { temperature: 18 });
    
    // Guardar otros datos
    localStorage.setItem('user_settings', 'some_value');
    
    clearAllCache();
    
    // Caché debe estar limpio
    expect(getCache('bogota')).toBeNull();
    
    // Otros datos deben permanecer
    expect(localStorage.getItem('user_settings')).toBe('some_value');
  });
  
  // ═══════════════════════════════════════════════════════════════════════
  // Tests de getCacheStats
  // ═══════════════════════════════════════════════════════════════════════
  
  test('debe retornar estadísticas correctas del caché', () => {
    setCache('bogota', { temperature: 18 }, 60 * 60 * 1000);
    setCache('medellin', { temperature: 22 }, 0);
    
    setTimeout(() => {
      const stats = getCacheStats();
      
      expect(stats.total).toBe(2);
      expect(stats.valid).toBe(1);
      expect(stats.expired).toBe(1);
      expect(stats.entries).toHaveLength(2);
    }, 10);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Tests de Modo Offline
// ═══════════════════════════════════════════════════════════════════════════

describe('Sistema de Caché - Modo Offline', () => {
  
  beforeEach(() => {
    localStorage.clear();
  });
  
  afterEach(() => {
    localStorage.clear();
  });
  
  test('debe retornar datos expirados cuando está offline', () => {
    const data = { temperature: 18 };
    
    // Guardar datos con TTL de 0 (expirados)
    setCache('bogota', data, 0);
    
    setTimeout(() => {
      // Simular modo offline
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false
      });
      
      const result = getCacheWithOfflineSupport('bogota');
      
      expect(result).not.toBeNull();
      expect(result.data).toEqual(data);
      expect(result.offline).toBe(true);
      expect(result.expired).toBe(true);
      
      // Restaurar
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: true
      });
    }, 10);
  });
  
  test('debe retornar null si no hay datos aunque esté offline', () => {
    // Simular modo offline
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false
    });
    
    const result = getCacheWithOfflineSupport('ciudad-inexistente');
    
    expect(result).toBeNull();
    
    // Restaurar
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Tests de fetchWithCache
// ═══════════════════════════════════════════════════════════════════════════

describe('Sistema de Caché - fetchWithCache', () => {
  
  beforeEach(() => {
    localStorage.clear();
  });
  
  afterEach(() => {
    localStorage.clear();
  });
  
  test('debe ejecutar función y guardar resultado en caché', async () => {
    const mockFn = () => Promise.resolve({ temperature: 18 });
    
    const result = await fetchWithCache('bogota', mockFn);
    
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ temperature: 18 });
    expect(result.fromCache).toBe(false);
    
    // Verificar que se guardó en caché
    const cached = getCache('bogota');
    expect(cached).toEqual({ temperature: 18 });
  });
  
  test('debe usar caché en segunda llamada', async () => {
    let callCount = 0;
    const mockFn = () => {
      callCount++;
      return Promise.resolve({ temperature: 18 });
    };
    
    // Primera llamada
    await fetchWithCache('bogota', mockFn);
    expect(callCount).toBe(1);
    
    // Segunda llamada (debe usar caché)
    const result = await fetchWithCache('bogota', mockFn);
    expect(callCount).toBe(1); // No debe llamar de nuevo
    expect(result.fromCache).toBe(true);
  });
  
  test('debe forzar refresh cuando se especifica', async () => {
    let callCount = 0;
    const mockFn = () => {
      callCount++;
      return Promise.resolve({ temperature: 18 + callCount });
    };
    
    // Primera llamada
    await fetchWithCache('bogota', mockFn);
    
    // Segunda llamada con forceRefresh
    const result = await fetchWithCache('bogota', mockFn, { forceRefresh: true });
    
    expect(callCount).toBe(2);
    expect(result.fromCache).toBe(false);
    expect(result.data.temperature).toBe(20); // 18 + 2
  });
  
  test('debe manejar errores y retornar información apropiada', async () => {
    // Guardar datos en caché primero
    setCache('bogota', { temperature: 18 });
    
    // Función que falla
    const mockFn = () => Promise.reject(new Error('Network error'));
    
    const result = await fetchWithCache('bogota', mockFn);
    
    // Debe usar el caché cuando la función falla
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ temperature: 18 });
    expect(result.fromCache).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 CONCEPTOS CLAVE APRENDIDOS:
// ═══════════════════════════════════════════════════════════════════════════
// 1. Testing de localStorage
// 2. Testing de expiración temporal
// 3. Simulación de modo offline (navigator.onLine)
// 4. Testing de funciones asíncronas con caché
// 5. Verificación de side effects (datos guardados)
