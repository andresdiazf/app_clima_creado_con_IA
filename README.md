# 🌤️ Weather App

Aplicación del clima construida con JavaScript vanilla (ES Modules) y la API gratuita de [Open-Meteo](https://open-meteo.com). No requiere API key ni instalación de dependencias.

## Estructura del proyecto

```
weather-app/
├── index.html              ← Página principal
├── styles/
│   ├── main.css            ← Estilos globales, input, chips
│   └── weather-card.css    ← Tarjeta de resultado, spinner, grid
├── src/
│   ├── app.js              ← Punto de entrada, orquesta todo el flujo
│   ├── api/
│   │   ├── geocoding.js    ← Ciudad → coordenadas (Open-Meteo Geocoding)
│   │   └── weather.js      ← Coordenadas → datos del clima (Open-Meteo)
│   ├── ui/
│   │   ├── render.js       ← Actualiza el DOM
│   │   └── icons.js        ← Códigos WMO → emojis
│   └── utils/
│       ├── format.js       ← Funciones puras de formateo
│       └── storage.js      ← Historial en localStorage
└── assets/
    └── icons/              ← SVGs opcionales
```

## Cómo correrlo en VS Code

> ⚠️ Los ES Modules (`import/export`) requieren un servidor HTTP.
> Abrir `index.html` directo en el navegador **no funciona** por política CORS.

### Opción 1 — Live Server (recomendada)

1. Instala la extensión **Live Server** de Ritwick Dey en VS Code
2. Clic derecho sobre `index.html` → **Open with Live Server**
3. Se abre en `http://127.0.0.1:5500`

### Opción 2 — Python (sin extensiones)

```bash
# Python 3
python -m http.server 5500
```

Luego abre `http://localhost:5500` en tu navegador.

## APIs utilizadas

| API | URL | Uso |
|-----|-----|-----|
| Geocoding | `geocoding-api.open-meteo.com` | Ciudad → lat/lon |
| Forecast  | `api.open-meteo.com`           | Datos del clima  |

Ambas son gratuitas, open-source y no requieren registro.
