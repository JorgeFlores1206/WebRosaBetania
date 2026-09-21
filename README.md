# Industria Gráfica Rosa Betania

Sitio corporativo local con React, TypeScript, Vite y React Router. Seis páginas independientes: `/`, `/tecnologia`, `/productos`, `/impresion`, `/cotizacion` y `/contacto`, más una página 404. No se ha publicado ni desplegado.

## Ejecutar

Requiere Node.js 22.18+ (probado con 24.19) y npm.

```sh
npm install
npm run dev
```

Abrir http://127.0.0.1:5173/. En PowerShell con ejecución de scripts deshabilitada, utilizar `npm.cmd` en lugar de `npm`. Para guardar la caché dentro del proyecto: `npm.cmd install --cache ./.npm-cache`.

```sh
npm run build
npm run preview
npm test
```

La compilación queda en `dist/`. La vista previa usa http://127.0.0.1:4173/.

## Implementación

- Transiciones entre páginas, entradas suaves al recorrer el contenido y detalles animados en botones, enlaces y tarjetas. Cabecera fija y menú móvil animado que se cierra al pasar a escritorio.
- Carrusel con fundido entre fotografías nítidas, controles de 44 px, teclado y deslizamiento táctil. Espera a que la siguiente imagen esté lista y respeta los cambios de preferencia de movimiento reducido, sin reproducción automática.
- Identidad verde pino, tipografía Manrope alojada localmente, fotografías oficiales optimizadas a WebP y carrusel manual en la portada.
- Logotipo original conservado, variantes transparentes verde y clara, favicon extraído del símbolo original.
- Navegación real entre páginas, menú móvil con teclado y Escape, estado activo, enlace para saltar al contenido y foco al navegar.
- Catálogo filtrable con opción Todos; categoría en la URL. Las cotizaciones conservan producto y técnica al recargar mediante `producto` y `tipo`.
- Formulario con etiquetas, campos opcionales, errores por campo, foco en el primer error, cantidad positiva y bloqueo durante la generación.
- Títulos y descripciones por ruta, imágenes con espacio reservado, carga diferida y respeto a movimiento reducido.
- Teléfono, ubicación, horarios y Facebook provenientes del sitio oficial. No se agregó un correo ni WhatsApp no verificados.

## Cotizaciones: descarga funcional, envío pendiente

No existe backend ni servicio de envío configurado. «Descargar solicitud» genera un archivo TXT con los datos introducidos. No transmite la solicitud ni guarda datos personales en almacenamiento del navegador; al recargar se conservan únicamente las selecciones de categoría/técnica de la URL. El usuario debe entregar el archivo a la empresa; el teléfono oficial permite coordinarlo.

La validación y los datos están separados de la UI en `src/quote.ts`; el punto de integración es `download` en `src/pages/Quote.tsx`. Para habilitar envío real se necesita un endpoint de servidor autorizado y un destinatario oficial confirmado. El servidor debe revalidar `QuoteValues`, gestionar límites y duplicados y devolver una confirmación de recepción verificable. Cambiar el botón y los estados solamente después de conectar y probar ese endpoint. Las credenciales deben permanecer exclusivamente en el servidor. No hay respuestas de envío simulado ni integraciones activas.

## Verificaciones

`npm test` ejecuta seis pruebas de selección, validación y contenido de la solicitud. Con el servidor local iniciado y Google Chrome instalado:

```sh
node scripts/check-ui.mjs
node scripts/check-accessibility.mjs
npm run test:motion
```

Este recorrido comprueba las seis rutas a 1440, 768, 390 y 320 px; imágenes, desbordamientos, menú y teclado, filtros, persistencia tras recarga, descarga real y contenido, ausencia de envío de datos y recuperación 404. Guarda doce capturas y el informe en `test-results/` (ignorado por Git). `TEST_BASE_URL` permite probar la compilación con `npm run preview`.

La auditoría automática de accesibilidad utiliza axe con reglas WCAG 2 A/AA y 2.1 AA y guarda `test-results/accessibility.json`. Resultado de esta entrega: compilación correcta, seis pruebas unitarias aprobadas, recorrido de interfaz aprobado y cero infracciones detectadas por axe en las seis páginas, tanto a 1440 como a 390 px. Se revisaron visualmente las doce capturas. Una auditoría automática no sustituye una evaluación completa con usuarios y tecnologías de asistencia.

La comprobación de movimiento valida las transiciones con movimiento activado y reducido, cambios rápidos del carrusel, gestos táctiles, controles en cuatro anchos de pantalla, navegación y conservación del formulario al cambiar parámetros. Guarda el informe y cuatro capturas adicionales en `test-results/`.

## Alojamiento futuro y recargas directas

Este proyecto usa `BrowserRouter`: el alojamiento debe devolver `index.html` para rutas de aplicación que no correspondan a archivos reales. Vite ya lo hace localmente. Sin esta regla, una recarga en `/productos` puede producir un 404 del servidor.

Ejemplo Nginx, con `dist/` como raíz:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

En Apache, habilitar `mod_rewrite` y colocar en el directorio publicado:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

En alojamientos estáticos con reglas de reescritura, usar `/* /index.html 200`. No se ha ejecutado ninguna acción de publicación. Los metadatos se actualizan en el cliente; no se implementó renderizado de servidor ni prerenderizado.

## Fuentes y limitaciones

Consultar `docs/SOURCES.md`. Algunos recursos de maquinaria y el logotipo original son pequeños; se conservó su fidelidad sin inventar detalle. `scripts/prepare-assets.mjs` regenera WebP y favicon desde los recursos preservados. `scripts/source-audit.mjs` documenta los enlaces encontrados en la fuente oficial.
