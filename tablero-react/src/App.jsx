import { useState } from 'react'
import { librosIniciales, estados } from './data/libros.js'
import Panel from './componentes/comunes/Panel.jsx'
import ListaLibros from './componentes/libros/ListaLibros.jsx'
import Filtros from './componentes/filtros/Filtros.jsx'
import Resumen from './componentes/resumen/Resumen.jsx'
import FormularioLibro from './componentes/libros/FormularioLibro.jsx'

let siguienteId = 5

function App() {
  const [libros, setLibros] = useState(librosIniciales)
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [filtroMiembro, setFiltroMiembro] = useState('Todos')

  // Estos valores se calculan a partir del estado; no necesitan otro useState.
  const visibles = libros.filter((libro) =>
    (filtroEstado === 'Todos' || libro.estado === filtroEstado) &&
    (filtroMiembro === 'Todos' || libro.miembro === filtroMiembro),
  )
  const conteos = estados.map((estado) => ({
    estado,
    cantidad: libros.filter((libro) => libro.estado === estado).length,
  }))

  function avanzar(id) {
    setLibros((actuales) => actuales.map((libro) => {
      if (libro.id !== id) return libro
      const indice = estados.indexOf(libro.estado)
      return { ...libro, estado: estados[(indice + 1) % estados.length] }
    }))
  }

  function quitar(id) {
    setLibros((actuales) => actuales.filter((libro) => libro.id !== id))
  }

  function agregar(libro) {
    const nuevo = { ...libro, id: `libro-${siguienteId++}` }
    setLibros((actuales) => [...actuales, nuevo])
  }

  return (
    <>
      <nav className="navbar bg-primary" data-bs-theme="dark">
        <div className="container"><span className="navbar-brand fw-bold">Estantería Común</span></div>
      </nav>
      <main className="container py-4">
        <h1>Tablero de lecturas</h1>
        <p className="lead">Libros propuestos por miembros del club.</p>
        <Panel titulo="Agregar libro"><FormularioLibro onAgregar={agregar} /></Panel>
        <div className="row g-3">
          <div className="col-lg-8">
            <Panel titulo="Filtros">
              <Filtros estado={filtroEstado} miembro={filtroMiembro}
                onCambiarEstado={setFiltroEstado} onCambiarMiembro={setFiltroMiembro} />
            </Panel>
            <Panel titulo="Libros del club">
              <ListaLibros libros={visibles} onAvanzar={avanzar} onQuitar={quitar} />
            </Panel>
          </div>
          <div className="col-lg-4">
            <Panel titulo="Resumen"><Resumen conteos={conteos} /></Panel>
          </div>
        </div>
      </main>
    </>
  )
}

export default App
