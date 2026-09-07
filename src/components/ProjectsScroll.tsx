import { useState } from 'react'
import {
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Check,
  MessageSquare,
  UserRound,
  BarChart3,
} from 'lucide-react'
import { Tabs } from './ui/Tabs'
import { Modal } from './ui/Modal'
import { ModuleGallery } from './ModuleGallery'
import type { ContactHandler } from '../config/experience'
import { trackEvent } from '../services/analytics'

const steps = [
  {
    title: 'Una solicitud entra',
    body: 'Un nuevo contacto se registra con su origen y el motivo de consulta. La información deja de perderse entre conversaciones.',
    tag: 'CAPTURA',
    icon: MessageSquare,
  },
  {
    title: 'El equipo sabe qué sigue',
    body: 'La oportunidad tiene un responsable, una etapa y una próxima tarea. Cada persona conoce su parte del proceso.',
    tag: 'SEGUIMIENTO',
    icon: UserRound,
  },
  {
    title: 'Tú ves el panorama',
    body: 'Un resumen reúne lo pendiente y lo que avanza. Puedes revisar el estado de tu operación sin pedir un reporte manual.',
    tag: 'VISIBILIDAD',
    icon: BarChart3,
  },
]
export function ProjectsScroll({ onContact }: { onContact: ContactHandler }) {
  const [step, setStep] = useState(0)
  const [view, setView] = useState('guided')
  const [detail, setDetail] = useState(false)
  function choose(next: number) {
    setStep(next)
    trackEvent('demo_step_selected', { step: next + 1 })
  }
  return (
    <section className="section product" id="producto">
      <div className="shell">
        <div className="section-heading">
          <div>
            <span className="eyebrow">02 / Explora una solución</span>
            <h2>
              De una conversación
              <br />
              <em>a una operación en orden.</em>
            </h2>
          </div>
          <p>Recorre una demo o explora los módulos. Tú marcas el ritmo.</p>
        </div>
        <Tabs
          label="Vistas de la demo"
          activeId={view}
          onChange={setView}
          className="product__tabs"
          tabs={[
            {
              id: 'guided',
              label: 'Recorrido guiado',
              content: (
                <div className="guided-demo">
                  <div className="guided-demo__story">
                    <span className="micro-label">PASO 0{step + 1} / 03</span>
                    <h3>{steps[step].title}</h3>
                    <p>{steps[step].body}</p>
                    <div
                      className="step-controls"
                      role="group"
                      aria-label="Pasos del recorrido"
                    >
                      {steps.map((item, index) => (
                        <button
                          key={item.tag}
                          type="button"
                          className={step === index ? 'is-active' : ''}
                          aria-pressed={step === index}
                          onClick={() => choose(index)}
                        >
                          <span>0{index + 1}</span>
                          {item.tag.toLowerCase()}
                        </button>
                      ))}
                    </div>
                    <div className="demo-navigation">
                      <button
                        className="icon-button"
                        disabled={step === 0}
                        aria-label="Paso anterior"
                        onClick={() => choose(step - 1)}
                      >
                        <ArrowLeft size={18} />
                      </button>
                      <span aria-live="polite">{step + 1} de 3</span>
                      <button
                        className="icon-button"
                        disabled={step === 2}
                        aria-label="Paso siguiente"
                        onClick={() => choose(step + 1)}
                      >
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="demo-screen">
                    <div className="demo-screen__bar">
                      <span className="mini-brand">
                        D<span>·</span>
                      </span>
                      <b>Operación comercial</b>
                      <span className="demo-tag">Datos de ejemplo</span>
                    </div>
                    <div className="demo-screen__content">
                      {step === 0 && (
                        <>
                          <div className="demo-screen__title">
                            <MessageSquare />
                            <h4>Bandeja de solicitudes</h4>
                            <span className="status">1 nueva</span>
                          </div>
                          <div className="message-card">
                            <span className="avatar">MR</span>
                            <div>
                              <b>
                                María R. <small>Contacto de ejemplo</small>
                              </b>
                              <p>
                                Hola, necesito organizar el inventario de mi
                                tienda y conectarlo con las ventas.
                              </p>
                              <span className="micro-label">
                                ORIGEN: FORMULARIO WEB
                              </span>
                            </div>
                          </div>
                          <div className="data-pairs">
                            <div>
                              <span>Interés detectado</span>
                              <b>Inventario y ventas</b>
                            </div>
                            <div>
                              <span>Estado inicial</span>
                              <b>Nueva oportunidad</b>
                            </div>
                          </div>
                          <div className="demo-notice">
                            <Check size={17} /> Contacto y necesidad reunidos en
                            una ficha.
                          </div>
                        </>
                      )}
                      {step === 1 && (
                        <>
                          <div className="demo-screen__title">
                            <UserRound />
                            <h4>Una acción, un responsable</h4>
                          </div>
                          <div className="opportunity">
                            <span className="micro-label">
                              OPORTUNIDAD / MARÍA R.
                            </span>
                            <h4>Inventario y ventas</h4>
                            <div className="stage-track">
                              <span>Recibido</span>
                              <span className="is-active">En seguimiento</span>
                              <span>Propuesta</span>
                            </div>
                          </div>
                          <div className="task-card">
                            <span className="avatar avatar--1">AC</span>
                            <div>
                              <b>Ana · Equipo comercial</b>
                              <span>
                                Revisar productos, sucursales y flujo de caja
                              </span>
                            </div>
                            <span className="status status--1">Pendiente</span>
                          </div>
                          <div className="demo-notice">
                            <Check size={17} /> La próxima tarea queda visible
                            para el equipo.
                          </div>
                        </>
                      )}
                      {step === 2 && (
                        <>
                          <div className="demo-screen__title">
                            <BarChart3 />
                            <h4>Resumen de seguimiento</h4>
                          </div>
                          <div className="demo-metrics">
                            <div>
                              <b>12</b>
                              <span>Oportunidades</span>
                            </div>
                            <div>
                              <b>4</b>
                              <span>Próximas tareas</span>
                            </div>
                            <div>
                              <b>3</b>
                              <span>Propuestas</span>
                            </div>
                          </div>
                          <div
                            className="demo-bars"
                            aria-label="Datos de ejemplo: 5 nuevos contactos, 4 en seguimiento y 3 propuestas"
                          >
                            {[
                              ['Nuevos contactos', 5],
                              ['En seguimiento', 4],
                              ['Propuestas', 3],
                            ].map(([label, count]) => (
                              <div key={label}>
                                <span>{label}</span>
                                <div>
                                  <i
                                    style={{ width: `${Number(count) * 20}%` }}
                                  />
                                </div>
                                <b>{count}</b>
                              </div>
                            ))}
                          </div>
                          <div className="demo-notice">
                            <Check size={17} /> Del detalle de cada caso a una
                            vista compartida.
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ),
            },
            {
              id: 'modules',
              label: 'Galería de módulos',
              content: <ModuleGallery />,
            },
          ]}
        />
        <div className="product__footnote">
          <p>
            Demostración ilustrativa. Las funciones e integraciones se acuerdan
            según cada proyecto.
          </p>
          <button className="text-link" onClick={() => setDetail(true)}>
            Ver alcance del ejemplo <ArrowUpRight size={16} />
          </button>
        </div>
        <Modal
          isOpen={detail}
          onClose={() => setDetail(false)}
          title="Una operación comercial conectada"
          subtitle="Referencia de solución · no es un caso de cliente publicado"
          maxWidth="lg"
        >
          <div className="project-detail">
            <span className="eyebrow" data-initial-focus tabIndex={-1}>
              De la necesidad a los módulos
            </span>
            <h3>El problema que resuelve</h3>
            <p>
              Solicitudes repartidas entre chats y hojas de cálculo, sin un
              responsable o un estado compartido.
            </p>
            <div className="detail-grid">
              <div>
                <h3>Quiénes lo usan</h3>
                <p>Equipo comercial, responsables de operación y dirección.</p>
              </div>
              <div>
                <h3>Qué incluye el ejemplo</h3>
                <p>
                  Captura de contactos, asignación, tareas, etapas y un resumen
                  de actividad.
                </p>
              </div>
            </div>
            <h3>Lo que definimos contigo</h3>
            <p>
              Roles, fuentes de datos, reglas, integraciones, propiedad del
              código, soporte y fases de entrega. La demo no representa un
              paquete cerrado.
            </p>
            <button
              className="button button--blue"
              onClick={() => {
                setDetail(false)
                onContact(
                  'crm',
                  'Me interesa una operación comercial conectada: captura de contactos, seguimiento y un resumen de actividad.',
                )
              }}
            >
              Quiero algo así para mi negocio <ArrowUpRight size={17} />
            </button>
          </div>
        </Modal>
      </div>
    </section>
  )
}
