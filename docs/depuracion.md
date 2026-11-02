# Depuración y rendimiento

## Error real: tablero React en blanco

Al abrir la Parte B durante la revisión final, la consola mostró `ReferenceError: React is not defined` en `src/main.jsx`. El proyecto ya tenía instalado `@vitejs/plugin-react`, pero faltaba `vite.config.js` para activarlo. Al agregar esa configuración y reiniciar Vite, el tablero se mostró. Se comprobó en el navegador que el formulario presenta errores por campo, agrega un libro, los filtros combinan estado y miembro, y el resumen cambia al actualizar un estado. `npm run build` terminó correctamente.

## Error real: importación de Bootstrap en JavaScript sin Vite

Al probar el buscador, la consola mostró `Failed to resolve module specifier "bootstrap/dist/js/bootstrap.bundle.min.js"`. El formulario no respondía porque `main.js` dejaba de ejecutarse antes de registrar el evento `submit`. El módulo se había importado usando el nombre del paquete, sintaxis que Vite resuelve en React pero que el navegador no resuelve directamente al servir archivos estáticos. Se eliminó esa importación y, al incorporar el modal, se cargó el bundle local con `<script src="./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js">` en `index.html`.

La consola permitió identificar el error. Tras retirar esa importación, se colocó un breakpoint en `const datos = await buscarLibros(texto)` (`main.js`, línea 24). Al buscar «Don Quijote», Chrome se detuvo allí y el panel Scope mostró `texto: "Don Quijote"`. La captura real está en [capturas/breakpoint-busqueda.png](capturas/breakpoint-busqueda.png).

## Panel de red

Se buscó «Don Quijote» en Chrome DevTools → Network, con «Disable cache» activado y el registro limpio antes de cada búsqueda. La medición cubre las peticiones de esa búsqueda, incluida `search.json` y las portadas. Los valores dependen del catálogo y del tamaño de la ventana.

| Medición | Peticiones | Peso transferido |
| --- | ---: | ---: |
| Portadas medianas (`-M.jpg`), sin `loading="lazy"` | 19 | 111 kB |
| Portadas pequeñas (`-S.jpg`), con `loading="lazy"` | 19 | 32.7 kB |

Capturas reales: [antes](capturas/network-antes.png) y [después](capturas/network-despues.png). La diferencia medida es de 78.3 kB, aproximadamente 70.5% menos transferencia. La cantidad de peticiones se mantuvo en 19.

## Optimización aplicada

En `buscador-js/js/render.js`, las tarjetas solicitan la portada pequeña (`S`), mientras que el modal conserva la mediana (`M`) para verla con más detalle. Las tarjetas también usan `loading = 'lazy'` para posponer portadas que aún no se ven. En esta prueba, `loading="lazy"` con portadas medianas produjo igualmente 19 solicitudes y 111 kB ([captura](capturas/network-con-lazy.png)); por tanto, la reducción observada se atribuye al tamaño de imagen solicitado, no a menos peticiones. La portada pequeña se ve menos nítida, que es el costo visual de esta optimización.

La captura «después» muestra un `favicon.ico 404` en Console. Se corrigió posteriormente al declarar el SVG local como ícono en `index.html`; ese error no afectaba la búsqueda.
