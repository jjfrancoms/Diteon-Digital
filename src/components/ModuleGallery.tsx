import { useId } from 'react'
import { Users, Boxes, PanelsTopLeft, Workflow, CircleCheck } from 'lucide-react'

const modules = [
  {
    id: 'crm',
    name: 'CRM y ventas',
    icon: Users,
    description: 'Clientes, oportunidades y próximas acciones en una vista.',
    exampleStatus: 'Oportunidad en seguimiento',
  },
  {
    id: 'pos',
    name: 'POS e inventario',
    icon: Boxes,
    description: 'Ventas, caja y existencias conectadas por producto.',
    exampleStatus: 'Movimiento de stock registrado',
  },
  {
    id: 'erp',
    name: 'ERP y operaciones',
    icon: PanelsTopLeft,
    description: 'Información de tus áreas reunida para tomar decisiones.',
    exampleStatus: 'Resumen de operación disponible',
  },
  {
    id: 'automatizacion',
    name: 'Automatización de procesos',
    icon: Workflow,
    description: 'Reglas y tareas que dan continuidad al trabajo del equipo.',
    exampleStatus: 'Tarea de seguimiento preparada',
  },
] as const

export function ModuleGallery() {
  const id = useId()

  return (
    <ul className="module-gallery" aria-label="Galería de módulos">
      {modules.map((module) => (
        <li key={module.id}>
          <article
            className="module-gallery__card"
            aria-labelledby={`${id}-${module.id}`}
          >
            <div className="module-gallery__header">
              <span className="module-gallery__icon">
                <module.icon size={24} strokeWidth={1.6} aria-hidden="true" />
              </span>
              <span className="demo-tag">Datos de ejemplo</span>
            </div>
            <h3 id={`${id}-${module.id}`}>{module.name}</h3>
            <p className="module-gallery__description">
              {module.description}
            </p>
            <div className="module-gallery__status">
              <span className="micro-label">Estado ilustrativo</span>
              <p>
                <CircleCheck size={16} aria-hidden="true" />
                {module.exampleStatus}
              </p>
            </div>
          </article>
        </li>
      ))}
    </ul>
  )
}
