import { useState } from 'react'
import {
  Users,
  PanelsTopLeft,
  Database,
  Cloud,
  ArrowDown,
  Check,
} from 'lucide-react'
import { Tabs } from './ui/Tabs'

const layers = [
  {
    id: 'operacion',
    title: 'Tu operación',
    icon: Users,
    tag: 'PERSONAS Y PROCESOS',
    description:
      'Primero entendemos quién hace qué, qué información necesita y dónde se detiene el trabajo.',
    checks: [
      'Flujos y reglas de negocio',
      'Responsables y prioridades',
      'Alcance que se puede validar',
    ],
  },
  {
    id: 'experiencia',
    title: 'La experiencia',
    icon: PanelsTopLeft,
    tag: 'INTERFAZ Y USABILIDAD',
    description:
      'Cada pantalla tiene una tarea clara. Diseñamos para las personas que usarán el sistema todos los días.',
    checks: [
      'Vistas adaptadas a cada rol',
      'Diseño para distintos dispositivos',
      'Estados y acciones comprensibles',
    ],
  },
  {
    id: 'logica',
    title: 'La lógica y los datos',
    icon: Database,
    tag: 'REGLAS Y CONEXIONES',
    description:
      'La parte que no ves sostiene la que sí: permisos, validaciones y procesos que conectan tus herramientas.',
    checks: [
      'Acceso según responsabilidades',
      'Validación de la información',
      'Integraciones con trazabilidad',
    ],
  },
  {
    id: 'infraestructura',
    title: 'La infraestructura',
    icon: Cloud,
    tag: 'DESPLIEGUE Y EVOLUCIÓN',
    description:
      'Preparamos el entorno de publicación y acordamos cómo mantener, observar y hacer evolucionar el sistema.',
    checks: [
      'Entornos y configuración',
      'Respaldo y monitoreo según alcance',
      'Documentación para dar continuidad',
    ],
  },
]
export function Engineering() {
  const [active, setActive] = useState('logica')
  return (
    <section className="section engineering" id="ingenieria">
      <div className="shell">
        <div className="section-heading">
          <div>
            <span className="eyebrow">03 / Lo que sostiene la experiencia</span>
            <h2>
              Se ve simple.
              <br />
              <em>Está bien conectado.</em>
            </h2>
          </div>
          <p>
            Una buena interfaz necesita una base igual de cuidada. Pensamos el
            sistema completo, desde tus procesos hasta su evolución.
          </p>
        </div>
        <Tabs
          label="Capas del sistema"
          className="engineering__tabs"
          activeId={active}
          onChange={setActive}
          tabs={layers.map((layer, index) => ({
            id: layer.id,
            label: `0${index + 1} · ${layer.title}`,
            content: (
              <div className="engineering-panel">
                <div>
                  <span className="micro-label">{layer.tag}</span>
                  <h3>{layer.title}</h3>
                  <p>{layer.description}</p>
                  <ul className="check-list">
                    {layer.checks.map((check) => (
                      <li key={check}>
                        <Check size={16} />
                        {check}
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  className="architecture"
                  aria-label={`Arquitectura del sistema. Capa seleccionada: ${layer.title}`}
                >
                  {layers.map((item, i) => (
                    <div
                      key={item.id}
                      className={`architecture__item ${item.id === active ? 'is-active' : ''}`}
                    >
                      <span>0{i + 1}</span>
                      <item.icon size={22} />
                      <b>{item.title}</b>
                      {i < 3 && (
                        <ArrowDown
                          className="architecture__connector"
                          size={15}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ),
          }))}
        />
      </div>
    </section>
  )
}
