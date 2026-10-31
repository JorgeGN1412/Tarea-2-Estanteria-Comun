import { buscarLibros } from './api.js'
import { renderizarResultados } from './render.js'

const formularioBusqueda = document.querySelector('#form-busqueda')
const campoBusqueda = document.querySelector('#texto-busqueda')
const estadoBusqueda = document.querySelector('#estado-busqueda')

formularioBusqueda.addEventListener('submit', async (evento) => {
  evento.preventDefault()
  mostrarEstado('Buscando libros...', 'info')

  try {
    const datos = await buscarLibros(campoBusqueda.value.trim())
    renderizarResultados(datos.docs)
    mostrarEstado(`Mostrando ${datos.docs.length} de ${datos.numFound} resultados.`, 'success')
  } catch (error) {
    mostrarEstado('No fue posible completar la búsqueda.', 'danger')
    console.error(error)
  }
})

function mostrarEstado(mensaje, tipo) {
  estadoBusqueda.textContent = mensaje
  estadoBusqueda.className = `alert alert-${tipo}`
}
