import { estados, miembros } from '../../data/libros.js'

// App guarda los filtros; este componente solo muestra los selects y avisa cambios.
function Filtros({ estado, miembro, onCambiarEstado, onCambiarMiembro }) {
  return (
    <div className="row g-3">
      <div className="col-sm-6">
        <label htmlFor="filtro-estado" className="form-label">Estado</label>
        <select id="filtro-estado" className="form-select" value={estado} onChange={(evento) => onCambiarEstado(evento.target.value)}>
          <option value="Todos">Todos</option>
          {estados.map((opcion) => <option key={opcion} value={opcion}>{opcion}</option>)}
        </select>
      </div>
      <div className="col-sm-6">
        <label htmlFor="filtro-miembro" className="form-label">Miembro</label>
        <select id="filtro-miembro" className="form-select" value={miembro} onChange={(evento) => onCambiarMiembro(evento.target.value)}>
          <option value="Todos">Todos</option>
          {miembros.map((opcion) => <option key={opcion} value={opcion}>{opcion}</option>)}
        </select>
      </div>
    </div>
  )
}

export default Filtros
