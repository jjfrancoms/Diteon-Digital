import { useState } from 'react'
import {
  Plus,
  Check,
  FileText,
  PencilRuler,
  Code2,
  ListChecks,
  Rocket,
} from 'lucide-react'

const steps = [
  {
    title: 'Entender',
    text: 'Conversamos sobre tu operación, los usuarios y el problema que vale la pena resolver primero.',
    deliverable: 'Un alcance acordado, con prioridades y fases.',
    icon: FileText,
  },
  {
    title: 'Diseñar',
    text: 'Convertimos el proceso en flujos y pantallas que puedas revisar antes de desarrollar.',
    deliverable: 'Flujos de uso y un prototipo para validar la dirección.',
    icon: PencilRuler,
  },
  {
    title: 'Construir',
    text: 'Desarrollamos por módulos y compartimos avances para revisar decisiones con contexto.',
    deliverable: 'Módulos funcionales según las fases definidas.',
    icon: Code2,
  },
  {
    title: 'Validar',
    text: 'Revisamos escenarios de uso, permisos e integraciones con los criterios del proyecto.',
    deliverable: 'Validación de los flujos y ajustes antes de publicar.',
    icon: ListChecks,
  },
  {
    title: 'Lanzar y acompañar',
    text: 'Preparamos la publicación y la transferencia para que el equipo pueda usar el sistema.',
    deliverable: 'Despliegue, documentación y acompañamiento acordados.',
    icon: Rocket,
  },
]
export function Process() {
  const [open, setOpen] = useState(0)
  const step = steps[open]
  return (
    <section className="section process" id="metodologia">
      <div className="shell">
        <div className="section-heading">
          <div>
            <span className="eyebrow">04 / Cómo trabajamos</span>
            <h2>
              De una buena idea
              <br />
              <em>a algo que funciona.</em>
            </h2>
          </div>
          <p>
            Avanzamos por etapas, con decisiones y entregables claros. El
            alcance de cada uno queda acordado antes de comenzar.
          </p>
        </div>
        <div className="process__layout">
          <div className="process__steps">
            {steps.map((item, index) => (
              <article
                key={item.title}
                className={open === index ? 'is-active' : ''}
              >
                <h3>
                  <button
                    aria-expanded={open === index}
                    aria-controls={`process-panel-${index}`}
                    id={`process-trigger-${index}`}
                    onClick={() => setOpen(index)}
                  >
                    <span>0{index + 1}</span>
                    {item.title}
                    <Plus size={19} />
                  </button>
                </h3>
                <div
                  id={`process-panel-${index}`}
                  role="region"
                  aria-labelledby={`process-trigger-${index}`}
                  hidden={open !== index}
                >
                  <p>{item.text}</p>
                  <p className="process__mobile-deliverable">
                    <Check size={16} />
                    {item.deliverable}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <aside className="deliverable" aria-live="polite">
            <span className="micro-label">QUÉ RECIBES / 0{open + 1}</span>
            <div className="deliverable__icon">
              <step.icon size={45} strokeWidth={1.3} />
            </div>
            <h3>{step.deliverable}</h3>
            <p>
              Sabes qué estamos construyendo, qué revisar y cuál es el siguiente
              paso.
            </p>
            <div className="deliverable__progress" aria-hidden="true">
              {steps.map((_, index) => (
                <i key={index} className={index <= open ? 'is-active' : ''} />
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
