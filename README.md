# DITEON Web

Landing page oficial y portal web de presentación de **DITEON**, startup dedicada al desarrollo de software empresarial a medida, CRM, POS, ERP, gestión de inventario y automatización de procesos para negocios.

---

## 🚀 Stack Tecnológico

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite](https://vitejs.dev/)
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Tipografías**: Space Grotesk (Titulares) e Inter (Cuerpo)
- **Iconografía**: Google Material Symbols Outlined + Isotipos oficiales SVG/PNG

---

## 🛠️ Instalación y Desarrollo Local

### 1. Clonar el repositorio e instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia el archivo de ejemplo `.env.example` a `.env`:

```bash
cp .env.example .env
```

Configura los siguientes valores públicos:

```env
# URL de tu endpoint o webhook para recepción de leads de contacto
VITE_CONTACT_API_URL=https://api.tudominio.com/leads

# Número oficial de WhatsApp con código de país (ej. +51987654321)
VITE_WHATSAPP_NUMBER=+51987654321
```

> **Nota de seguridad**: Las variables con prefijo `VITE_` son públicas y se empaquetan en el frontend. Nunca coloques credenciales de base de datos o secretos privados en este archivo.

### 3. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación iniciará en `http://localhost:3000`.

### 4. Compilar para producción

```bash
npm run build
```

---

## 📁 Estructura del Proyecto

```text
├── public/                  # Favicons, isotipos de marca y archivos SEO (robots.txt, sitemap.xml)
├── src/
│   ├── components/          # Componentes modulares de la landing
│   │   ├── ContactModal.tsx # Diálogo accesible para solicitud de diagnóstico
│   │   ├── DiteonLogo.tsx   # Renderizador tipográfico y vectorial del logo oficial
│   │   ├── FaqAndCta.tsx    # Acordeón accesible de preguntas frecuentes y CTA
│   │   ├── Footer.tsx       # Pie de página institucional y navegación secundaria
│   │   ├── Header.tsx       # Barra de navegación principal y responsive drawer
│   │   ├── Hero.tsx         # Propuesta principal y dashboard interactivo demostrativo
│   │   ├── ProblemSolution.tsx # Comparativa de procesos tradicionales vs conectados
│   │   ├── ProcessAndWhy.tsx   # Metodología de 5 fases, diferenciales y marquee tecnológico
│   │   └── SolutionShowcase.tsx# Demostrador interactivo accesible por pestañas
│   ├── services/
│   │   ├── analytics.ts     # Event dispatcher desacoplado para tracking
│   │   ├── contactService.ts# Servicio para envío real de leads con validación y honeypot
│   │   └── whatsapp.ts      # Generador de enlaces seguros de WhatsApp
│   ├── types.ts             # Interfaces y tipos globales
│   ├── App.tsx              # Componente raíz con control de modales y contexto
│   ├── main.tsx             # Punto de entrada React
│   └── index.css            # Estilos globales, tokens de color y animaciones accesibles
├── .env.example             # Documentación de variables de entorno requeridas
├── package.json             # Manifiesto del proyecto y scripts
└── vite.config.ts           # Configuración de compilación Vite
```

---

## 🛡️ Seguridad y Accesibilidad

- **Formulario de contacto real**: Validación estricta en cliente, prevención de doble envío, campo *honeypot* invisible para mitigación de spam y manejo explícito de fallos de red sin simulación ficticia.
- **Accesibilidad (WCAG AA)**: Modales con *focus trap*, control total por teclado (`Tab`, `Shift+Tab`, `Escape`), etiquetas ARIA (`role="dialog"`, `role="tablist"`, `role="region"`, `aria-expanded`, `aria-selected`) y soporte para usuarios con `prefers-reduced-motion`.
- **SEO & Metadatos**: Integración de etiquetas Open Graph, Twitter Cards, `robots.txt`, `sitemap.xml` y marcado semántico JSON-LD `ProfessionalService`.

---

© 2026 DITEON. Todos los derechos reservados.
