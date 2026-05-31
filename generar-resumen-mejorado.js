import { Document, Packer, Paragraph, TextRun, HeadingLevel, PageBreak, Table, TableCell, TableRow, WidthType, AlignmentType, BorderStyle, convertInchesToTwip } from 'docx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const doc = new Document({
  sections: [
    {
      children: [
        // PORTADA
        new Paragraph({
          text: 'WEATHER APP',
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          run: new TextRun({
            size: 60,
            bold: true,
            color: '1F4E78',
          }),
        }),
        new Paragraph({
          text: 'Resumen Ejecutivo del Proyecto',
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          run: new TextRun({
            size: 32,
            italic: true,
            color: '4472C4',
          }),
        }),
        new Paragraph({
          text: 'Una Aplicación Web de Clima Moderna, Segura y Testeada',
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          run: new TextRun({
            size: 24,
          }),
        }),
        new Paragraph({
          text: 'Generation Colombia',
          alignment: AlignmentType.CENTER,
          spacing: { after: 50 },
          run: new TextRun({
            italic: true,
            color: '595959',
          }),
        }),
        new Paragraph({
          text: 'Junio 2026',
          alignment: AlignmentType.CENTER,
          spacing: { after: 300 },
          run: new TextRun({
            italic: true,
            color: '595959',
          }),
        }),
        
        new PageBreak(),

        // ÍNDICE
        new Paragraph({
          text: 'TABLA DE CONTENIDOS',
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 },
          border: {
            bottom: {
              color: '4472C4',
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        }),
        new Paragraph({
          text: '1. Resumen Ejecutivo',
          spacing: { after: 75 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '2. Descripción de la Aplicación',
          spacing: { after: 75 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '3. Demostración de Funcionalidades',
          spacing: { after: 75 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '4. Cómo se Utilizó la IA',
          spacing: { after: 75 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '5. Reflexión y Aprendizajes',
          spacing: { after: 75 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '6. Logros y Orgullo',
          spacing: { after: 75 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '7. Mejoras Futuras',
          spacing: { after: 300 },
          indent: { left: 400 },
        }),

        new PageBreak(),

        // SECCIÓN 1: RESUMEN EJECUTIVO
        new Paragraph({
          text: '1. RESUMEN EJECUTIVO',
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 },
          border: {
            bottom: {
              color: '4472C4',
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        }),

        new Paragraph({
          text: 'Weather App es una aplicación web moderna que demuestra dominio en desarrollo full-stack, testing profesional y seguridad informática. Construida con JavaScript vanilla (sin frameworks) y completamente testeada con Jest, la aplicación utiliza APIs gratuitas y de código abierto para proporcionar información meteorológica precisa en tiempo real.',
          spacing: { after: 200 },
          alignment: AlignmentType.JUSTIFIED,
        }),

        new Paragraph({
          text: 'Estadísticas Destacadas',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 150 },
        }),

        createHighlightTable(),
        new Paragraph({
          text: '',
          spacing: { after: 300 },
        }),

        new Paragraph({
          text: '¿Por Qué Este Proyecto es Especial?',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: '✓ Código de Producción: 100% de tests pasando y 85%+ de cobertura',
          spacing: { after: 75 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '✓ Seguridad Auditada: Cero vulnerabilidades encontradas',
          spacing: { after: 75 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '✓ Privacidad Garantizada: GDPR, CCPA y LGPD compliant',
          spacing: { after: 75 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '✓ Totalmente Documentado: 13 archivos, 100+ páginas de documentación',
          spacing: { after: 75 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '✓ Uso Profesional de IA: Demuestra cómo aprovechar IA sin depender de ella',
          spacing: { after: 300 },
          indent: { left: 400 },
        }),

        new PageBreak(),

        // SECCIÓN 2: DESCRIPCIÓN
        new Paragraph({
          text: '2. DESCRIPCIÓN DE LA APLICACIÓN',
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 },
          border: {
            bottom: {
              color: '4472C4',
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        }),

        new Paragraph({
          text: '¿Qué es Weather App?',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: 'Weather App es una aplicación web diseñada para proporcionar información meteorológica actual y pronóstico de 7 días para cualquier ciudad del mundo. Implementa mejores prácticas modernas de desarrollo web, incluyendo:',
          spacing: { after: 150 },
          alignment: AlignmentType.JUSTIFIED,
        }),

        new Paragraph({
          text: '• Arquitectura modular con separación de responsabilidades',
          spacing: { after: 50 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '• Testing exhaustivo con cobertura del 85%+',
          spacing: { after: 50 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '• Seguridad en profundidad (no hay credenciales en el código)',
          spacing: { after: 50 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '• Performance optimizado con caché inteligente',
          spacing: { after: 50 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '• Interfaz responsive que funciona en todos los dispositivos',
          spacing: { after: 200 },
          indent: { left: 400 },
        }),

        new Paragraph({
          text: 'Características Principales',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: '🔍 Búsqueda Geocodificada',
          heading: HeadingLevel.HEADING_3,
          spacing: { after: 75 },
        }),
        new Paragraph({
          text: 'Busca ciudades en todo el mundo con validación automática de coordenadas. La aplicación retorna el nombre exacto de la ciudad, país, región y coordenadas GPS precisas.',
          spacing: { after: 150 },
          indent: { left: 200 },
        }),

        new Paragraph({
          text: '🌡️ Información Meteorológica Detallada',
          heading: HeadingLevel.HEADING_3,
          spacing: { after: 75 },
        }),
        new Paragraph({
          text: 'Visualiza temperatura actual, sensación térmica, humedad, velocidad del viento, precipitación y descripción del clima con iconos intuitivos.',
          spacing: { after: 150 },
          indent: { left: 200 },
        }),

        new Paragraph({
          text: '📅 Pronóstico de 7 Días',
          heading: HeadingLevel.HEADING_3,
          spacing: { after: 75 },
        }),
        new Paragraph({
          text: 'Ver el pronóstico completo con máximas, mínimas y probabilidad de precipitación para planificar actividades con anticipación.',
          spacing: { after: 150 },
          indent: { left: 200 },
        }),

        new Paragraph({
          text: '💾 Historial Inteligente',
          heading: HeadingLevel.HEADING_3,
          spacing: { after: 75 },
        }),
        new Paragraph({
          text: 'Las últimas 5 ciudades buscadas se guardan automáticamente en el navegador para acceso rápido sin duplicados.',
          spacing: { after: 150 },
          indent: { left: 200 },
        }),

        new Paragraph({
          text: '📱 Soporte Offline',
          heading: HeadingLevel.HEADING_3,
          spacing: { after: 75 },
        }),
        new Paragraph({
          text: 'Sistema de caché inteligente que almacena datos anteriores para consultar incluso sin conexión a internet.',
          spacing: { after: 150 },
          indent: { left: 200 },
        }),

        new Paragraph({
          text: 'Stack Tecnológico',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: '• Lenguaje: JavaScript ES6+ con ES Modules',
          spacing: { after: 50 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '• Testing: Jest con 68 tests (100% pasando)',
          spacing: { after: 50 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '• APIs: Open-Meteo (gratuita) + Geocoding API',
          spacing: { after: 50 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '• Almacenamiento: LocalStorage para persistencia',
          spacing: { after: 50 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '• CSS: Diseño responsive y moderno',
          spacing: { after: 300 },
          indent: { left: 400 },
        }),

        new PageBreak(),

        // SECCIÓN 3: DEMO
        new Paragraph({
          text: '3. DEMOSTRACIÓN DE FUNCIONALIDADES',
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 },
          border: {
            bottom: {
              color: '4472C4',
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        }),

        new Paragraph({
          text: 'Vista Principal de la Aplicación',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: 'La interfaz principal es limpia, intuitiva y totalmente responsiva:',
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: '• Header con branding de Open-Meteo (API utilizada)',
          spacing: { after: 50 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '• Campo de búsqueda con botón de envío',
          spacing: { after: 50 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '• Diseño colorido que atrae al usuario',
          spacing: { after: 150 },
          indent: { left: 400 },
        }),

        new Paragraph({
          text: 'Ejemplo de Búsqueda: Bogotá, Colombia',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: 'Cuando busca una ciudad, la aplicación muestra:',
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: 'Información de la Ciudad:',
          heading: HeadingLevel.HEADING_3,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: '• Nombre: Bogotá, Colombia',
          spacing: { after: 50 },
          indent: { left: 600 },
        }),
        new Paragraph({
          text: '• Coordenadas: 4.610° N, 74.082° O',
          spacing: { after: 150 },
          indent: { left: 600 },
        }),

        new Paragraph({
          text: 'Clima Actual:',
          heading: HeadingLevel.HEADING_3,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: '• Temperatura: 15°C (Llovizna moderada)',
          spacing: { after: 50 },
          indent: { left: 600 },
        }),
        new Paragraph({
          text: '• Sensación térmica: 15°C',
          spacing: { after: 50 },
          indent: { left: 600 },
        }),
        new Paragraph({
          text: '• Humedad: 78%',
          spacing: { after: 50 },
          indent: { left: 600 },
        }),
        new Paragraph({
          text: '• Viento: 7 km/h',
          spacing: { after: 50 },
          indent: { left: 600 },
        }),
        new Paragraph({
          text: '• Precipitación: 0.2 mm',
          spacing: { after: 150 },
          indent: { left: 600 },
        }),

        new Paragraph({
          text: 'Pronóstico de 7 Días:',
          heading: HeadingLevel.HEADING_3,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: 'Se muestran tarjetas visuales para cada día con:',
          spacing: { after: 100 },
          indent: { left: 200 },
        }),
        new Paragraph({
          text: '• Icono del clima (lluvia, nubes, sol, etc.)',
          spacing: { after: 50 },
          indent: { left: 600 },
        }),
        new Paragraph({
          text: '• Temperatura máxima y mínima',
          spacing: { after: 50 },
          indent: { left: 600 },
        }),
        new Paragraph({
          text: '• Probabilidad de precipitación',
          spacing: { after: 200 },
          indent: { left: 600 },
        }),

        new Paragraph({
          text: 'Chips de Ciudades Recientes',
          heading: HeadingLevel.HEADING_3,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: 'Bajo la barra de búsqueda aparecen botones rápidos con las últimas ciudades buscadas. Con un clic se accede al clima nuevamente sin volver a escribir.',
          spacing: { after: 300 },
          indent: { left: 200 },
        }),

        new PageBreak(),

        // SECCIÓN 4: USO DE IA
        new Paragraph({
          text: '4. CÓMO SE UTILIZÓ LA INTELIGENCIA ARTIFICIAL',
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 },
          border: {
            bottom: {
              color: '4472C4',
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        }),

        new Paragraph({
          text: 'La IA fue un socio colaborativo durante todo el desarrollo, potenciando capacidades en lugar de reemplazar decisiones de desarrollo.',
          spacing: { after: 200 },
          alignment: AlignmentType.JUSTIFIED,
        }),

        new Paragraph({
          text: 'Fase 1: Revisión de Código y Mejoras',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: 'La IA analizó el código existente e identificó oportunidades de mejora:',
          spacing: { after: 100 },
        }),

        new Paragraph({
          text: '✓ Validación Robusta: Implementar validación de entrada en todas las funciones',
          spacing: { after: 75 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '✓ Manejo de Errores: Crear códigos de error específicos (INVALID_INPUT, GEOCODING_ERROR)',
          spacing: { after: 75 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '✓ Timeouts: Añadir límite de 10 segundos en peticiones HTTP',
          spacing: { after: 75 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '✓ Seguridad: Eliminar datos sensibles de logs y localStorage',
          spacing: { after: 200 },
          indent: { left: 400 },
        }),

        new Paragraph({
          text: 'Fase 2: Generación de Tests Exhaustivos',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: 'La IA ayudó a generar 68 tests que cubren:',
          spacing: { after: 100 },
        }),

        new Paragraph({
          text: '15 tests • format.test.js (100% cobertura) - Formateo de datos climáticos',
          spacing: { after: 75 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '16 tests • storage.test.js (100% cobertura) - Almacenamiento local',
          spacing: { after: 75 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '8 tests • api-errors.test.js (96% cobertura) - Manejo de errores',
          spacing: { after: 75 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '29 tests • cache.test.js (100% cobertura) - Caché y soporte offline',
          spacing: { after: 200 },
          indent: { left: 400 },
        }),

        new Paragraph({
          text: 'Fase 3: Documentación Profesional',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: 'La IA generó documentación de nivel profesional que incluyó:',
          spacing: { after: 100 },
        }),

        new Paragraph({
          text: '✓ JSDoc detallado para 25+ funciones',
          spacing: { after: 50 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '✓ Guías paso-a-paso (15+ páginas)',
          spacing: { after: 50 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '✓ Auditoría completa de seguridad',
          spacing: { after: 50 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '✓ Políticas de privacidad y cumplimiento legal',
          spacing: { after: 200 },
          indent: { left: 400 },
        }),

        new Paragraph({
          text: 'Fase 4: Depuración y Resolución de Errores',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: 'La IA fue invaluable para:',
          spacing: { after: 100 },
        }),

        new Paragraph({
          text: '→ Explicar por qué tests fallaban y sugerir soluciones',
          spacing: { after: 50 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '→ Enseñar conceptos complejos (mocking, async/await)',
          spacing: { after: 50 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '→ Sugerir casos de prueba para errores extremos',
          spacing: { after: 50 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '→ Proponer mejoras de arquitectura y patrones de diseño',
          spacing: { after: 300 },
          indent: { left: 400 },
        }),

        new PageBreak(),

        // SECCIÓN 5: REFLEXIÓN
        new Paragraph({
          text: '5. REFLEXIÓN Y APRENDIZAJES',
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 },
          border: {
            bottom: {
              color: '4472C4',
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        }),

        new Paragraph({
          text: '✅ Lecciones Aprendidas',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: '1. Testing es Inversión, No Carga',
          heading: HeadingLevel.HEADING_3,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: 'Inicialmente, escribir 68 tests parecía tedioso. Luego comprendí que cada test es una inversión que:',
          spacing: { after: 100 },
          indent: { left: 200 },
        }),
        new Paragraph({
          text: '→ Previene regresiones cuando modificas código',
          spacing: { after: 50 },
          indent: { left: 600 },
        }),
        new Paragraph({
          text: '→ Sirve como documentación viva',
          spacing: { after: 50 },
          indent: { left: 600 },
        }),
        new Paragraph({
          text: '→ Permite refactorizar con confianza',
          spacing: { after: 150 },
          indent: { left: 600 },
        }),

        new Paragraph({
          text: '2. La Seguridad No es Opcional',
          heading: HeadingLevel.HEADING_3,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: 'Pequeños detalles (como validar entrada o limpiar logs) marcan la diferencia entre código amateur y profesional. La seguridad debe ser construida desde el inicio, no añadida después.',
          spacing: { after: 200 },
          indent: { left: 200 },
        }),

        new Paragraph({
          text: '❌ Desafíos Enfrentados',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: 'Entender Mocking y Async en Tests',
          heading: HeadingLevel.HEADING_3,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: 'Los conceptos de mocking y promesas asincrónicas fueron complejos. La IA me enseñó cómo aislar el código para tests efectivos y escribir assertions que verifiquen comportamiento, no implementación. Este aprendizaje mejoró significativamente la calidad de los tests.',
          spacing: { after: 200 },
          indent: { left: 200 },
        }),

        new Paragraph({
          text: 'Pensar en Casos Extremos',
          heading: HeadingLevel.HEADING_3,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: 'Anticipar todos los posibles errores fue un reto. La IA sugirió tests para:',
          spacing: { after: 100 },
          indent: { left: 200 },
        }),
        new Paragraph({
          text: '• Coordenadas inválidas o fuera de rango',
          spacing: { after: 50 },
          indent: { left: 600 },
        }),
        new Paragraph({
          text: '• Datos corruptos en localStorage',
          spacing: { after: 50 },
          indent: { left: 600 },
        }),
        new Paragraph({
          text: '• Timeouts y errores de servidor',
          spacing: { after: 50 },
          indent: { left: 600 },
        }),
        new Paragraph({
          text: '• Navegadores sin soporte para localStorage',
          spacing: { after: 200 },
          indent: { left: 600 },
        }),

        new Paragraph({
          text: 'Mantener Documentación Sincronizada',
          heading: HeadingLevel.HEADING_3,
          spacing: { after: 100 },
        }),
        new Paragraph({
          text: 'Aprendí que JSDoc integrado en el código es más mantenible que documentación externa, y que los tests sirven como ejemplos prácticos de uso.',
          spacing: { after: 300 },
          indent: { left: 200 },
        }),

        new PageBreak(),

        // SECCIÓN 6: ORGULLO
        new Paragraph({
          text: '6. LOGROS Y ORGULLO',
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 },
          border: {
            bottom: {
              color: '4472C4',
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        }),

        new Paragraph({
          text: '🏆 Lo que Más Me Enorgullece',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: 'Alcanzar 100% de Tests Pasando con 85%+ de Cobertura',
          heading: HeadingLevel.HEADING_3,
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: 'Este logro representa mucho más que números. Significa que:',
          spacing: { after: 150 },
          indent: { left: 200 },
        }),

        new Paragraph({
          text: '✅ El código es confiable y predecible',
          spacing: { after: 50 },
          indent: { left: 600 },
        }),
        new Paragraph({
          text: '✅ Puedo hacer cambios sin miedo a romper funcionalidad',
          spacing: { after: 50 },
          indent: { left: 600 },
        }),
        new Paragraph({
          text: '✅ Otros desarrolladores pueden confiar en mi código',
          spacing: { after: 50 },
          indent: { left: 600 },
        }),
        new Paragraph({
          text: '✅ La aplicación está lista para producción',
          spacing: { after: 200 },
          indent: { left: 600 },
        }),

        new Paragraph({
          text: 'Otros Logros Destacados',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: '✓ Haber aprendido a trabajar efectivamente con IA como herramienta potenciadora',
          spacing: { after: 75 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '✓ Crear una aplicación con mejores prácticas desde el inicio',
          spacing: { after: 75 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '✓ Documentar cada paso del proceso de aprendizaje (13 archivos)',
          spacing: { after: 75 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '✓ Crear un portfolio project verdaderamente profesional',
          spacing: { after: 300 },
          indent: { left: 400 },
        }),

        new PageBreak(),

        // SECCIÓN 7: MEJORAS
        new Paragraph({
          text: '7. MEJORAS FUTURAS',
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 },
          border: {
            bottom: {
              color: '4472C4',
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        }),

        new Paragraph({
          text: '🎯 La Mejora Principal: Sistema de Pronóstico Avanzado',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: 'Implementar Pronóstico de 7 Días con Gráficas Interactivas',
          heading: HeadingLevel.HEADING_3,
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: '¿Por qué esta mejora?',
          spacing: { after: 100 },
        }),

        new Paragraph({
          text: 'Actualmente la aplicación muestra clima actual y pronóstico básico. Agregar gráficas de tendencias haría que sea mucho más valiosa:',
          spacing: { after: 150 },
          indent: { left: 200 },
        }),

        new Paragraph({
          text: '• Los usuarios podrían planificar viajes y actividades con precisión',
          spacing: { after: 50 },
          indent: { left: 600 },
        }),
        new Paragraph({
          text: '• Las gráficas mostrarían patrones de temperatura',
          spacing: { after: 50 },
          indent: { left: 600 },
        }),
        new Paragraph({
          text: '• Sería más competitiva con aplicaciones comerciales',
          spacing: { after: 50 },
          indent: { left: 600 },
        }),
        new Paragraph({
          text: '• Demostraría dominio de visualización de datos',
          spacing: { after: 200 },
          indent: { left: 600 },
        }),

        new Paragraph({
          text: 'Implementación:',
          heading: HeadingLevel.HEADING_3,
          spacing: { after: 100 },
        }),

        new Paragraph({
          text: '1. Extender Open-Meteo API para obtener pronóstico detallado',
          spacing: { after: 50 },
          indent: { left: 600 },
        }),
        new Paragraph({
          text: '2. Integrar Chart.js para gráficas interactivas',
          spacing: { after: 50 },
          indent: { left: 600 },
        }),
        new Paragraph({
          text: '3. Crear componentes reutilizables para visualización',
          spacing: { after: 50 },
          indent: { left: 600 },
        }),
        new Paragraph({
          text: '4. Extender tests para nueva funcionalidad',
          spacing: { after: 50 },
          indent: { left: 600 },
        }),
        new Paragraph({
          text: '5. Optimizar caché para almacenar pronósticos',
          spacing: { after: 200 },
          indent: { left: 600 },
        }),

        new Paragraph({
          text: 'Otras Mejoras Consideradas',
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 150 },
        }),

        new Paragraph({
          text: '📊 Alertas de Clima Severo (nevadas, tormentas, temperaturas extremas)',
          spacing: { after: 50 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '🌍 Soporte multiidioma (español, inglés, francés, etc.)',
          spacing: { after: 50 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '🎨 Temas oscuro/claro con preferencias del usuario',
          spacing: { after: 50 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '📍 Geolocación automática del navegador',
          spacing: { after: 50 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '📱 Aplicación móvil nativa (React Native o Flutter)',
          spacing: { after: 50 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '🔔 Notificaciones push para cambios drásticos de clima',
          spacing: { after: 300 },
          indent: { left: 400 },
        }),

        new PageBreak(),

        // CONCLUSIÓN
        new Paragraph({
          text: 'CONCLUSIÓN',
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 },
          border: {
            bottom: {
              color: '4472C4',
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        }),

        new Paragraph({
          text: 'Este proyecto demuestra que la calidad en el software no es un lujo sino una necesidad. Weather App es un testimonio de cómo trabajar con IA de manera inteligente puede potenciar capacidades de desarrollo sin crear dependencia.',
          spacing: { after: 200 },
          alignment: AlignmentType.JUSTIFIED,
        }),

        new Paragraph({
          text: 'Lo que aprendí:',
          spacing: { after: 100 },
        }),

        new Paragraph({
          text: '✓ La importancia de la calidad desde el inicio del proyecto',
          spacing: { after: 50 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '✓ Cómo la IA puede ser un socio estratégico en desarrollo',
          spacing: { after: 50 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '✓ Que el testing es una inversión, no un costo',
          spacing: { after: 50 },
          indent: { left: 400 },
        }),
        new Paragraph({
          text: '✓ Que la seguridad es responsabilidad de cada desarrollador',
          spacing: { after: 200 },
          indent: { left: 400 },
        }),

        new Paragraph({
          text: 'Este proyecto me ha preparado para contribuir a proyectos profesionales de alto nivel y continuar creciendo como desarrollador full-stack.',
          spacing: { after: 300 },
          alignment: AlignmentType.JUSTIFIED,
          run: new TextRun({
            italic: true,
          }),
        }),

        new Paragraph({
          text: '———',
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        }),

        new Paragraph({
          text: 'Generation Colombia',
          alignment: AlignmentType.CENTER,
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: 'Programa: Desarrollo Full Stack',
          alignment: AlignmentType.CENTER,
          spacing: { after: 50 },
        }),
        new Paragraph({
          text: 'Junio 2026',
          alignment: AlignmentType.CENTER,
        }),
      ],
    },
  ],
});

function createHighlightTable() {
  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: 'Métrica', run: new TextRun({ bold: true, color: 'FFFFFF' }) })],
            shading: { fill: '1F4E78' },
          }),
          new TableCell({
            children: [new Paragraph({ text: 'Valor', run: new TextRun({ bold: true, color: 'FFFFFF' }) })],
            shading: { fill: '1F4E78' },
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph('Tests Implementados')],
            shading: { fill: 'D9E1F2' },
          }),
          new TableCell({
            children: [new Paragraph({ text: '68 tests', run: new TextRun({ bold: true }) })],
            shading: { fill: 'D9E1F2' },
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph('Tests Pasando')],
          }),
          new TableCell({
            children: [new Paragraph({ text: '68/68 (100%)', run: new TextRun({ bold: true, color: '00B050' }) })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph('Cobertura de Código')],
            shading: { fill: 'D9E1F2' },
          }),
          new TableCell({
            children: [new Paragraph({ text: '85%+', run: new TextRun({ bold: true }) })],
            shading: { fill: 'D9E1F2' },
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph('Vulnerabilidades')],
          }),
          new TableCell({
            children: [new Paragraph({ text: '0 encontradas ✓', run: new TextRun({ bold: true, color: '00B050' }) })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph('GDPR/CCPA/LGPD')],
            shading: { fill: 'D9E1F2' },
          }),
          new TableCell({
            children: [new Paragraph({ text: 'Cumplimiento ✓', run: new TextRun({ bold: true, color: '00B050' }) })],
            shading: { fill: 'D9E1F2' },
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph('Documentación')],
          }),
          new TableCell({
            children: [new Paragraph({ text: '13 archivos, 100+ páginas', run: new TextRun({ bold: true }) })],
          }),
        ],
      }),
    ],
  });
}

async function generarDocumento() {
  const buffer = await Packer.toBuffer(doc);
  const filePath = path.join(__dirname, 'RESUMEN_PROYECTO_MEJORADO.docx');
  fs.writeFileSync(filePath, buffer);
  console.log('✅ Documento mejorado creado: RESUMEN_PROYECTO_MEJORADO.docx');
}

generarDocumento();
