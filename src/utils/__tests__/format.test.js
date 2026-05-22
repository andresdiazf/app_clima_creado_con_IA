// src/utils/__tests__/format.test.js
// 🎓 TESTS PARA FUNCIONES DE FORMATO
// Estos tests verifican que las funciones de formato trabajen correctamente

import {
  formatTemp,
  formatWind,
  formatPrecipitation,
  formatCoords,
  describeWeatherCode
} from '../format.js';

// ═══════════════════════════════════════════════════════════════════════════
// 📚 LECCIÓN 1: ¿Qué es un test?
// ═══════════════════════════════════════════════════════════════════════════
// Un test verifica que tu código funcione como esperas.
// Estructura básica:
//   1. ARRANGE (Preparar): Defines los datos de entrada
//   2. ACT (Actuar): Ejecutas la función
//   3. ASSERT (Afirmar): Verificas que el resultado sea el esperado

describe('formatTemp - Formatear temperatura', () => {
  
  // ✅ TEST BÁSICO: Caso normal
  test('debe formatear temperatura en Celsius correctamente', () => {
    // ARRANGE: Preparamos los datos
    const temperatura = 25.7;
    
    // ACT: Ejecutamos la función
    const resultado = formatTemp(temperatura);
    
    // ASSERT: Verificamos el resultado
    expect(resultado).toBe('26 °C');
    // 👆 "expect" significa "espero que"
    // "toBe" significa "sea igual a"
  });

  // ✅ TEST: Números negativos
  test('debe manejar temperaturas negativas', () => {
    const resultado = formatTemp(-5.3);
    expect(resultado).toBe('-5 °C');
  });

  // ✅ TEST: Redondeo
  test('debe redondear correctamente', () => {
    expect(formatTemp(20.4)).toBe('20 °C'); // Redondea hacia abajo
    expect(formatTemp(20.5)).toBe('21 °C'); // Redondea hacia arriba
  });

  // ✅ TEST: Fahrenheit
  test('debe formatear en Fahrenheit cuando se especifica', () => {
    const resultado = formatTemp(77, 'F');
    expect(resultado).toBe('77 °F');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 📚 LECCIÓN 2: Múltiples casos con test.each
// ═══════════════════════════════════════════════════════════════════════════
// Cuando quieres probar varios casos similares, usa test.each

describe('formatWind - Formatear velocidad del viento', () => {
  
  // 🔄 Probamos múltiples casos a la vez
  test.each([
    [10.2, '10 km/h'],    // [entrada, salida esperada]
    [25.8, '26 km/h'],
    [0, '0 km/h'],
    [100.5, '101 km/h']
  ])('formatWind(%d) debe retornar "%s"', (entrada, esperado) => {
    expect(formatWind(entrada)).toBe(esperado);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 📚 LECCIÓN 3: Tests de precisión numérica
// ═══════════════════════════════════════════════════════════════════════════

describe('formatCoords - Formatear coordenadas', () => {
  
  test('debe formatear coordenadas positivas (Norte y Este)', () => {
    const resultado = formatCoords(4.6097, -74.0817);
    // Bogotá está en el hemisferio Norte (N) y Oeste (O)
    expect(resultado).toBe('4.610° N, 74.082° O');
  });

  test('debe formatear coordenadas negativas (Sur y Oeste)', () => {
    const resultado = formatCoords(-34.6037, -58.3816);
    // Buenos Aires está en el Sur (S) y Oeste (O)
    expect(resultado).toBe('34.604° S, 58.382° O');
  });

  test('debe usar 3 decimales de precisión', () => {
    const resultado = formatCoords(1.123456, 2.987654);
    expect(resultado).toContain('1.123°');
    expect(resultado).toContain('2.988°');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 📚 LECCIÓN 4: Tests con objetos/mapeos
// ═══════════════════════════════════════════════════════════════════════════

describe('describeWeatherCode - Describir código del clima', () => {
  
  test('debe retornar descripción para código conocido', () => {
    expect(describeWeatherCode(0)).toBe('Despejado');
    expect(describeWeatherCode(61)).toBe('Lluvia ligera');
    expect(describeWeatherCode(95)).toBe('Tormenta eléctrica');
  });

  test('debe manejar código desconocido', () => {
    const resultado = describeWeatherCode(999);
    expect(resultado).toContain('Condición desconocida');
    expect(resultado).toContain('999');
  });

  // ✅ TEST: Verificar varios códigos importantes
  test.each([
    [0, 'Despejado'],
    [3, 'Nublado'],
    [45, 'Niebla'],
    [63, 'Lluvia moderada'],
    [75, 'Nieve intensa']
  ])('código %d debe retornar "%s"', (codigo, descripcion) => {
    expect(describeWeatherCode(codigo)).toBe(descripcion);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 📚 LECCIÓN 5: Tests de precipitación
// ═══════════════════════════════════════════════════════════════════════════

describe('formatPrecipitation - Formatear precipitación', () => {
  
  test('debe formatear precipitación con unidad mm', () => {
    expect(formatPrecipitation(0)).toBe('0 mm');
    expect(formatPrecipitation(5.2)).toBe('5.2 mm');
    expect(formatPrecipitation(100)).toBe('100 mm');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 RESUMEN DE MATCHERS (comparadores) MÁS COMUNES:
// ═══════════════════════════════════════════════════════════════════════════
// expect(valor).toBe(esperado)           → Igualdad estricta (===)
// expect(valor).toEqual(esperado)        → Igualdad profunda (objetos/arrays)
// expect(valor).toContain(texto)         → Contiene un substring
// expect(valor).toBeGreaterThan(num)     → Mayor que
// expect(valor).toBeLessThan(num)        → Menor que
// expect(valor).toBeTruthy()             → Es verdadero
// expect(valor).toBeFalsy()              → Es falso
// expect(valor).toBeNull()               → Es null
// expect(valor).toBeUndefined()          → Es undefined
// expect(fn).toThrow()                   → La función lanza error
