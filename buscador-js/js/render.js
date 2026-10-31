// Busca en index.html el elemento con id="resultados".
// Ahí colocaremos las tarjetas de los libros.
const contenedor = document.querySelector('#resultados')

// Recibe un arreglo de libros y crea una tarjeta por cada uno.
// "export" permite usar esta función desde main.js.
export function renderizarResultados(libros) {
  // Borra los resultados de una búsqueda anterior.
  contenedor.replaceChildren()

  // Recorre el arreglo: "libro" representa un libro en cada vuelta.
  libros.forEach((libro) => {
    // Crea el elemento exterior de la tarjeta.
    const tarjeta = document.createElement('div')
    tarjeta.className = 'card mb-3'

    // Crea una sección interior para el contenido de la tarjeta.
    const cuerpo = document.createElement('div')
    cuerpo.className = 'card-body'

    // Crea un elemento <img> para la portada.
    const portada = document.createElement('img')
    portada.className = 'd-block mx-auto mt-3'
    portada.width = 160
    portada.height = 220

    // Describe la imagen para quien no pueda verla.
    portada.alt = `Portada de ${libro.title || 'libro sin título'}`

    // cover_i es el identificador de portada que envía Open Library.
    // Si no existe, usamos la imagen alternativa guardada en el proyecto.
    portada.src = libro.cover_i
      ? `https://covers.openlibrary.org/b/id/${libro.cover_i}-M.jpg`
      : './img/sin-portada.svg'

    // Crea el título del libro.
    const titulo = document.createElement('h3')
    titulo.className = 'card-title h5'

    // Usa el título recibido de la API; si falta, muestra "Sin título".
    titulo.textContent = libro.title || 'Sin título'

    // Crea un párrafo para los autores.
    const autores = document.createElement('p')
    autores.className = 'card-text'

    // author_name suele ser un arreglo. join(', ') une sus nombres.
    // ?. evita un error si author_name no existe.
    autores.textContent =
      `Autor(es): ${libro.author_name?.join(', ') || 'No disponible'}`

    // Crea un párrafo para el año de primera publicación.
    const anio = document.createElement('p')
    anio.className = 'card-text'
    anio.textContent =
      `Primera publicación: ${libro.first_publish_year || 'No disponible'}`

    // Mete título, autores y año dentro del cuerpo, en ese orden.
    cuerpo.appendChild(titulo)
    cuerpo.appendChild(autores)
    cuerpo.appendChild(anio)

    // Mete primero la portada y luego el cuerpo dentro de la tarjeta.
    tarjeta.appendChild(portada)
    tarjeta.appendChild(cuerpo)

    // Mete la tarjeta terminada en la sección de resultados de la página.
    contenedor.appendChild(tarjeta)
  })
}