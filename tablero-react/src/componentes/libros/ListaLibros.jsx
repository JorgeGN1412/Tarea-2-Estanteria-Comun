import TarjetaLibro from './TarjetaLibro.jsx'

function ListaLibros({ libros, onAvanzar, onQuitar }) {
  if (libros.length === 0) return <p>Ningún libro coincide con los filtros.</p>
  return (
    <div className="row g-3">
      {libros.map((libro) => (
        <div className="col-md-6" key={libro.id}>
          <TarjetaLibro libro={libro} onAvanzar={onAvanzar} onQuitar={onQuitar} />
        </div>
      ))}
    </div>
  )
}

export default ListaLibros
