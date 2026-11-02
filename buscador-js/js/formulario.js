// Referencias a los elementos del formulario definidos en index.html.
const formulario = document.querySelector('#form-propuesta')
const autores = document.querySelector('#autores-campos')
const agregar = document.querySelector('#agregar-autor')
const estado = document.querySelector('#estado-propuesta')
let siguienteAutor = 1 // Da un id diferente a cada campo agregado.

// El input de fecha compara cadenas en formato AAAA-MM-DD.
function hoyLocal() {
  const fecha = new Date()
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}`
}

function crearAutor() {
  // Crea un campo de autor junto con su botón Quitar y su mensaje de error.
  const fila = document.createElement('div')
  fila.className = 'input-group mt-2'
  const campo = document.createElement('input')
  campo.className = 'form-control'
  campo.name = 'autores'
  campo.id = `autor-${siguienteAutor++}`
  campo.placeholder = 'Nombre del autor'
  campo.setAttribute('aria-label', 'Nombre del autor')
  campo.required = true
  campo.minLength = 2
  const quitar = document.createElement('button')
  quitar.type = 'button'
  quitar.className = 'btn btn-outline-danger'
  quitar.textContent = 'Quitar'
  quitar.dataset.accion = 'quitar-autor'
  const error = document.createElement('div')
  error.className = 'invalid-feedback'
  fila.append(campo, quitar, error)
  autores.appendChild(fila)
  actualizarBotones()
}

function actualizarBotones() {
  // La consigna permite entre uno y cinco autores.
  const cantidad = autores.querySelectorAll('input').length
  agregar.disabled = cantidad >= 5
  autores.querySelectorAll('button').forEach((boton) => { boton.disabled = cantidad <= 1 })
}

function mostrarMensaje(texto, tipo) {
  estado.textContent = texto
  // alert-* es una clase de Bootstrap para el color del aviso.
  estado.className = `alert alert-${tipo} mt-3`
}

function validarCampo(campo) {
  // Borra el error anterior antes de revisar el valor actual.
  campo.setCustomValidity('')
  // Estas dos reglas complementan required, min, minlength y type del HTML.
  if (campo.name === 'anio' && campo.value && Number(campo.value) > new Date().getFullYear()) {
    campo.setCustomValidity('El año no puede ser futuro.')
  }
  if (campo.name === 'fecha' && campo.value && campo.value < hoyLocal()) {
    campo.setCustomValidity('La sesión no puede ser anterior a hoy.')
  }
  // validity informa cuál restricción nativa incumple el campo.
  const mensaje = campo.validity.customError ? campo.validationMessage
    : campo.validity.valueMissing ? 'Este campo es obligatorio.'
    : campo.validity.typeMismatch ? 'Escribe un correo válido.'
    : campo.validity.tooShort ? `Escribe al menos ${campo.minLength} caracteres.`
    : campo.validity.rangeUnderflow ? `El mínimo permitido es ${campo.min}.`
    : campo.validity.rangeOverflow ? `El máximo permitido es ${campo.max}.`
    : campo.validity.badInput ? 'Escribe un número válido.'
    : ''
  campo.classList.toggle('is-invalid', Boolean(mensaje))
  // Los autores tienen su error junto al input; los demás usan data-error.
  const error = campo.name === 'autores'
    ? campo.parentElement.querySelector('.invalid-feedback')
    : formulario.querySelector(`[data-error="${campo.name}"]`)
  error.textContent = mensaje
  return !mensaje
}

agregar.addEventListener('click', crearAutor)
// Una sola escucha atiende los botones Quitar creados dinámicamente.
autores.addEventListener('click', (evento) => {
  const boton = evento.target.closest('button[data-accion="quitar-autor"]')
  if (!boton || autores.querySelectorAll('input').length <= 1) return
  boton.parentElement.remove()
  actualizarBotones()
})

// Valida de nuevo el campo que la persona acaba de modificar.
formulario.addEventListener('input', (evento) => {
  if (evento.target.matches('input, textarea')) validarCampo(evento.target)
})

formulario.addEventListener('submit', async (evento) => {
  // Evita la recarga y revisa todos los campos antes de enviar.
  evento.preventDefault()
  const campos = [...formulario.querySelectorAll('input, textarea')]
  const valido = campos.map(validarCampo).every(Boolean)
  if (!valido) {
    mostrarMensaje('Revisa los campos marcados.', 'danger')
    return
  }
  // FormData reúne los valores; autores se convierte en un arreglo de nombres.
  const propuesta = Object.fromEntries(new FormData(formulario))
  propuesta.autores = [...autores.querySelectorAll('input')].map((campo) => campo.value.trim())
  mostrarMensaje('Enviando propuesta...', 'info')
  try {
    // JSONPlaceholder simula recibir la propuesta; no la guarda en nuestra app.
    const respuesta = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(propuesta),
    })
    if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status}`)
    mostrarMensaje('Propuesta enviada correctamente (servicio de prueba).', 'success')
    // Restablece el formulario y deja nuevamente un solo campo de autor.
    formulario.reset()
    autores.replaceChildren()
    crearAutor()
    campos.forEach((campo) => campo.classList.remove('is-invalid'))
  } catch (error) {
    // Un fallo de red o del servicio se comunica sin borrar lo escrito.
    mostrarMensaje('No se pudo enviar la propuesta. Intenta de nuevo.', 'danger')
    console.error(error)
  }
})

// Estas restricciones se calculan al abrir la página, no quedan fijas en el HTML.
document.querySelector('#anio').max = new Date().getFullYear()
document.querySelector('#fecha').min = hoyLocal()
crearAutor()
