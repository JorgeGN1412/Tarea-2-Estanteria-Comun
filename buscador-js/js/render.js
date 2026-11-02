const resultados = document.querySelector('#resultados')
const lista = document.querySelector('#lista-lecturas')

function nodo(etiqueta, clase = '', texto = null) {
  const elemento = document.createElement(etiqueta)
  elemento.className = clase
  if (texto !== null) elemento.textContent = texto
  return elemento
}

function portadaDe(libro) {
  return libro.cover_i
    ? `https://covers.openlibrary.org/b/id/${libro.cover_i}-M.jpg`
    : './img/sin-portada.svg'
}

export function renderizarResultados(libros) {
  resultados.replaceChildren()
  libros.forEach((libro) => {
    const columna = nodo('div', 'col-sm-6 col-lg-4')
    const tarjeta = nodo('article', 'card h-100 libro-card')
    const portada = nodo('img', 'libro-card__portada')
    portada.src = portadaDe(libro)
    portada.alt = `Portada de ${libro.title || 'libro sin título'}`
    portada.loading = 'lazy'
    const cuerpo = nodo('div', 'card-body d-flex flex-column')
    cuerpo.append(
      nodo('h3', 'card-title h5', libro.title || 'Sin título'),
      nodo('p', 'card-text', `Autor(es): ${libro.author_name?.join(', ') || 'No disponible'}`),
      nodo('p', 'card-text', `Primera publicación: ${libro.first_publish_year || 'No disponible'}`),
    )
    const acciones = nodo('div', 'd-flex gap-2 mt-auto')
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
  const imagen = nodo('img', 'img-fluid mb-3')
  imagen.src = portadaDe(libro)
  imagen.alt = `Portada de ${libro.title || 'libro sin título'}`
  contenido.append(
    imagen,
    nodo('h3', 'h5', libro.title || 'Sin título'),
    nodo('p', '', `Autor(es): ${libro.author_name?.join(', ') || 'No disponible'}`),
    nodo('p', '', `Primera publicación: ${libro.first_publish_year || 'No disponible'}`),
  )
  window.bootstrap.Modal.getOrCreateInstance(document.querySelector('#detalle-modal')).show()
}

export function agregarFila(libro, estado) {
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
  requestAnimationFrame(() => fila.classList.remove('lectura--entrada'))
}

export function actualizarFila(id, estado) {
  const fila = [...lista.rows].find((item) => item.dataset.id === id)
  if (!fila) return
  fila.querySelector('.estado-lectura').textContent = estado
  fila.classList.add('lectura--cambio')
  fila.addEventListener('animationend', () => fila.classList.remove('lectura--cambio'), { once: true })
}

export function quitarFila(id) {
  const fila = [...lista.rows].find((item) => item.dataset.id === id)
  if (!fila) return
  fila.classList.add('lectura--salida')
  fila.addEventListener('transitionend', () => fila.remove(), { once: true })
}
