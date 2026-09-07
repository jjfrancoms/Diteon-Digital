import { useRef, useState, type KeyboardEvent } from 'react'
import { Plus, ArrowUpRight } from 'lucide-react'
import type { ContactHandler } from '../config/experience'
import { trackEvent } from '../services/analytics'

const faqs = [
  [
    '¿DITEON trabaja solo con empresas grandes?',
    'No. El criterio principal es que exista un proceso real que valga la pena ordenar, conectar o automatizar. El alcance se adapta a la etapa del negocio.',
  ],
  [
    '¿Puedo empezar por un módulo pequeño?',
    'Sí. Podemos comenzar por el punto de mayor impacto y planificar las siguientes fases. Acordamos qué incluye cada entrega y cómo se conectará con el resto del sistema.',
  ],
  [
    '¿Cómo se define la propiedad del software?',
    'La propiedad del código, la documentación y los entregables se acuerda desde el inicio y queda expresada en el alcance contractual antes de comenzar el desarrollo.',
  ],
  [
    '¿Pueden integrar mis herramientas actuales?',
    'Revisamos la disponibilidad de APIs, permisos y requisitos de tus herramientas. Con esa información definimos qué conexiones son viables y cómo manejar errores o interrupciones.',
  ],
  [
    '¿Cuánto cuesta y cuánto tarda un proyecto?',
    'Depende del alcance, los usuarios y las integraciones. Primero entendemos tu necesidad; después proponemos fases, entregables y una estimación para que puedas decidir con contexto.',
  ],
  [
    '¿Qué pasa después del lanzamiento?',
    'Definimos contigo el soporte, monitoreo y evolución que necesita el proyecto. Las condiciones de acompañamiento se acuerdan antes de publicar.',
  ],
]
export function FaqCta({ onContact }: { onContact: ContactHandler }) {
  const [open, setOpen] = useState(0)
  const refs = useRef<Array<HTMLButtonElement | null>>([])
  function navigate(event: KeyboardEvent, index: number) {
    const next =
      event.key === 'ArrowDown'
        ? (index + 1) % faqs.length
        : event.key === 'ArrowUp'
          ? (index - 1 + faqs.length) % faqs.length
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? faqs.length - 1
              : -1
    if (next >= 0) {
      event.preventDefault()
      refs.current[next]?.focus()
    }
  }
  return (
    <>
      <section className="section faq" id="faq">
        <div className="shell faq__layout">
          <div>
            <span className="eyebrow">06 / Antes de empezar</span>
            <h2>
              Preguntas claras.
              <br />
              <em>Respuestas también.</em>
            </h2>
            <p>Construir un sistema comienza con una buena conversación.</p>
          </div>
          <div className="faq__items">
            {faqs.map(([question, answer], index) => (
              <article
                key={question}
                className={open === index ? 'is-active' : ''}
              >
                <h3>
                  <button
                    ref={(el) => {
                      refs.current[index] = el
                    }}
                    onKeyDown={(event) => navigate(event, index)}
                    aria-expanded={open === index}
                    aria-controls={`faq-panel-${index}`}
                    id={`faq-trigger-${index}`}
                    onClick={() => {
                      setOpen(open === index ? -1 : index)
                      if (open !== index) trackEvent('faq_opened', { question })
                    }}
                  >
                    {question}
                    <Plus size={19} />
                  </button>
                </h3>
                <div
                  id={`faq-panel-${index}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${index}`}
                  hidden={open !== index}
                >
                  <p>{answer}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="final-cta" id="contacto">
        <div className="shell">
          <span className="eyebrow">Hagamos espacio para lo que sigue</span>
          <h2>
            Menos fricción.
            <br />
            <em>Más posibilidades.</em>
          </h2>
          <p>
            Cuéntanos qué está frenando tu operación.
            <br />
            Podemos empezar por ahí.
          </p>
          <button className="button button--bone" onClick={() => onContact()}>
            Hablemos de tu proyecto <ArrowUpRight size={19} />
          </button>
          <span className="final-cta__note">
            Una conversación para entender tu necesidad.
          </span>
        </div>
        <span className="final-cta__orbit" aria-hidden="true" />
      </section>
    </>
  )
}
