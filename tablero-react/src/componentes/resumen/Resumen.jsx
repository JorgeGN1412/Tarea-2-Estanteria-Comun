// Recibe los conteos ya calculados en App y dibuja uno por estado.
function Resumen({ conteos }) {
  return (
    <div className="row text-center">
      {conteos.map(({ estado, cantidad }) => (
        <div className="col-4" key={estado}>
          <span className="resumen-numero d-block">{cantidad}</span>
          <span>{estado}</span>
        </div>
      ))}
    </div>
  )
}

export default Resumen
