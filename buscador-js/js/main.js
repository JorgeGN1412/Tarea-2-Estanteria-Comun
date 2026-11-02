import { buscarLibros } from './api.js'
import { renderizarResultados, mostrarDetalle, agregarFila, actualizarFila, quitarFila } from './render.js'
import { agregarLectura, avanzarLectura, quitarLectura } from './lecturas.js'
// Ejecuta el código que prepara el formulario de propuestas.
import './formulario.js'

// Estos selectores conectan el JavaScript con los id de index.html.
const formulario = document.querySelector('#form-busqueda')
const estadoBusqueda = document.querySelector('#estado-busqueda')
const resultados = document.querySelector('#resultados')
const lista = document.querySelector('#lista-lecturas')
let librosActuales = [] // Respuesta de la búsqueda más reciente.

function mostrarEstado(mensaje, tipo) {
  estadoBusqueda.textContent = mensaje
  // Bootstrap colorea el aviso según tipo: info, success, warning o danger.
  estadoBusqueda.className = `alert alert-${tipo}`
}

formulario.addEventListener('submit', async (evento) => {
  // Evita que el formulario recargue la página.
  evento.preventDefault()
  const texto = document.querySelector('#texto-busqueda').value.trim()
  if (!texto) return
  mostrarEstado('Buscando libros...', 'info')
  // Quita las tarjetas anteriores mientras llega la nueva respuesta.
  resultados.replaceChildren()
  try {
    const datos = await buscarLibros(texto)
    // docs contiene los libros de esta página; numFound es el total de coincidencias.
    librosActuales = datos.docs
    renderizarResultados(librosActuales)
    const cantidad = librosActuales.length
    mostrarEstado(cantidad ? `Mostrando ${cantidad} de ${datos.numFound} resultados.` : 'No se encontraron libros.', cantidad ? 'success' : 'warning')
  } catch (error) {
    // Si falla la red o la API, dejamos vacíos los resultados actuales.
    librosActuales = []
    mostrarEstado('No fue posible completar la búsqueda. Intenta de nuevo.', 'danger')
    console.error(error)
  }
})

// Delegación: una sola escucha en el contenedor sirve para todas las tarjetas.
resultados.addEventListener('click', (evento) => {
  // closest encuentra el botón aunque se haya pulsado un elemento dentro de él.
  const boton = evento.target.closest('button[data-accion]')
  if (!boton || !resultados.contains(boton)) return
  evento.stopPropagation()
  // El id del botón permite recuperar el libro completo recibido de la API.
  const libro = librosActuales.find((item) => item.key === boton.dataset.id)
  if (!libro) return
  if (boton.dataset.accion === 'detalle') mostrarDetalle(libro)
  if (boton.dataset.accion === 'agregar') {
    if (agregarLectura(libro)) agregarFila(libro, 'Pendiente')
    else mostrarEstado('Ese libro ya está en tu lista.', 'warning')
  }
})

// La lista también usa delegación porque sus filas se crean dinámicamente.
lista.addEventListener('click', (evento) => {
  const boton = evento.target.closest('button[data-accion]')
  if (!boton || !lista.contains(boton)) return
  evento.stopPropagation()
  const id = boton.closest('tr').dataset.id
  if (boton.dataset.accion === 'avanzar') {
    // Primero cambia el dato guardado; después actualiza la fila visible.
    const estado = avanzarLectura(id)
    if (estado) actualizarFila(id, estado)
  }
  if (boton.dataset.accion === 'quitar' && quitarLectura(id)) quitarFila(id)
})
