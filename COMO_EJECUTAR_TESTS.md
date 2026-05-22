# 🚀 Cómo Ejecutar y Entender los Tests

## 📋 Tabla de Contenidos
1. [Instalación](#instalación)
2. [Comandos Básicos](#comandos-básicos)
3. [Interpretando Resultados](#interpretando-resultados)
4. [Estructura de Tests](#estructura-de-tests)
5. [Solución de Problemas](#solución-de-problemas)

---

## 📦 Instalación

### Paso 1: Instalar Dependencias

```bash
npm install
```

Esto instalará:
- **Jest** (v29.7.0): Framework de testing
- **jest-environment-jsdom** (v29.7.0): Simula el navegador

### Paso 2: Verificar Instalación

```bash
npm test -- --version
```

Deberías ver algo como: `29.7.0`

---

## 🎮 Comandos Básicos

### 1. Ejecutar Todos los Tests

```bash
npm test
```

**Qué hace:**
- Ejecuta todos los archivos `*.test.js`
- Muestra resultados en la consola
- Sale con código 0 si todos pasan, 1 si alguno falla

**Salida esperada:**
```
PASS  src/utils/__tests__/format.test.js
PASS  src/utils/__tests__/storage.test.js
PASS  src/api/__tests__/api-errors.test.js

Test Suites: 3 passed, 3 total
Tests:       39 passed, 39 total
Time:        1.183 s
```

### 2. Ejecutar Tests en Modo Watch

```bash
npm run test:watch
```

**Qué hace:**
- Ejecuta tests automáticamente cuando guardas cambios
- Útil durante desarrollo
- Presiona `q` para salir

**Cuándo usar:**
- Cuando estás escribiendo nuevos tests
- Cuando estás refactorizando código
- Para desarrollo iterativo

### 3. Ejecutar Tests con Cobertura

```bash
npm run test:coverage
```

**Qué hace:**
- Ejecuta todos los tests
- Genera reporte de cobertura
- Muestra qué líneas de código están testeadas

**Salida esperada:**
```
---------------|---------|----------|---------|---------|-------------------
File           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
---------------|---------|----------|---------|---------|-------------------
All files      |   38.01 |    63.15 |   48.27 |   38.73 |
 src/api       |   96.15 |    88.23 |     100 |     100 |
  geocoding.js |     100 |      100 |     100 |     100 |
  weather.js   |   93.75 |    84.61 |     100 |     100 | 33,64
 src/utils     |     100 |      100 |     100 |     100 |
  format.js    |     100 |      100 |     100 |     100 |
  storage.js   |     100 |      100 |     100 |     100 |
---------------|---------|----------|---------|---------|-------------------
```

### 4. Ejecutar un Archivo Específico

```bash
npm test -- format.test.js
```

**Qué hace:**
- Ejecuta solo los tests del archivo especificado
- Más rápido para desarrollo

### 5. Ejecutar Tests por Nombre

```bash
npm test -- --testNamePattern="debe formatear"
```

**Qué hace:**
- Ejecuta solo tests cuyo nombre coincida con el patrón
- Útil para testear una funcionalidad específica

---

## 📊 Interpretando Resultados

### ✅ Test Exitoso

```
PASS  src/utils/__tests__/format.test.js
  formatTemp - Formatear temperatura
    ✓ debe formatear temperatura en Celsius correctamente (2ms)
    ✓ debe manejar temperaturas negativas (1ms)
```

**Significado:**
- ✓ = Test pasó
- (2ms) = Tiempo de ejecución
- Verde = Todo bien

### ❌ Test Fallido

```
FAIL  src/utils/__tests__/format.test.js
  formatTemp - Formatear temperatura
    ✕ debe formatear temperatura en Celsius correctamente (5ms)

  expect(received).toBe(expected)

  Expected: "26 °C"
  Received: "25.7 °C"

    12 |     const resultado = formatTemp(temperatura);
    13 |
  > 14 |     expect(resultado).toBe('26 °C');
       |                       ^
    15 |   });
```

**Cómo leer:**
- ✕ = Test falló
- **Expected**: Lo que esperabas
- **Received**: Lo que obtuviste
- **Línea 14**: Dónde falló

**Cómo arreglar:**
1. Lee el mensaje de error
2. Verifica la función que estás testeando
3. Corrige el código o el test
4. Vuelve a ejecutar

### 📈 Reporte de Cobertura

```
File           | % Stmts | % Branch | % Funcs | % Lines |
---------------|---------|----------|---------|---------|
format.js      |   100   |   100    |   100   |   100   |
```

**Columnas:**
- **% Stmts**: Porcentaje de declaraciones ejecutadas
- **% Branch**: Porcentaje de ramas (if/else) ejecutadas
- **% Funcs**: Porcentaje de funciones ejecutadas
- **% Lines**: Porcentaje de líneas ejecutadas

**Interpretación:**
- **100%**: Perfecto, todo está testeado
- **80-99%**: Muy bien, casi completo
- **60-79%**: Bien, pero puede mejorar
- **<60%**: Necesita más tests

---

## 📂 Estructura de Tests

### Ubicación de Archivos

```
src/
├── api/
│   ├── geocoding.js              # Código fuente
│   ├── weather.js                # Código fuente
│   └── __tests__/                # Carpeta de tests
│       └── api-errors.test.js    # Tests de APIs
│
├── utils/
│   ├── format.js                 # Código fuente
│   ├── storage.js                # Código fuente
│   └── __tests__/                # Carpeta de tests
│       ├── format.test.js        # Tests de formato
│       └── storage.test.js       # Tests de storage
```

**Convención:**
- Tests en carpeta `__tests__/`
- Nombre: `[archivo].test.js`
- Mismo nivel que el código que testea

### Anatomía de un Test

```javascript
// 1. IMPORTS: Importar lo que vas a testear
import { formatTemp } from '../format.js';

// 2. DESCRIBE: Agrupar tests relacionados
describe('formatTemp', () => {
  
  // 3. TEST: Definir un caso de prueba
  test('debe formatear temperatura correctamente', () => {
    
    // 4. ARRANGE: Preparar datos
    const temperatura = 25.7;
    
    // 5. ACT: Ejecutar función
    const resultado = formatTemp(temperatura);
    
    // 6. ASSERT: Verificar resultado
    expect(resultado).toBe('26 °C');
  });
});
```

---

## 🔧 Solución de Problemas

### Problema 1: "jest is not defined"

**Error:**
```
ReferenceError: jest is not defined
```

**Solución:**
En ES Modules, no uses `jest.fn()`. En su lugar:
```javascript
// ❌ No funciona en ES Modules
global.fetch = jest.fn().mockResolvedValue({...});

// ✅ Funciona
global.fetch = () => Promise.resolve({...});
```

### Problema 2: "Cannot find module"

**Error:**
```
Cannot find module '../format.js'
```

**Solución:**
- Verifica la ruta del import
- Asegúrate de incluir la extensión `.js`
- Verifica que el archivo exista

### Problema 3: Tests pasan localmente pero fallan en CI

**Posibles causas:**
- Dependencias de tiempo (usa `jest.useFakeTimers()`)
- Dependencias de orden (tests no independientes)
- Variables de entorno faltantes

**Solución:**
```javascript
// Limpia estado entre tests
beforeEach(() => {
  localStorage.clear();
  global.fetch = originalFetch;
});
```

### Problema 4: "Test timeout"

**Error:**
```
Timeout - Async callback was not invoked within the 5000 ms timeout
```

**Solución:**
```javascript
// Aumenta el timeout
test('test lento', async () => {
  // ...
}, 10000); // 10 segundos
```

### Problema 5: "localStorage is not defined"

**Error:**
```
ReferenceError: localStorage is not defined
```

**Solución:**
Asegúrate de tener `testEnvironment: 'jsdom'` en `jest.config.js`

---

## 🎯 Mejores Prácticas

### 1. Ejecuta Tests Antes de Commit

```bash
# Antes de hacer commit
npm test

# Si pasan, haz commit
git add .
git commit -m "feat: nueva funcionalidad"
```

### 2. Escribe Tests Primero (TDD)

```javascript
// 1. Escribe el test (falla)
test('debe sumar dos números', () => {
  expect(sumar(2, 3)).toBe(5);
});

// 2. Escribe el código mínimo
function sumar(a, b) {
  return a + b;
}

// 3. Ejecuta el test (pasa)
// 4. Refactoriza si es necesario
```

### 3. Mantén Tests Simples

```javascript
// ❌ Test complejo
test('test de todo', () => {
  expect(func1()).toBe(1);
  expect(func2()).toBe(2);
  expect(func3()).toBe(3);
});

// ✅ Tests separados
test('func1 debe retornar 1', () => {
  expect(func1()).toBe(1);
});

test('func2 debe retornar 2', () => {
  expect(func2()).toBe(2);
});
```

### 4. Usa Nombres Descriptivos

```javascript
// ❌ Nombre vago
test('test 1', () => { ... });

// ✅ Nombre descriptivo
test('debe retornar error cuando el email es inválido', () => { ... });
```

---

## 📚 Recursos Adicionales

### Documentación
- [Jest Docs](https://jestjs.io/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

### Archivos de Ayuda en este Proyecto
- `GUIA_TESTING.md`: Guía completa de testing
- `EJEMPLOS_TESTS.md`: Ejemplos prácticos paso a paso
- `README.md`: Documentación del proyecto

### Comandos Útiles

```bash
# Ver ayuda de Jest
npm test -- --help

# Ejecutar tests en modo verbose
npm test -- --verbose

# Ejecutar solo tests que fallaron
npm test -- --onlyFailures

# Limpiar caché de Jest
npm test -- --clearCache
```

---

## 🎉 ¡Listo para Testear!

Ahora tienes todo lo necesario para:
- ✅ Ejecutar tests
- ✅ Entender resultados
- ✅ Solucionar problemas
- ✅ Escribir nuevos tests

**Recuerda:** Los tests son tu red de seguridad. ¡Úsalos siempre! 🛡️

---

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas:
1. Lee el mensaje de error completo
2. Busca en esta guía
3. Revisa `GUIA_TESTING.md` y `EJEMPLOS_TESTS.md`
4. Pregunta a tu instructor o compañeros

**¡Feliz testing! 🧪**
