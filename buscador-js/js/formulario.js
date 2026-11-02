const formulario = document.querySelector('#form-propuesta')
const autores = document.querySelector('#autores-campos')
const agregar = document.querySelector('#agregar-autor')
const estado = document.querySelector('#estado-propuesta')
let siguienteAutor = 1

function hoyLocal() {
  const fecha = new Date()
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}`
}

function crearAutor() {
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
  const cantidad = autores.querySelectorAll('input').length
  agregar.disabled = cantidad >= 5
  autores.querySelectorAll('button').forEach((boton) => { boton.disabled = cantidad <= 1 })
}

function mostrarMensaje(texto, tipo) {
  estado.textContent = texto
  estado.className = `alert alert-${tipo} mt-3`
}

function validarCampo(campo) {
  campo.setCustomValidity('')
  if (campo.name === 'anio' && campo.value && Number(campo.value) > new Date().getFullYear()) {
    campo.setCustomValidity('El año no puede ser futuro.')
  }
  if (campo.name === 'fecha' && campo.value && campo.value < hoyLocal()) {
    campo.setCustomValidity('La sesión no puede ser anterior a hoy.')
  }
  const mensaje = campo.validity.customError ? campo.validationMessage
    : campo.validity.valueMissing ? 'Este campo es obligatorio.'
    : campo.validity.typeMismatch ? 'Escribe un correo válido.'
    : campo.validity.tooShort ? `Escribe al menos ${campo.minLength} caracteres.`
    : campo.validity.rangeUnderflow ? `El mínimo permitido es ${campo.min}.`
    : campo.validity.rangeOverflow ? `El máximo permitido es ${campo.max}.`
    : campo.validity.badInput ? 'Escribe un número válido.'
    : ''
  campo.classList.toggle('is-invalid', Boolean(mensaje))
  const error = campo.name === 'autores'
    ? campo.parentElement.querySelector('.invalid-feedback')
    : formulario.querySelector(`[data-error="${campo.name}"]`)
  error.textContent = mensaje
  return !mensaje
}

agregar.addEventListener('click', crearAutor)
autores.addEventListener('click', (evento) => {
  const boton = evento.target.closest('button[data-accion="quitar-autor"]')
  if (!boton || autores.querySelectorAll('input').length <= 1) return
  boton.parentElement.remove()
  actualizarBotones()
})

formulario.addEventListener('input', (evento) => {
  if (evento.target.matches('input, textarea')) validarCampo(evento.target)
})

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault()
  const campos = [...formulario.querySelectorAll('input, textarea')]
  const valido = campos.map(validarCampo).every(Boolean)
  if (!valido) {
    mostrarMensaje('Revisa los campos marcados.', 'danger')
    return
  }
  const propuesta = Object.fromEntries(new FormData(formulario))
  propuesta.autores = [...autores.querySelectorAll('input')].map((campo) => campo.value.trim())
  mostrarMensaje('Enviando propuesta...', 'info')
  try {
    const respuesta = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(propuesta),
    })
    if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status}`)
    mostrarMensaje('Propuesta enviada correctamente (servicio de prueba).', 'success')
    formulario.reset()
    autores.replaceChildren()
    crearAutor()
    campos.forEach((campo) => campo.classList.remove('is-invalid'))
  } catch (error) {
    mostrarMensaje('No se pudo enviar la propuesta. Intenta de nuevo.', 'danger')
    console.error(error)
  }
})

document.querySelector('#anio').max = new Date().getFullYear()
document.querySelector('#fecha').min = hoyLocal()
crearAutor()
