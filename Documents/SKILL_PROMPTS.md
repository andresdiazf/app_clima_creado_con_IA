# Skill: Prompts y buenas prácticas para app_clima_creado_con_IA

## Descripción
Esta skill documenta los prompts recomendados y buenas prácticas para el desarrollo y extensión de la aplicación de clima basada en Open-Meteo.

---

## Prompts recomendados

### 1. Obtener datos meteorológicos de una ciudad
```
Crea una función en JavaScript que reciba el nombre de una ciudad como entrada, obtenga la latitud y longitud usando la Geocoding API de Open-Meteo, y luego consulte la Weather Forecast API de Open-Meteo para obtener los datos meteorológicos actuales. La función debe devolver un objeto JSON con el nombre de la ciudad, la temperatura en grados Celsius y una descripción del clima. Incluye manejo de errores para nombres de ciudad inválidos, fallos en la API y problemas de red. Usa la API Fetch y buenas prácticas modernas.
```

### 2. Mejorar la experiencia de usuario
```
Agrega un botón para eliminar ciudades previamente seleccionadas del historial de búsquedas recientes. El botón debe estar junto a cada ciudad y actualizar la interfaz al eliminarla.
```

### 3. Internacionalización
```
Permite cambiar el idioma de la interfaz y la descripción del clima. Asegúrate de que la función acepte un parámetro de idioma y lo aplique en las llamadas a la API y en la interfaz.
```

### 4. Validación y accesibilidad
```
Mejora la validación del nombre de la ciudad para evitar caracteres inválidos y haz la interfaz accesible para lectores de pantalla y navegación por teclado.
```

---

## Buenas prácticas
- Usa async/await y manejo de errores con try/catch.
- Separa la lógica de red, formateo y renderizado en módulos distintos.
- Documenta las funciones con JSDoc.
- Mantén la interfaz reactiva y accesible.
- Usa localStorage para persistir el historial.
- Evita duplicados en el historial de ciudades.

---

## Ejemplo de estructura de función
```js
/**
 * Obtiene información meteorológica resumida para una ciudad
 * @param {string} cityName
 * @returns {Promise<{ city: string, temperature: number, description: string }>}
 */
async function getCityWeatherInfo(cityName) {
  // ...ver implementación en src/api/weather.js
}
```

---

## Audiencia
- Desarrolladores principiantes y avanzados que deseen extender o mantener la aplicación.

---

## Intención
- Facilitar la extensión, mantenimiento y mejora de la app siguiendo prompts claros y buenas prácticas.
