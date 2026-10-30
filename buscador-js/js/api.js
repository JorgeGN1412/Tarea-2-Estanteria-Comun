const API_URL = 'https://openlibrary.org/search.json'

export async function buscarLibros(texto) {
  const parametros = new URLSearchParams({ q: texto, limit: '12' })
  const respuesta = await fetch(`${API_URL}?${parametros}`)

  if (!respuesta.ok) {
    throw new Error(`La API respondió con estado ${respuesta.status}`)
  }

  return respuesta.json()
}
