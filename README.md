# DITEON Digital

Landing pública de DITEON para presentar soluciones de software a medida y captar consultas. Este repositorio no contiene el CRM privado ni el backend de recepción de leads.

## Desarrollo

Requiere Node.js 22 o superior y npm. El lockfile está versionado para instalaciones reproducibles.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

```bash
npm run lint          # TypeScript
npm test              # Contrato de envío, validación, renderizado y enlaces
npm run verify:form   # Regresión del contrato capture-lead
npm run build         # Producción en dist/, robots y SEO según el origen configurado
```

## Experiencia

- Hero con una interfaz ilustrativa y propuesta centrada en la operación del negocio.
- Selector de necesidades: ventas, inventario, automatización y plataforma a medida.
- Comparación del mismo proceso antes y después de conectarlo.
- Demo guiada de tres pasos, galería manual de módulos y detalle del alcance de ejemplo.
- Capas de ingeniería, metodología con entregables y ejemplos de integraciones.
- Diagnóstico opcional de tres preguntas; sus respuestas se pueden revisar en el mensaje antes de enviar.
- Contacto contextual y barra móvil que conserva la solución elegida.
- Pestañas con flechas, Home y End; diálogos nativos con Escape y restauración de foco; movimiento reducido.

Los datos de las demos son ilustrativos. No se presentan como clientes, resultados o integraciones en funcionamiento.

## Configuración del contacto

Las variables `VITE_` son públicas y se incorporan al compilar. Configúralas en el entorno de despliegue y vuelve a compilar tras cambiarlas.

| Variable | Uso |
| --- | --- |
| `VITE_CAPTURE_LEAD_FUNCTION_URL` | Endpoint HTTPS existente que recibe la consulta. Obligatorio para el formulario. |
| `VITE_TURNSTILE_SITE_KEY` | Clave pública de Cloudflare Turnstile. Obligatoria para el formulario. |
| `VITE_WHATSAPP_NUMBER` | Número oficial con prefijo internacional. Opcional. |
| `VITE_CONTACT_EMAIL` / `VITE_CONTACT_PHONE` | Canales oficiales alternativos. Opcionales. |
| `VITE_LINKEDIN_URL` / `VITE_INSTAGRAM_URL` / `VITE_CALENDLY_URL` | URLs HTTPS oficiales. Opcionales. |
| `VITE_SITE_URL` | Origen público HTTPS, sin rutas. Se usa para canonical y sitemap. |

`VITE_CONTACT_API_URL` es obsoleta y no se utiliza. El cliente opcional de `src/lib/supabase.ts` no participa en el flujo activo de esta landing. No hace falta introducir claves privadas o credenciales del CRM en el frontend.

Si falta endpoint o clave pública de Turnstile, la interfaz informa de la indisponibilidad y muestra solo canales válidos realmente configurados. No simula una recepción exitosa.

### Contrato con el backend existente

`ContactModal → submitContactLead → POST VITE_CAPTURE_LEAD_FUNCTION_URL`.

El cuerpo conserva las claves `full_name`, `company_name`, `email`, `phone`, `service_interest`, `message`, `source`, `turnstile_token` y `website_hp`. `source` es `landing`; los textos opcionales vacíos se envían como `null`. Los valores de soluciones se mantienen en `src/config/solutionOptions.ts`.

La confirmación exige **HTTP 2xx y un objeto JSON con `success: true`**. No se exige un ID nuevo ni se muestran errores internos del servidor. HTML, JSON malformado, `null`, 204 o respuestas sin confirmación dejan un error recuperable.

La espera tiene un límite de 15 segundos y se puede cerrar el diálogo mientras se envía. Cancelar la espera no revierte una inserción que el servidor ya haya realizado. No hay reintentos automáticos. Ante error se conservan los campos y se solicita una nueva verificación.

El backend debe verificar Turnstile, validar los campos y el honeypot, limitar abuso y aplicar CORS para el origen público. Esas funciones no están en este repositorio y no se modificaron. Referencias oficiales: [renderizado de Turnstile](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/), [validación en servidor](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).

## SEO y medición

`scripts/generate-seo.mjs` genera URLs absolutas a partir de `VITE_SITE_URL` o del hostname de producción `VERCEL_PROJECT_PRODUCTION_URL`. Si no existe origen confirmado, genera robots válido sin inventar un dominio ni un sitemap relativo. Se mantienen las imágenes sociales existentes.

`trackEvent` emite `diteon_analytics` con eventos de intención, demo, diagnóstico y formulario, sin enviar nombre, teléfono, correo ni texto libre. Es un punto de integración; **no es almacenamiento de analítica**. Conectar un proveedor y validar recepción sigue requiriendo la configuración de ese proveedor. No se añadieron campos UTM al contrato externo sin verificar su soporte.

## Organización

- `src/config/experience.ts`: necesidades, textos y tipo de apertura del contacto.
- `src/components/`: secciones de la landing y flujos de contacto.
- `src/components/ui/Modal.tsx` y `Tabs.tsx`: primitivas compartidas accesibles.
- `src/services/contactTransport.ts`: contrato HTTP, confirmación y cancelación.
- `src/services/contactValidation.ts`: reglas de validación reutilizadas por formulario y canales.
- `src/styles/tokens.css` y `landing.css`: identidad, componentes, responsive y movimiento.
- `tests/`: pruebas aisladas que ejercitan el código real, sin enviar leads a producción.

La verificación antigua por hashes congelaba los archivos defectuosos. `verify:form` ahora ejecuta pruebas conductuales del mismo contrato. Los cambios y límites de validación se detallan en [docs/LANDING_UPDATE.md](docs/LANDING_UPDATE.md).
