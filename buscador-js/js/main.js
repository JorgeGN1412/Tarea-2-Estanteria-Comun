import { buscarLibros } from './api.js'
import { renderizarResultados, mostrarDetalle, agregarFila, actualizarFila, quitarFila } from './render.js'
import { agregarLectura, avanzarLectura, quitarLectura } from './lecturas.js'

const formulario = document.querySelector('#form-busqueda')
const estadoBusqueda = document.querySelector('#estado-busqueda')
const resultados = document.querySelector('#resultados')
const lista = document.querySelector('#lista-lecturas')
let librosActuales = []

function mostrarEstado(mensaje, tipo) {
  estadoBusqueda.textContent = mensaje
  estadoBusqueda.className = `alert alert-${tipo}`
}

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault()
  const texto = document.querySelector('#texto-busqueda').value.trim()
  if (!texto) return
  mostrarEstado('Buscando libros...', 'info')
  resultados.replaceChildren()
  try {
    const datos = await buscarLibros(texto)
    librosActuales = datos.docs
    renderizarResultados(librosActuales)
    const cantidad = librosActuales.length
    mostrarEstado(cantidad ? `Mostrando ${cantidad} de ${datos.numFound} resultados.` : 'No se encontraron libros.', cantidad ? 'success' : 'warning')
  } catch (error) {
    librosActuales = []
    mostrarEstado('No fue posible completar la búsqueda. Intenta de nuevo.', 'danger')
    console.error(error)
  }
})

// Delegación: los botones se generan después de la búsqueda.
resultados.addEventListener('click', (evento) => {
  const boton = evento.target.closest('button[data-accion]')
  if (!boton || !resultados.contains(boton)) return
  evento.stopPropagation()
  const libro = librosActuales.find((item) => item.key === boton.dataset.id)
  if (!libro) return
  if (boton.dataset.accion === 'detalle') mostrarDetalle(libro)
  if (boton.dataset.accion === 'agregar') {
    if (agregarLectura(libro)) agregarFila(libro, 'Pendiente')
    else mostrarEstado('Ese libro ya está en tu lista.', 'warning')
  }
})

// Una única escucha para cambiar estado y quitar libros de la tabla.
lista.addEventListener('click', (evento) => {
  const boton = evento.target.closest('button[data-accion]')
  if (!boton || !lista.contains(boton)) return
  evento.stopPropagation()
  const id = boton.closest('tr').dataset.id
  if (boton.dataset.accion === 'avanzar') {
    const estado = avanzarLectura(id)
    if (estado) actualizarFila(id, estado)
  }
  if (boton.dataset.accion === 'quitar' && quitarLectura(id)) quitarFila(id)
})
