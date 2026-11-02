// Los libros se mantienen en memoria durante esta sesión, sin base de datos.
const lecturas = []
const estados = ['Pendiente', 'Leyendo', 'Leído']

export function agregarLectura(libro) {
  if (lecturas.some((item) => item.key === libro.key)) return false
  lecturas.push({ ...libro, estado: 'Pendiente' })
  return true
}

export function avanzarLectura(id) {
  const lectura = lecturas.find((item) => item.key === id)
  if (!lectura) return null
  lectura.estado = estados[(estados.indexOf(lectura.estado) + 1) % estados.length]
  return lectura.estado
}

export function quitarLectura(id) {
  const indice = lecturas.findIndex((item) => item.key === id)
  if (indice < 0) return false
  lecturas.splice(indice, 1)
  return true
}
