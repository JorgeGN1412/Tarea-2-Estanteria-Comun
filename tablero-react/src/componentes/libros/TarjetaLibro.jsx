// Muestra un libro; los botones llaman funciones que llegan desde App por props.
function TarjetaLibro({ libro, onAvanzar, onQuitar }) {
  return (
    <article className="card h-100 shadow-sm">
      <div className="card-body d-flex flex-column">
        <h3 className="card-title h5">{libro.titulo}</h3>
        <p className="card-text mb-1">Autor: {libro.autor}</p>
        <p className="card-text mb-1">Propuesto por: {libro.miembro}</p>
        <p className="card-text">Estado: <span className="badge text-bg-primary">{libro.estado}</span></p>
        <div className="d-flex gap-2 mt-auto">
          <button className="btn btn-outline-primary btn-sm" onClick={() => onAvanzar(libro.id)}>Cambiar estado</button>
          <button className="btn btn-outline-danger btn-sm" onClick={() => onQuitar(libro.id)}>Quitar</button>
        </div>
      </div>
    </article>
  )
}

export default TarjetaLibro
