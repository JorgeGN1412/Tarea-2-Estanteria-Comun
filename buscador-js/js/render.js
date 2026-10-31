const contenedor = document.querySelector('#resultados')

export function renderizarResultados(libros) {
  contenedor.replaceChildren()

  libros.forEach((libro) => {
    const tarjeta = document.createElement('div')
    tarjeta.className = 'card mb-3'

    const cuerpo = document.createElement('div')
    cuerpo.className = 'card-body'

    const titulo = document.createElement('h3')
    titulo.className = 'card-title h5'
    titulo.textContent = libro.title || 'Sin título'

    cuerpo.appendChild(titulo)
    tarjeta.appendChild(cuerpo)
    contenedor.appendChild(tarjeta)
  })
}