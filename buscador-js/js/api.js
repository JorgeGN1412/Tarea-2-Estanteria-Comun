const API_URL = 'https://openlibrary.org/search.json'

// Esta función solo obtiene datos; main.js decide cómo mostrarlos.
export async function buscarLibros(texto) {
  // URLSearchParams codifica el texto y limita la respuesta a 12 libros.
  const parametros = new URLSearchParams({ q: texto, limit: '12' })
  const respuesta = await fetch(`${API_URL}?${parametros}`)

  // Un estado HTTP fallido pasa al catch de main.js.
  if (!respuesta.ok) {
    throw new Error(`La API respondió con estado ${respuesta.status}`)
  }

  // Convierte el JSON recibido en un objeto de JavaScript.
  return respuesta.json()
}
