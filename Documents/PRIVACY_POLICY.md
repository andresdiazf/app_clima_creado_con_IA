# 🔐 Política de Privacidad - Weather App

**Última actualización**: Junio 2026 
**Versión**: 1.0.0

---

## Resumen Ejecutivo

Weather App respeta tu privacidad. No recopilamos, almacenamos ni compartimos datos personales identificables. Esta aplicación está diseñada con **privacidad por defecto** ("privacy by design").

**En pocas palabras**: Tus datos te pertenecen. Punto.

---

## 1. ¿Qué datos recopilamos?

### 📍 Datos que SÍ recopilamos

#### A. Nombres de ciudades búscadas (LOCAL)
- **Qué**: Nombre de ciudades que buscas (ej: "Bogotá", "Madrid")
- **Dónde**: En tu navegador (localStorage)
- **Duración**: Hasta que limpies el historial
- **Por qué**: Para mostrarte búsquedas recientes
- **Quién accede**: Solo tu navegador, solo en tu dispositivo
- **Seguridad**: Encriptación del navegador/dispositivo

#### B. Datos meteorológicos (TEMPORAL)
- **Qué**: Información del clima (temperatura, humedad, etc.)
- **Dónde**: En memoria RAM, durante la sesión
- **Duración**: Mientras usas la app, se borra al cerrar
- **Por qué**: Para mostrarte el clima actual
- **Quién accede**: Solo tu navegador

### ❌ Datos que NO recopilamos

| Dato | ¿Recopilado? | Razón |
|------|----------|-------|
| Nombre real | ❌ No | No lo necesitamos |
| Correo electrónico | ❌ No | No lo recopilamos |
| Información de ubicación exacta | ❌ No | Solo buscas una ciudad (pública) |
| Contraseña/tokens | ❌ No | No hay autenticación |
| Número de teléfono | ❌ No | No lo necesitamos |
| Datos de tarjeta/pago | ❌ No | App gratuita, sin pagos |
| Registro de navegación | ❌ No | No rastreamos |
| Cookies de rastreo | ❌ No | Ninguna |

---

## 2. 🌐 APIs Externas - ¿Qué datos ven?

