# Depuración y rendimiento

## Error real: tablero React en blanco

Al abrir la Parte B durante la revisión final, la consola mostró `ReferenceError: React is not defined` en `src/main.jsx`. El proyecto ya tenía instalado `@vitejs/plugin-react`, pero faltaba `vite.config.js` para activarlo. Al agregar esa configuración y reiniciar Vite, el tablero se mostró. Se comprobó en el navegador que el formulario presenta errores por campo, agrega un libro, los filtros combinan estado y miembro, y el resumen cambia al actualizar un estado. `npm run build` terminó correctamente.

## Error real: importación de Bootstrap en JavaScript sin Vite

Al probar el buscador, la consola mostró `Failed to resolve module specifier "bootstrap/dist/js/bootstrap.bundle.min.js"`. El formulario no respondía porque `main.js` dejaba de ejecutarse antes de registrar el evento `submit`. El módulo se había importado usando el nombre del paquete, sintaxis que Vite resuelve en React pero que el navegador no resuelve directamente al servir archivos estáticos. Se eliminó esa importación y, al incorporar el modal, se cargó el bundle local con `<script src="./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js">` en `index.html`.

La consola permitió identificar el error. Un breakpoint al inicio de `main.js` no se alcanzaba porque el navegador detenía el módulo durante la resolución del import. Tras retirar esa importación, un breakpoint en `const datos = await buscarLibros(texto)` sí permite seguir el flujo al enviar el formulario. **Pendiente:** reproducir y capturar el punto de interrupción en DevTools → Sources; guardar la imagen real en `docs/capturas/`. No se incluye una captura inventada.

## Panel de red

Medir en Chrome DevTools → Network, con «Disable cache» activado, tras recargar la Parte A y buscar un libro. Registrar el número de peticiones y el peso transferido que indique el panel. La búsqueda produce una petición a `search.json`; las portadas visibles originan peticiones adicionales. La cantidad exacta depende del catálogo y de cuántas imágenes se ven en pantalla.

| Medición | Peticiones | Peso transferido |
| --- | ---: | ---: |
| Antes de optimizar imágenes | Pendiente de medir en DevTools | Pendiente de medir |
| Después de optimizar imágenes | Pendiente de medir en DevTools | Pendiente de medir |

## Optimización aplicada

En `buscador-js/js/render.js` las portadas usan `loading = 'lazy'`. El navegador puede posponer la descarga de imágenes que todavía no son visibles, reduciendo peticiones y transferencia en la carga inicial. Para medir antes y después, comparar la misma búsqueda y el mismo tamaño de ventana con y sin esa línea, recargando con caché desactivada. Registrar aquí los valores observados y adjuntar capturas del panel Network. No afirmar una mejora numérica sin medirla.
