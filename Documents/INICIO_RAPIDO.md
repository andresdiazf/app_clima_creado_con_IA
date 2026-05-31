# ⚡ Inicio Rápido - Weather App Testing

## 🚀 Empezar en 5 Minutos

### 1️⃣ Instalar (1 minuto)

```bash
npm install
```

### 2️⃣ Ejecutar Tests (30 segundos)

```bash
npm test
```

**Resultado esperado:**
```
✅ Test Suites: 3 passed
✅ Tests: 39 passed
✅ Time: ~1.8 segundos
```

### 3️⃣ Ver Cobertura (30 segundos)

```bash
npm run test:coverage
```

**Resultado esperado:**
```
✅ Statements: 98.7%
✅ Branches: 94.1%
✅ Functions: 100%
✅ Lines: 100%
```

### 4️⃣ Abrir la App (1 minuto)

1. Abre `index.html` en tu navegador
2. Busca una ciudad (ej: "Bogotá")
3. ¡Ve el clima en tiempo real!

---

## 📚 ¿Qué Leer Primero?

### Si tienes 5 minutos
→ Lee este archivo completo

### Si tienes 15 minutos
→ `README.md` - Resumen del proyecto

### Si tienes 1 hora
→ `GUIA_TESTING.md` - Aprende testing desde cero

### Si tienes 2 horas
→ `EJEMPLOS_TESTS.md` - Practica con ejemplos

### Si tienes 4 horas
→ Lee toda la documentación y practica

---

## 🎯 Lo Más Importante

### Tests Implementados
- ✅ **39 tests** en total
- ✅ **100% pasan** exitosamente
- ✅ **98.7% cobertura** de código

### Archivos de Tests
1. `src/utils/__tests__/format.test.js` - 15 tests de formateo
2. `src/utils/__tests__/storage.test.js` - 16 tests de localStorage
3. `src/api/__tests__/api-errors.test.js` - 8 tests de APIs

### Documentación
- 📄 `README.md` - Documentación principal
- 📄 `GUIA_TESTING.md` - Guía completa (15 páginas)
- 📄 `EJEMPLOS_TESTS.md` - Ejemplos prácticos (12 páginas)
- 📄 `COMO_EJECUTAR_TESTS.md` - Instrucciones (8 páginas)

---

## 🧪 Comandos Esenciales

```bash
# Ejecutar todos los tests
npm test

# Modo watch (auto-ejecutar al guardar)
npm run test:watch

# Con reporte de cobertura
npm run test:coverage

# Ejecutar un archivo específico
npm test -- format.test.js
```

---

## 📖 Estructura del Proyecto

```
weather-app/
├── 📄 Documentación (7 archivos)
│   ├── README.md
│   ├── GUIA_TESTING.md
│   ├── EJEMPLOS_TESTS.md
│   └── ...
│
├── 🧪 Tests (3 archivos, 39 tests)
│   ├── format.test.js
│   ├── storage.test.js
│   └── api-errors.test.js
│
└── 💻 Código Fuente
    ├── index.html
    ├── src/api/
    ├── src/utils/
    └── src/ui/
```

---

## 🎓 Lo que Aprenderás

### Nivel Principiante (1-2 horas)
- ✅ ¿Qué es testing?
- ✅ Cómo escribir tu primer test
- ✅ Matchers básicos (toBe, toEqual)
- ✅ Ejecutar tests

### Nivel Intermedio (3-4 horas)
- ✅ Tests asíncronos
- ✅ Mocking de APIs
- ✅ Testing de localStorage
- ✅ Manejo de errores

### Nivel Avanzado (5+ horas)
- ✅ TDD (Test-Driven Development)
- ✅ Cobertura de código
- ✅ Mejores prácticas
- ✅ Debugging de tests

---

## 💡 Ejemplo Rápido

### Un Test Simple

```javascript
// Función a testear
function sumar(a, b) {
  return a + b;
}

// Test
test('debe sumar 2 + 3', () => {
  expect(sumar(2, 3)).toBe(5);
});
```

### Ejecutar

```bash
npm test
```

### Resultado

```
✅ debe sumar 2 + 3 (2ms)
```

---

## 🆘 Ayuda Rápida

### ❌ Error: "Cannot find module"
**Solución:** Ejecuta `npm install`

### ❌ Error: "jest is not defined"
**Solución:** Ya está resuelto en este proyecto (usamos mocks manuales)

### ❌ Tests fallan
**Solución:** Lee el mensaje de error y revisa `COMO_EJECUTAR_TESTS.md`

### ❓ ¿Cómo escribo un test?
**Solución:** Lee `EJEMPLOS_TESTS.md` - Ejemplo 1

### ❓ ¿Qué es mocking?
**Solución:** Lee `GUIA_TESTING.md` - Sección "Mocking"

---

## 🎯 Checklist Rápido

- [ ] ✅ Instalé las dependencias (`npm install`)
- [ ] ✅ Ejecuté los tests (`npm test`)
- [ ] ✅ Todos los tests pasan (39/39)
- [ ] ✅ Abrí la aplicación en el navegador
- [ ] ✅ Leí el `README.md`
- [ ] ✅ Entiendo qué es un test
- [ ] ✅ Puedo ejecutar tests en modo watch
- [ ] ✅ Vi el reporte de cobertura

---

## 📞 Siguiente Paso

### Opción 1: Aprender Testing
→ Abre `GUIA_TESTING.md` y empieza a leer

### Opción 2: Ver Ejemplos
→ Abre `EJEMPLOS_TESTS.md` y practica

### Opción 3: Explorar el Código
→ Abre `src/utils/__tests__/format.test.js`

### Opción 4: Leer Todo
→ Abre `INDICE_DOCUMENTACION.md` para ver el índice completo

---

## 🎉 ¡Listo!

Ya tienes todo configurado y funcionando. Ahora puedes:

1. ✅ Ejecutar tests
2. ✅ Ver la aplicación
3. ✅ Aprender testing
4. ✅ Practicar con ejemplos

**¡Feliz aprendizaje! 🚀**

---

## 📊 Estadísticas del Proyecto

- **Tests:** 39 ✅
- **Cobertura:** 98.7% ✅
- **Documentación:** 55 páginas ✅
- **Tiempo de tests:** ~1.8s ⚡
- **Archivos de tests:** 3 📁
- **Ejemplos prácticos:** 6 📝

---

**Creado con ❤️ para estudiantes de Generation Colombia**

**¿Preguntas?** Lee `INDICE_DOCUMENTACION.md` para encontrar respuestas.
