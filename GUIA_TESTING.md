# 🎓 Guía de Aprendizaje: Testing con Jest

## 📖 Índice
1. [¿Qué es Testing?](#qué-es-testing)
2. [¿Por qué hacer tests?](#por-qué-hacer-tests)
3. [Conceptos Básicos](#conceptos-básicos)
4. [Tu Primer Test](#tu-primer-test)
5. [Matchers (Comparadores)](#matchers-comparadores)
6. [Tests Asíncronos](#tests-asíncronos)
7. [Mocking](#mocking)
8. [Mejores Prácticas](#mejores-prácticas)
9. [Ejercicios Prácticos](#ejercicios-prácticos)

---

## 🤔 ¿Qué es Testing?

**Testing** (o pruebas) es el proceso de verificar que tu código funciona como esperas.

### Analogía del Mundo Real
Imagina que eres un chef 👨‍🍳:
- **Sin tests**: Cocinas un plato y lo sirves sin probarlo. ¿Está salado? ¿Está crudo? No lo sabes.
- **Con tests**: Pruebas cada ingrediente y el plato final antes de servirlo. Sabes que está perfecto.

### En Programación
```javascript
// Función que queremos testear
function sumar(a, b) {
  return a + b;
}

// Test que verifica que funciona
test('sumar 2 + 3 debe dar 5', () => {
  expect(sumar(2, 3)).toBe(5);
});
```

---

## 💡 ¿Por qué hacer tests?

### Beneficios

1. **🛡️ Confianza**: Sabes que tu código funciona
2. **🐛 Detectar bugs**: Encuentras errores antes que los usuarios
3. **📝 Documentación**: Los tests explican cómo usar tu código
4. **🔄 Refactorización segura**: Puedes cambiar código sin miedo a romper algo
5. **💼 Profesionalismo**: Las empresas valoran código testeado

### Ejemplo Real

```javascript
// ❌ Sin tests: Cambias algo y rompes la app
function calcularDescuento(precio, descuento) {
  return precio - descuento; // Bug: debería ser precio * (1 - descuento/100)
}

// ✅ Con tests: El test falla y detectas el bug inmediatamente
test('calcular 10% de descuento en $100', () => {
  expect(calcularDescuento(100, 10)).toBe(90);
  // ❌ FALLA: Esperaba 90, recibió 90 (¡ups, el bug!)
});
```

---

## 📚 Conceptos Básicos

### 1. Test Suite (describe)
Agrupa tests relacionados

```javascript
describe('Calculadora', () => {
  // Aquí van todos los tests de la calculadora
});
```

### 2. Test Case (test o it)
Un test individual

```javascript
test('debe sumar dos números', () => {
  // Código del test
});

// "it" es un alias de "test" (más legible en inglés)
it('should add two numbers', () => {
  // Código del test
});
```

### 3. Assertions (expect)
Verifican que algo sea verdadero

```javascript
expect(resultado).toBe(valorEsperado);
```

### 4. Patrón AAA (Arrange-Act-Assert)

```javascript
test('ejemplo del patrón AAA', () => {
  // ARRANGE (Preparar): Configura los datos
  const numero1 = 5;
  const numero2 = 3;
  
  // ACT (Actuar): Ejecuta la función
  const resultado = sumar(numero1, numero2);
  
  // ASSERT (Afirmar): Verifica el resultado
  expect(resultado).toBe(8);
});
```

---

## 🚀 Tu Primer Test

### Paso 1: Crear una función simple

```javascript
// src/utils/matematicas.js
export function multiplicar(a, b) {
  return a * b;
}
```

### Paso 2: Crear el archivo de test

```javascript
// src/utils/__tests__/matematicas.test.js
import { multiplicar } from '../matematicas.js';

describe('Función multiplicar', () => {
  
  test('debe multiplicar 3 x 4 y dar 12', () => {
    // ARRANGE
    const num1 = 3;
    const num2 = 4;
    
    // ACT
    const resultado = multiplicar(num1, num2);
    
    // ASSERT
    expect(resultado).toBe(12);
  });
  
  test('debe manejar números negativos', () => {
    expect(multiplicar(-2, 5)).toBe(-10);
  });
  
  test('debe manejar cero', () => {
    expect(multiplicar(5, 0)).toBe(0);
  });
});
```

### Paso 3: Ejecutar el test

```bash
npm test
```

### Resultado Esperado

```
PASS  src/utils/__tests__/matematicas.test.js
  Función multiplicar
    ✓ debe multiplicar 3 x 4 y dar 12 (2ms)
    ✓ debe manejar números negativos (1ms)
    ✓ debe manejar cero (1ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
```

---

## 🎯 Matchers (Comparadores)

Los matchers son métodos que verifican valores.

### Igualdad

```javascript
// toBe: Igualdad estricta (===)
expect(2 + 2).toBe(4);
expect('hola').toBe('hola');

// toEqual: Igualdad profunda (para objetos/arrays)
expect({ nombre: 'Juan' }).toEqual({ nombre: 'Juan' });
expect([1, 2, 3]).toEqual([1, 2, 3]);
```

### Verdadero/Falso

```javascript
expect(true).toBeTruthy();
expect(false).toBeFalsy();
expect(null).toBeFalsy();
expect(undefined).toBeFalsy();
expect(0).toBeFalsy();
expect('').toBeFalsy();
```

### Números

```javascript
expect(10).toBeGreaterThan(5);        // Mayor que
expect(5).toBeLessThan(10);           // Menor que
expect(10).toBeGreaterThanOrEqual(10); // Mayor o igual
expect(5).toBeLessThanOrEqual(5);     // Menor o igual
expect(0.1 + 0.2).toBeCloseTo(0.3);   // Aproximadamente (decimales)
```

### Strings

```javascript
expect('Hola Mundo').toContain('Mundo');
expect('test@email.com').toMatch(/.*@.*\.com/);
```

### Arrays

```javascript
expect([1, 2, 3]).toContain(2);
expect([1, 2, 3]).toHaveLength(3);
```

### Null/Undefined

```javascript
expect(null).toBeNull();
expect(undefined).toBeUndefined();
expect('algo').toBeDefined();
```

### Negación (not)

```javascript
expect(5).not.toBe(10);
expect([1, 2, 3]).not.toContain(4);
```

---

## ⏱️ Tests Asíncronos

### Problema
JavaScript tiene código asíncrono (promesas, async/await)

```javascript
// Esta función tarda tiempo en ejecutarse
async function obtenerUsuario(id) {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
```

### Solución 1: async/await

```javascript
test('debe obtener usuario', async () => {
  const usuario = await obtenerUsuario(1);
  expect(usuario.nombre).toBe('Juan');
});
```

### Solución 2: Promesas con return

```javascript
test('debe obtener usuario', () => {
  return obtenerUsuario(1).then(usuario => {
    expect(usuario.nombre).toBe('Juan');
  });
});
```

### Solución 3: Verificar que una promesa falle

```javascript
test('debe fallar con ID inválido', async () => {
  await expect(obtenerUsuario(-1)).rejects.toThrow('ID inválido');
});
```

---

## 🎭 Mocking

**Mocking** es simular el comportamiento de algo (APIs, funciones, etc.)

### ¿Por qué hacer mocking?

1. **No queremos hacer llamadas HTTP reales** (son lentas y pueden fallar)
2. **Queremos controlar las respuestas** (simular errores, casos extremos)
3. **Queremos tests rápidos y confiables**

### Ejemplo 1: Mock de fetch

```javascript
test('debe obtener clima de Bogotá', async () => {
  // 🎭 Simulamos la respuesta de fetch
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      temperatura: 18,
      ciudad: 'Bogotá'
    })
  });
  
  const clima = await obtenerClima('Bogotá');
  
  expect(clima.temperatura).toBe(18);
  expect(clima.ciudad).toBe('Bogotá');
});
```

### Ejemplo 2: Mock de función

```javascript
// Función original
function enviarEmail(destinatario, mensaje) {
  // Código que envía email real
}

// En el test
test('debe enviar email de bienvenida', () => {
  // 🎭 Creamos un mock
  const mockEnviarEmail = jest.fn();
  
  // Usamos el mock en lugar de la función real
  registrarUsuario('juan@email.com', mockEnviarEmail);
  
  // Verificamos que se llamó
  expect(mockEnviarEmail).toHaveBeenCalled();
  expect(mockEnviarEmail).toHaveBeenCalledWith('juan@email.com', 'Bienvenido');
});
```

### Ejemplo 3: Mock de módulo completo

```javascript
// Mock de todo el módulo de geocoding
jest.mock('../geocoding.js', () => ({
  geocodeCity: jest.fn().mockResolvedValue({
    name: 'Bogotá',
    latitude: 4.6,
    longitude: -74.1
  })
}));
```

---

## ✅ Mejores Prácticas

### 1. Nombres Descriptivos

```javascript
// ❌ Mal
test('test 1', () => { ... });

// ✅ Bien
test('debe retornar error cuando el email es inválido', () => { ... });
```

### 2. Un Concepto por Test

```javascript
// ❌ Mal: Testea múltiples cosas
test('función de usuario', () => {
  expect(crearUsuario()).toBeDefined();
  expect(eliminarUsuario()).toBe(true);
  expect(actualizarUsuario()).toEqual({...});
});

// ✅ Bien: Un test por concepto
test('debe crear usuario correctamente', () => {
  expect(crearUsuario()).toBeDefined();
});

test('debe eliminar usuario correctamente', () => {
  expect(eliminarUsuario()).toBe(true);
});
```

### 3. Tests Independientes

```javascript
// ❌ Mal: Tests dependen uno del otro
let usuario;

test('crear usuario', () => {
  usuario = crearUsuario();
});

test('actualizar usuario', () => {
  actualizarUsuario(usuario); // Depende del test anterior
});

// ✅ Bien: Cada test es independiente
test('crear usuario', () => {
  const usuario = crearUsuario();
  expect(usuario).toBeDefined();
});

test('actualizar usuario', () => {
  const usuario = crearUsuario(); // Crea su propio usuario
  actualizarUsuario(usuario);
  expect(usuario.actualizado).toBe(true);
});
```

### 4. Limpiar después de cada test

```javascript
describe('Tests de localStorage', () => {
  
  beforeEach(() => {
    // Se ejecuta ANTES de cada test
    localStorage.clear();
  });
  
  afterEach(() => {
    // Se ejecuta DESPUÉS de cada test
    localStorage.clear();
  });
  
  test('debe guardar dato', () => {
    localStorage.setItem('key', 'value');
    expect(localStorage.getItem('key')).toBe('value');
  });
});
```

### 5. Testear casos extremos

```javascript
describe('función dividir', () => {
  test('caso normal', () => {
    expect(dividir(10, 2)).toBe(5);
  });
  
  test('división por cero', () => {
    expect(() => dividir(10, 0)).toThrow('No se puede dividir por cero');
  });
  
  test('números negativos', () => {
    expect(dividir(-10, 2)).toBe(-5);
  });
  
  test('decimales', () => {
    expect(dividir(10, 3)).toBeCloseTo(3.33, 2);
  });
});
```

---

## 🏋️ Ejercicios Prácticos

### Ejercicio 1: Función de Validación

```javascript
// src/utils/validacion.js
export function esEmailValido(email) {
  // TODO: Implementa esta función
  // Debe retornar true si el email es válido
}

// src/utils/__tests__/validacion.test.js
import { esEmailValido } from '../validacion.js';

describe('Validación de email', () => {
  
  test('debe aceptar email válido', () => {
    expect(esEmailValido('test@example.com')).toBe(true);
  });
  
  test('debe rechazar email sin @', () => {
    expect(esEmailValido('testexample.com')).toBe(false);
  });
  
  test('debe rechazar email sin dominio', () => {
    expect(esEmailValido('test@')).toBe(false);
  });
  
  // TODO: Agrega más tests
});
```

### Ejercicio 2: Función de Carrito de Compras

```javascript
// src/utils/carrito.js
export function calcularTotal(items) {
  // items = [{ precio: 100, cantidad: 2 }, { precio: 50, cantidad: 1 }]
  // TODO: Implementa esta función
}

// src/utils/__tests__/carrito.test.js
describe('Carrito de compras', () => {
  
  test('debe calcular total correctamente', () => {
    const items = [
      { precio: 100, cantidad: 2 },
      { precio: 50, cantidad: 1 }
    ];
    expect(calcularTotal(items)).toBe(250);
  });
  
  test('debe retornar 0 para carrito vacío', () => {
    expect(calcularTotal([])).toBe(0);
  });
  
  // TODO: Agrega más tests
});
```

### Ejercicio 3: API Mock

```javascript
// src/api/productos.js
export async function obtenerProducto(id) {
  const response = await fetch(`/api/productos/${id}`);
  return response.json();
}

// src/api/__tests__/productos.test.js
describe('API de productos', () => {
  
  test('debe obtener producto por ID', async () => {
    // TODO: Crea un mock de fetch
    // TODO: Verifica que retorne el producto correcto
  });
  
  test('debe manejar error 404', async () => {
    // TODO: Simula un error 404
    // TODO: Verifica que lance un error
  });
});
```

---

## 🎓 Resumen de Comandos Jest

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch (se re-ejecutan al guardar)
npm run test:watch

# Ejecutar tests con cobertura
npm run test:coverage

# Ejecutar un archivo específico
npm test -- format.test.js

# Ejecutar tests que coincidan con un patrón
npm test -- --testNamePattern="debe formatear"
```

---

## 📊 Interpretando Resultados

### Test Exitoso ✅
```
PASS  src/utils/__tests__/format.test.js
  ✓ debe formatear temperatura (2ms)
  ✓ debe formatear viento (1ms)
```

### Test Fallido ❌
```
FAIL  src/utils/__tests__/format.test.js
  ✕ debe formatear temperatura (5ms)

  expect(received).toBe(expected)

  Expected: "26 °C"
  Received: "25.7 °C"
```

### Cobertura de Código
```
File           | % Stmts | % Branch | % Funcs | % Lines |
---------------|---------|----------|---------|---------|
format.js      |   100   |   100    |   100   |   100   |
storage.js     |   95    |   90     |   100   |   95    |
```

- **Stmts**: Porcentaje de declaraciones ejecutadas
- **Branch**: Porcentaje de ramas (if/else) ejecutadas
- **Funcs**: Porcentaje de funciones ejecutadas
- **Lines**: Porcentaje de líneas ejecutadas

---

## 🎯 Próximos Pasos

1. ✅ **Practica con los ejercicios** de esta guía
2. ✅ **Lee los tests existentes** en el proyecto
3. ✅ **Escribe tests para código nuevo** que crees
4. ✅ **Experimenta con diferentes matchers**
5. ✅ **Aprende sobre TDD** (Test-Driven Development)

---

## 📚 Recursos Adicionales

- [Documentación oficial de Jest](https://jestjs.io/)
- [Testing JavaScript (Kent C. Dodds)](https://testingjavascript.com/)
- [JavaScript Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

**¡Felicidades! 🎉 Ahora sabes cómo hacer testing en JavaScript.**

Recuerda: **Los tests son tu red de seguridad. Escríbelos siempre.** 🛡️
