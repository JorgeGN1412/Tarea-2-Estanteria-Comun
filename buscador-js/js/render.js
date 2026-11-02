const resultados = document.querySelector('#resultados')
const lista = document.querySelector('#lista-lecturas')

// Ayuda a crear elementos HTML sin repetir createElement en cada tarjeta.
function nodo(etiqueta, clase = '', texto = null) {
  const elemento = document.createElement(etiqueta)
  elemento.className = clase
  if (texto !== null) elemento.textContent = texto
  return elemento
}

// Open Library usa S para miniaturas y M para la vista del modal.
function portadaDe(libro, tamano) {
  return libro.cover_i
    ? `https://covers.openlibrary.org/b/id/${libro.cover_i}-${tamano}.jpg`
    : './img/sin-portada.svg'
}

function crearPortada(libro, clase, tamano = 'S') {
  const imagen = nodo('img', clase)
  imagen.src = portadaDe(libro, tamano)
  imagen.alt = `Portada de ${libro.title || 'libro sin título'}`
  // Si falta la imagen remota, muestra el SVG local una sola vez.
  imagen.onerror = () => {
    imagen.onerror = null
    imagen.src = './img/sin-portada.svg'
  }
  return imagen
}

export function renderizarResultados(libros) {
  // replaceChildren elimina los resultados de una búsqueda anterior.
  resultados.replaceChildren()
  // Cada objeto libro recibido de la API produce una tarjeta.
  libros.forEach((libro) => {
    const columna = nodo('div', 'col-sm-6 col-lg-4')
    const tarjeta = nodo('article', 'card h-100 libro-card')
    const portada = crearPortada(libro, 'libro-card__portada')
    portada.loading = 'lazy' // Pospone imágenes aún fuera de la vista.
    const cuerpo = nodo('div', 'card-body d-flex flex-column')
    cuerpo.append(
      nodo('h3', 'card-title h5', libro.title || 'Sin título'),
      nodo('p', 'card-text', `Autor(es): ${libro.author_name?.join(', ') || 'No disponible'}`),
      nodo('p', 'card-text', `Primera publicación: ${libro.first_publish_year || 'No disponible'}`),
    )
    const acciones = nodo('div', 'd-flex gap-2 mt-auto')
    // data-accion y data-id indican a main.js qué botón se pulsó.
    for (const [accion, texto, clase] of [
      ['detalle', 'Detalle', 'btn btn-outline-primary'],
      ['agregar', 'Agregar', 'btn btn-primary'],
    ]) {
      const boton = nodo('button', clase, texto)
      boton.type = 'button'
      boton.dataset.accion = accion
      boton.dataset.id = libro.key
      acciones.appendChild(boton)
    }
    cuerpo.appendChild(acciones)
    tarjeta.append(portada, cuerpo)
    columna.appendChild(tarjeta)
    resultados.appendChild(columna)
  })
}

export function mostrarDetalle(libro) {
  const contenido = document.querySelector('#detalle-contenido')
  contenido.replaceChildren()
  const imagen = crearPortada(libro, 'img-fluid mb-3', 'M')
  contenido.append(
    imagen,
    nodo('h3', 'h5', libro.title || 'Sin título'),
    nodo('p', '', `Autor(es): ${libro.author_name?.join(', ') || 'No disponible'}`),
    nodo('p', '', `Primera publicación: ${libro.first_publish_year || 'No disponible'}`),
  )
  // Bootstrap abre el modal definido en index.html.
  window.bootstrap.Modal.getOrCreateInstance(document.querySelector('#detalle-modal')).show()
}

export function agregarFila(libro, estado) {
  // La fila representa el libro guardado en lecturas.js.
  const fila = nodo('tr', 'lectura lectura--entrada')
  fila.dataset.id = libro.key
  const acciones = nodo('td')
  for (const [accion, texto, clase] of [
    ['avanzar', 'Cambiar estado', 'btn btn-sm btn-outline-primary me-2'],
    ['quitar', 'Quitar', 'btn btn-sm btn-outline-danger'],
  ]) {
    const boton = nodo('button', clase, texto)
    boton.type = 'button'
    boton.dataset.accion = accion
    acciones.appendChild(boton)
  }
  fila.append(nodo('td', '', libro.title || 'Sin título'), nodo('td', 'estado-lectura', estado), acciones)
  lista.appendChild(fila)
  // Al quitar la clase en el siguiente cuadro, CSS anima su entrada.
  requestAnimationFrame(() => fila.classList.remove('lectura--entrada'))
}

export function actualizarFila(id, estado) {
  // Busca la fila por el mismo id que usa lecturas.js.
  const fila = [...lista.rows].find((item) => item.dataset.id === id)
  if (!fila) return
  fila.querySelector('.estado-lectura').textContent = estado
  fila.classList.add('lectura--cambio')
  // Limpia la clase al terminar para poder animar el siguiente cambio.
  fila.addEventListener('animationend', () => fila.classList.remove('lectura--cambio'), { once: true })
}

export function quitarFila(id) {
  const fila = [...lista.rows].find((item) => item.dataset.id === id)
  if (!fila) return
  fila.classList.add('lectura--salida')
  // Elimina la fila del DOM cuando termina la transición de salida.
  fila.addEventListener('transitionend', () => fila.remove(), { once: true })
}
