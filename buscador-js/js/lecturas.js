// Los libros se mantienen en memoria durante esta sesión, sin base de datos.
const lecturas = []
const estados = ['Pendiente', 'Leyendo', 'Leído']

export function agregarLectura(libro) {
  // key identifica la obra en Open Library y evita agregarla dos veces.
  if (lecturas.some((item) => item.key === libro.key)) return false
  // La copia conserva los datos de la API y añade el estado local.
  lecturas.push({ ...libro, estado: 'Pendiente' })
  return true
}

export function avanzarLectura(id) {
  const lectura = lecturas.find((item) => item.key === id)
  if (!lectura) return null
  // El módulo (%) vuelve a Pendiente después de Leído.
  lectura.estado = estados[(estados.indexOf(lectura.estado) + 1) % estados.length]
  return lectura.estado
}

export function quitarLectura(id) {
  const indice = lecturas.findIndex((item) => item.key === id)
  if (indice < 0) return false
  // splice elimina un elemento del arreglo en esa posición.
  lecturas.splice(indice, 1)
  return true
}
