import { useState } from 'react'
import { librosIniciales, estados } from './data/libros.js'
import Panel from './componentes/comunes/Panel.jsx'
import ListaLibros from './componentes/libros/ListaLibros.jsx'

function App() {
  const [libros, setLibros] = useState(librosIniciales)

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

  return (
    <>
      <nav className="navbar bg-primary" data-bs-theme="dark">
        <div className="container"><span className="navbar-brand fw-bold">Estantería Común</span></div>
      </nav>
      <main className="container py-4">
        <h1>Tablero de lecturas</h1>
        <p className="lead">Libros propuestos por miembros del club.</p>
        <Panel titulo="Libros del club">
          <ListaLibros libros={libros} onAvanzar={avanzar} onQuitar={quitar} />
        </Panel>
      </main>
    </>
  )
}

export default App
