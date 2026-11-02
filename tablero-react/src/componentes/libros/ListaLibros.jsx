import TarjetaLibro from './TarjetaLibro.jsx'

// Recibe únicamente los libros que pasaron los filtros de App.
function ListaLibros({ libros, onAvanzar, onQuitar }) {
  if (libros.length === 0) return <p>Ningún libro coincide con los filtros.</p>
  // key permite a React identificar cada tarjeta al agregar, cambiar o quitar libros.
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
