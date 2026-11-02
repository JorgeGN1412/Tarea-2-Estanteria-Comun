import { useState } from 'react'
import { miembros } from '../../data/libros.js'

const vacio = { titulo: '', autor: '', miembro: '' }

function FormularioLibro({ onAgregar }) {
  const [valores, setValores] = useState(vacio)
  const [errores, setErrores] = useState({})

  function cambiar(evento) {
    const { name, value } = evento.target
    setValores((actuales) => ({ ...actuales, [name]: value }))
    setErrores((actuales) => ({ ...actuales, [name]: '' }))
  }

  function enviar(evento) {
    evento.preventDefault()
    const nuevosErrores = {}
    if (valores.titulo.trim().length < 2) nuevosErrores.titulo = 'Escribe al menos 2 caracteres.'
    if (valores.autor.trim().length < 2) nuevosErrores.autor = 'Escribe al menos 2 caracteres.'
    if (!valores.miembro) nuevosErrores.miembro = 'Selecciona un miembro.'
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return
    onAgregar({
      titulo: valores.titulo.trim(),
      autor: valores.autor.trim(),
      miembro: valores.miembro,
      estado: 'Pendiente',
    })
    setValores(vacio)
  }

  return (
    <form onSubmit={enviar} noValidate className="row g-3">
      <div className="col-md-5">
        <label htmlFor="nuevo-titulo" className="form-label">Título</label>
        <input id="nuevo-titulo" name="titulo" className="form-control" value={valores.titulo} onChange={cambiar} />
        {errores.titulo && <small className="text-danger">{errores.titulo}</small>}
      </div>
      <div className="col-md-4">
        <label htmlFor="nuevo-autor" className="form-label">Autor</label>
        <input id="nuevo-autor" name="autor" className="form-control" value={valores.autor} onChange={cambiar} />
        {errores.autor && <small className="text-danger">{errores.autor}</small>}
      </div>
      <div className="col-md-3">
        <label htmlFor="nuevo-miembro" className="form-label">Miembro</label>
        <select id="nuevo-miembro" name="miembro" className="form-select" value={valores.miembro} onChange={cambiar}>
          <option value="">Seleccionar</option>
          {miembros.map((miembro) => <option key={miembro} value={miembro}>{miembro}</option>)}
        </select>
        {errores.miembro && <small className="text-danger">{errores.miembro}</small>}
      </div>
      <div className="col-12"><button type="submit" className="btn btn-primary">Agregar libro</button></div>
    </form>
  )
}

export default FormularioLibro
