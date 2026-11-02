# Estantería Común

Tarea 2 de Programación Web Avanzada. El repositorio tiene dos aplicaciones independientes que implementan la misma interacción de lecturas.

## Requisitos

Node.js 20.19 o superior, npm, Python 3 (solo para servir la Parte A) y un navegador moderno. Las dependencias `node_modules` no se suben al repositorio.

## Parte A: buscador con JavaScript

En una terminal:

```powershell
cd buscador-js
npm install
npm run sass:build
python -m http.server 5500
```

Abrir `http://localhost:5500`. Para modificar Sass mientras se trabaja, abrir otra terminal dentro de `buscador-js` y ejecutar `npm run sass`, que recompila al guardar. La búsqueda y las portadas requieren internet; la lista de lecturas se mantiene en memoria y se vacía al recargar.

El formulario envía los datos a JSONPlaceholder, un servicio de prueba que simula el registro.

## Parte B: tablero con React

En otra terminal:

```powershell
cd tablero-react
npm install
npm run dev
```

Abrir la dirección que muestra Vite, normalmente `http://localhost:5173`. Para comprobar la compilación, ejecutar `npm run build`.

## Del DOM manual a React

En la Parte A, `buscador-js/js/main.js` recibe el clic de «Cambiar estado» mediante una sola escucha en la tabla. `buscador-js/js/lecturas.js` cambia el estado del libro guardado en memoria, y `buscador-js/js/render.js` actualiza precisamente el texto de esa fila y agrega una clase para animarla. Si cambiáramos solo el dato, la pantalla seguiría mostrando el estado anterior.

En la Parte B, `tablero-react/src/App.jsx` recibe la función `avanzar` desde la tarjeta por una prop. `setLibros` crea un arreglo nuevo con `map` y un objeto nuevo para el libro que cambia. React vuelve a ejecutar los componentes afectados y muestra el estado actualizado en `TarjetaLibro.jsx`. Ya no hace falta buscar la fila con `querySelector` ni cambiar su texto manualmente. El resumen y la lista filtrada se calculan a partir de `libros` durante el renderizado, así que permanecen sincronizados.

La documentación de depuración y las capturas están en `docs/`.
