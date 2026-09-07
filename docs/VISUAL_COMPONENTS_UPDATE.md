# Marquee, galería y fondos · DITEON

## Cambios

- `TechMarquee.tsx`: los seis SVG existentes aparecen en dos grupos de geometría idéntica, con traslación CSS lineal de 42 segundos. La copia está oculta para lectores de pantalla. Pausa por hover, foco y botón. Móvil/táctil y movimiento reducido muestran una única lista con desplazamiento horizontal nativo. Sin sombras, glow o 3D en los logos.
- `ModuleGallery.tsx`: cuadrícula uniforme de cuatro tarjetas dentro de «Galería de módulos», junto a «Recorrido guiado». Usa directamente `needs` de `src/config/experience.ts`: Organizar ventas, Controlar inventario, Automatizar tareas y Crear una plataforma. Títulos, descripciones y estados proceden de `label`, `description` y `benefits[0]`, sin duplicar textos. Los íconos Lucide y los acentos blue/coral/violet/navy se asignan por `need.id`; los fondos, bordes y tonos de texto derivan de los tokens de marca. Conserva «Datos de ejemplo», «Estado ilustrativo» y el layout existente. No añade rutas, screenshots, logos ni datos de clientes.
- `landing.css`: dos gradientes radiales morado/azul detrás de Ingeniería y el cierre. Respiración por opacidad de 28 segundos en escritorio, sin WebGL. Fondo estático en móvil o con movimiento reducido. Se conserva el óvalo original.
- Tipografía: General Sans para títulos, Inter para cuerpo e IBM Plex Mono para etiquetas, mediante tokens comunes y hojas de fuentes oficiales. Los componentes nuevos usan Lucide.

Los patrones se adaptaron a los componentes y estilos del proyecto, sin copiar implementaciones completas: [marquees de 21st](https://21st.dev/community/components/s/marquee), [galerías de 21st](https://21st.dev/community/components/s/gallery), [gradientes de 21st](https://21st.dev/community/gradients). Fuentes: [General Sans de Fontshare](https://www.fontshare.com/fonts/general-sans) y Google Fonts.

## Verificación disponible

- TypeScript: sin errores.
- Suite existente: 18 pruebas aprobadas.
- Build de producción: aprobado; Vite y la generación de metadatos terminan correctamente.
- Contraste calculado con el solapamiento máximo de ambos gradientes, máxima opacidad y los dos bordes del óvalo: mínimo 5,30:1 en los textos comprobados de Ingeniería y 4,66:1 en el cierre. Es una cota conservadora del fondo propuesto, no una certificación de toda la página.
- No se añadió JavaScript por frame, canvas, WebGL ni dependencias de componentes.

## Validación visual pendiente

En la entrega inicial, la vista previa arrancó, pero el navegador de revisión bloqueó su acceso con `ERR_BLOCKED_BY_CLIENT`. No se ejecutaron pruebas visuales en dos anchos y no se declara completado ese requisito. El PR #1 se integró posteriormente a `main`; esa integración no constituye evidencia de revisión visual.

Comprobar en **390 px y 1440 px**:

1. Carga de General Sans / Inter / IBM Plex Mono, cortes de texto y ausencia de desbordamiento de la página.
2. Abrir «Galería de módulos»: cuatro tarjetas completas, una columna en móvil y dos en escritorio. Volver al recorrido guiado y operar sus controles.
3. Marquee de escritorio: ciclo sin salto, pausa por hover/foco/botón; móvil: recorrer los seis logos por desplazamiento horizontal nativo.
4. Movimiento reducido: una sola lista de logos y fondos estáticos.
5. Legibilidad de Ingeniería y cierre en ambos extremos de la respiración; óvalo y botones conservan su composición.

No se debe registrar esta revisión como aprobada hasta ejecutarla en un navegador con acceso.
