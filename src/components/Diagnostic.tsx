import { useId, useState } from 'react'
import { ArrowRight, ArrowLeft, Check, Compass } from 'lucide-react'
import { needs, type ContactHandler } from '../config/experience'
import { trackEvent } from '../services/analytics'

const currentTools = [
  'Hojas de cálculo',
  'WhatsApp y correo',
  'Un sistema que se quedó corto',
  'Estamos empezando',
]
const priorities = [
  'Reducir trabajo manual',
  'Tener más control',
  'Mejorar la atención al cliente',
]
export function Diagnostic({ onContact }: { onContact: ContactHandler }) {
  const [step, setStep] = useState(0)
  const [need, setNeed] = useState('')
  const [tool, setTool] = useState('')
  const [priority, setPriority] = useState('')
  const id = useId()
  const selection = step === 0 ? need : step === 1 ? tool : priority
  const title = [
    '¿Qué quieres ordenar primero?',
    '¿Cómo lo gestionas hoy?',
    '¿Qué te gustaría mejorar?',
  ][step]
  const options =
    step === 0
      ? needs.map((item) => ({ value: item.id, label: item.label }))
      : (step === 1 ? currentTools : priorities).map((label) => ({
          value: label,
          label,
        }))
  function next() {
    setStep((value) => value + 1)
    document.getElementById(`${id}-question`)?.focus({ preventScroll: true })
  }
  return (
    <section className="section diagnostic" id="diagnostico">
      <div className="shell diagnostic__layout">
        <div>
          <span className="eyebrow">
            <Compass size={16} /> Un primer mapa
          </span>
          <h2>
            ¿Por dónde
            <br />
            <em>empezamos?</em>
          </h2>
          <p>
            Tres preguntas para ponerle nombre a tu necesidad. Puedes compartir
            el resultado con nosotros al terminar.
          </p>
          <span className="diagnostic__note">
            Opcional · sin datos de contacto en este paso
          </span>
        </div>
        <div className="diagnostic__card">
          <div className="diagnostic__progress">
            <span>PREGUNTA {step + 1} DE 3</span>
            <div aria-hidden="true">
              {[0, 1, 2].map((index) => (
                <i key={index} className={index <= step ? 'is-active' : ''} />
              ))}
            </div>
          </div>
          <fieldset>
            <legend id={`${id}-question`} tabIndex={-1}>
              {title}
            </legend>
            <div className="diagnostic__options">
              {options.map((option) => (
                <label key={option.value}>
                  <input
                    type="radio"
                    name={`${id}-${step}`}
                    value={option.value}
                    checked={selection === option.value}
                    onChange={() => {
                      if (step === 0) setNeed(option.value)
                      else if (step === 1) setTool(option.value)
                      else setPriority(option.value)
                    }}
                  />
                  <span>{option.label}</span>
                  <Check size={17} />
                </label>
              ))}
            </div>
          </fieldset>
          <div className="diagnostic__actions">
            <button
              className="icon-button"
              disabled={step === 0}
              aria-label="Pregunta anterior"
              onClick={() => {
                setStep((value) => value - 1)
                document
                  .getElementById(`${id}-question`)
                  ?.focus({ preventScroll: true })
              }}
            >
              <ArrowLeft size={18} />
            </button>
            {step < 2 ? (
              <button
                className="button button--dark"
                disabled={!selection}
                onClick={next}
              >
                Continuar <ArrowRight size={17} />
              </button>
            ) : (
              <button
                className="button button--blue"
                disabled={!selection}
                onClick={() => {
                  const selected = needs.find((item) => item.id === need)
                  if (!selected) return
                  trackEvent('diagnostic_completed', {
                    solution: need,
                    currentTool: tool,
                    priority,
                  })
                  onContact(
                    selected.id,
                    `Mi punto de partida:\n• Necesidad: ${selected.label}.\n• Hoy lo gestionamos con: ${tool.toLowerCase()}.\n• Prioridad: ${priority.toLowerCase()}.`,
                  )
                }}
              >
                Compartir mi necesidad <ArrowRight size={17} />
              </button>
            )}
          </div>
          <p className="diagnostic__privacy">
            Tus respuestas se añadirán al mensaje para que puedas revisarlas
            antes de enviarlo.
          </p>
        </div>
      </div>
    </section>
  )
}
