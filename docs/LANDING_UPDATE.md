# Actualización de DITEON Digital · septiembre de 2026

## Implementado

La landing se reorganiza para explicar problemas, mostrar una solución y facilitar una consulta contextual. Conserva la identidad navy/azul/violeta/coral y las tipografías Space Grotesk e Inter.

| Área | Cambio |
| --- | --- |
| Hero | Composición dividida, interfaz ilustrativa, propuesta de valor y CTA visibles. |
| Soluciones | Cuatro necesidades con pestañas completas, beneficios, vistas y contacto preseleccionado. |
| Antes / después | Comparador manual de un mismo flujo comercial. |
| Producto | Demo de tres pasos con anterior/siguiente, selección directa, galería y detalle del alcance. |
| Ingeniería | Capas con beneficios y controles de teclado; sin estados de sincronización ficticios. |
| Metodología | Etapas y entregables legibles; sin la tarjeta sticky sobredimensionada en móvil. |
| Integraciones | Entradas, reglas y acciones conectadas con geometría estable; disposición vertical en móvil. |
| Diagnóstico | Tres preguntas opcionales y mensaje editable antes del envío. |
| Contacto móvil | Aparece tras el hero, conserva el interés y se oculta al abrir un diálogo. |
| Motion | Entrada sutil, revelado de secciones y flujo de conexiones; respeta movimiento reducido. |

## Fallos abordados en el código

- Confirmaciones falsas por respuestas HTTP exitosas con contenido inválido.
- Espera indefinida, bloqueo del cierre y resultados tardíos de solicitudes canceladas.
- Capa del modal debajo de la cabecera, foco inicial/errores/éxito y fondo interactivo.
- Formulario imposible de completar cuando falta configuración.
- Carga de Turnstile sin límite, reintentos fallidos y limpieza incompleta de widgets.
- Teléfonos compuestos solo por signos y enlaces de canales mal configurados.
- Pestañas sin paneles asociados o navegación de teclado completa.
- Menú móvil persistente tras cambiar de ancho y tema de cabecera dependiente de otra zona.
- IDs duplicados del logo, acumulación de CSS y reglas responsive que se sobrescribían.
- Recorte de vistas completas y descarga inicial de capturas pesadas: la experiencia activa usa interfaces HTML y SVG existentes.
- Sitemap relativo, alias TypeScript inconsistente, README y variable de contacto obsoletos.
- Pruebas basadas solo en hashes: sustituidas explícitamente por regresiones conductuales.

## Verificación

- TypeScript sin errores.
- 18 pruebas automatizadas: contrato/payload, datos opcionales, respuesta inválida, 4xx/5xx, tiempo límite, cancelación, validación y canales; renderizado real de React con un H1, IDs únicos, relaciones ARIA, anchors e imágenes locales existentes.
- Compilación de producción de Vite y generación de SEO.
- No se insertaron leads de prueba ni se cambiaron tablas, políticas, secretos o código del CRM privado.

## Límites que siguen abiertos

La vista previa arrancó, pero el navegador de revisión devolvió `ERR_BLOCKED_BY_CLIENT`. Por ello no se afirma haber pasado una revisión visual en navegador, pruebas de interacción móvil ni una certificación de accesibilidad. Las reglas responsive y relaciones accesibles están implementadas y las comprobaciones estáticas pasan; faltan las comprobaciones en un navegador con acceso.

El repositorio no incluye el backend de `capture-lead` ni las variables de producción. La recepción real en el CRM, verificación de Turnstile en servidor, CORS, antispam e idempotencia necesitan comprobarse en el entorno configurado. La confirmación explícita `success: true` debe coincidir con la respuesta del backend existente.

La publicación de este cambio no conecta por sí sola un receptor persistente de analítica ni añade atribución UTM al backend externo. Estos puntos necesitan proveedor y contrato confirmados. Canonical y sitemap dependen de un origen público configurado; la imagen social existente se conserva.