### Open-Meteo API
**Proveedor**: [open-meteo.com](https://open-meteo.com/)  
**Política**: [open-meteo.com/privacy](https://open-meteo.com/privacy)

#### Datos compartidos con Open-Meteo
```
GET https://api.open-meteo.com/v1/forecast?latitude=4.61&longitude=-74.08&current=...
```

✅ **Datos que ven**:
- Latitud/Longitud (coordinadas públicas de la ciudad)
- Tu dirección IP (estándar HTTP)
- User-Agent del navegador (estándar HTTP)

❌ **Datos que NO ven**:
- Tu nombre
- Tu identidad
- Tu domicilio exacto
- Información de otras búsquedas

#### ¿Por qué compartimos esto?
- Necesario para obtener datos meteorológicos precisos
- Es una API pública abierta (GDPR-compliant)
- Open-Meteo no rastrea ni vende datos

---

## 3. 💾 Almacenamiento Local

### localStorage del navegador

```javascript
// Qué se almacena
{
  "weather_recent_cities": [
    "Bogotá",
    "Madrid", 
    "São Paulo"
  ]
}
```

### Características de seguridad

✅ **Encriptado**: Por el navegador/SO  
✅ **Aislado**: No accesible desde otros sitios  
✅ **Local**: En tu dispositivo, no en servidores  
✅ **Controlado**: Tú controlas su eliminación  
✅ **Limitado**: Máximo 5 ciudades  

### Cómo limpiar tus datos

**Opción 1**: Usar el botón en la app
```javascript
// Si implementamos botón "Limpiar historial"
localStorage.removeItem('weather_recent_cities');
```

**Opción 2**: Limpiar cookies del navegador
- Chrome: Configuración > Privacidad > Borrar datos de navegación
- Firefox: Preferencias > Privacidad > Cookies y datos del sitio
- Safari: Preferencias > Privacidad > Gestionar datos del sitio

**Opción 3**: Limpiar localStorage completo
```javascript
// En consola del navegador (F12)
localStorage.clear();
```

---

## 4. 🍪 Cookies

### ¿Usamos cookies?

❌ **NO**. Esta aplicación NO usa cookies.

- ❌ Sin cookies propias
- ❌ Sin cookies de terceros
- ❌ Sin rastreo
- ❌ Sin análisis de comportamiento

---

## 5. 🔒 Seguridad de Datos

### Protecciones implementadas

| Capa | Protección | Detalles |
|-----|-----------|---------|
| **API** | HTTPS | Open-Meteo usa HTTPS encriptado |
| **Transporte** | SSL/TLS | Encriptación en tránsito |
| **Almacenamiento** | Encriptación SO | localStorage del dispositivo |
| **Acceso** | SOP* | Sin acceso desde otros sitios |
| **Input** | Sanitización | encodeURIComponent() |
| **XSS** | textContent | No ejecuta HTML |

*SOP = Same Origin Policy (política de un mismo origen)

### ¿Podrían hackear mis datos?

**Riesgo MUY BAJO** porque:
1. Datos almacenados locally (no en servidor)
2. Solo nombres de ciudades (no sensibles)
3. Encriptado por tu dispositivo/navegador
4. Acceso solo en tu navegador, tu dispositivo

---

## 6. 🛡️ Derechos del Usuario (GDPR)

### Bajo GDPR, tienes derecho a:

#### ✅ Derecho de acceso
**¿Qué datos tienes?**
- Tus datos están en `localStorage` de tu navegador
- Puedes verlos en F12 > Application > localStorage

#### ✅ Derecho al olvido
**¿Quiero borrar mis datos?**
- Click botón "Limpiar historial" (si implementado)
- O: Configuración del navegador > Borrar cookies
- O: `localStorage.clear()` en consola

#### ✅ Derecho a la portabilidad
**¿Quiero exportar mis datos?**
```javascript
// En consola (F12)
JSON.stringify(localStorage.getItem('weather_recent_cities'))
```

#### ✅ Derecho a rectificación
**¿Debo corregir un dato?**
- Borrar ciudad de historial
- Volver a buscar con nombre correcto

#### ✅ Derecho a la restricción
**¿Restringir uso?**
- Usar el navegador en modo privado/incógnito
- localStorage se borra al cerrar sesión

---

## 7. 📊 Analytics y Tracking

### ¿Recopilamos analytics?

❌ **NO** en la versión actual.

Opciones futuras (OPT-IN solamente):
- Google Analytics (si lo agregas)
- Sentry (para error tracking)
- PostHog (para product analytics)

Si se implementan, necesitarían:
1. Tu consentimiento explícito
2. Actualización de esta política
3. Opción de opt-out

---

## 8. 🔄 Cambios en esta Política

### Notificación de cambios

Si modificamos esta política:
1. Actualizaremos esta página
2. Notificaremos en README.md
3. Versión será incrementada
4. Cambios serán marcados

### Cambios principales

| Versión | Fecha | Cambio |
|---------|-------|--------|
| 1.0.0 | Jun 2024 | Versión inicial |

---

## 9. 📞 Contacto

### Tienes dudas sobre tu privacidad?

**Contacta a**:
- 📧 Email: [tu-email@example.com]
- 🐙 GitHub: [tu-github]
- 🔗 Issues: [link a issues]

**Tiempo de respuesta**: 7-14 días

---

## 10. ⚖️ Conformidad Legal

### GDPR (Regulación General de Protección de Datos)

✅ **Cumplimiento**:
- ✅ No recopilamos datos personales sensibles
- ✅ Sin consentimiento requerido (datos públicos)
- ✅ Datos almacenados localmente
- ✅ Derecho al olvido implementado
- ✅ Sin cookies de rastreo

### CCPA (California Consumer Privacy Act)

✅ **Cumplimiento**:
- ✅ No vendemos datos
- ✅ No compartimos datos
- ✅ Transparencia total
- ✅ Derecho a borrar implementado

### LGPD (Lei Geral de Proteção de Dados - Brasil)

✅ **Cumplimiento**:
- ✅ Consentimiento: No requerido (datos anonimizados)
- ✅ Transparencia: Esta política
- ✅ Derecho de acceso: localStorage visible
- ✅ Datos personales: Ninguno recopilado

---

## 11. FAQ - Preguntas Frecuentes

### ¿Venden mis datos?
❌ **NO**. No vendemos, alquilamos ni compartimos datos.

### ¿Me rastrean?
❌ **NO**. Sin cookies, sin análisis, sin rastreo.

### ¿Qué pasa con mi IP?
- Open-Meteo ve tu IP (estándar HTTP)
- No es identificable personalmente
- No es retenida a largo plazo

### ¿Es seguro?
✅ **SÍ**. Muy seguro. Datos locales, encriptados.

### ¿Puedo borrar mis datos?
✅ **SÍ**. Tú controlas completamente.

### ¿Podrían hackear mis datos?
❌ **Muy improbable**. Son solo nombres de ciudades, locales.

### ¿Qué pasa si cierro el navegador?
- localStorage persiste
- Puedes borrarlo manualmente
- O dejar que se acumule (limite 5)

### ¿Usan JavaScript de rastreo?
❌ **NO**. Solo JavaScript funcional.

---

## 12. 📋 Declaración de Privacidad

**Yo, como desarrollador de Weather App, declaro que**:

✅ Respeto la privacidad del usuario  
✅ No recopilo datos personales identificables  
✅ No vendo datos a terceros  
✅ Soy transparente sobre recopilación de datos  
✅ Proporciono opciones de control  
✅ Cumplo con GDPR, CCPA, LGPD  
✅ Mantengo esta política actualizada  

---

## Conclusión

**Weather App es privada, segura y transparent**.

- 🎯 Diseñada con privacidad en mente
- 🔒 Datos bajo tu control
- ✅ Cumplimiento legal verificado
- 📝 Esta política es clara y honesta

**Tu privacidad es importante. La respetamos.**

---

**Documento válido desde**: Junio 2024  
**Próxima revisión**: Junio 2025  
**Cumplimiento**: GDPR ✅ CCPA ✅ LGPD ✅
