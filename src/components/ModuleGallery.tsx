import { useId } from 'react'
import {
  Users,
  Boxes,
  Workflow,
  LayoutGrid,
  CircleCheck,
  type LucideIcon,
} from 'lucide-react'
import { needs } from '../config/experience'

const needPresentation = {
  crm: { icon: Users, accent: 'blue' },
  inventario: { icon: Boxes, accent: 'coral' },
  automatizacion: { icon: Workflow, accent: 'violet' },
  'a-medida': { icon: LayoutGrid, accent: 'navy' },
} satisfies Record<
  (typeof needs)[number]['id'],
  { icon: LucideIcon; accent: 'blue' | 'coral' | 'violet' | 'navy' }
>

export function ModuleGallery() {
  const id = useId()

  return (
    <ul className="module-gallery" aria-label="Galería de módulos">
      {needs.map((need) => {
        const { icon: Icon, accent } = needPresentation[need.id]

        return (
          <li key={need.id}>
            <article
              className="module-gallery__card"
              data-accent={accent}
              aria-labelledby={`${id}-${need.id}`}
            >
              <div className="module-gallery__header">
                <span className="module-gallery__icon">
                  <Icon size={24} strokeWidth={1.6} aria-hidden="true" />
                </span>
                <span className="demo-tag">Datos de ejemplo</span>
              </div>
              <h3 id={`${id}-${need.id}`}>{need.label}</h3>
              <p className="module-gallery__description">
                {need.description}
              </p>
              <div className="module-gallery__status">
                <span className="micro-label">Estado ilustrativo</span>
                <p>
                  <CircleCheck size={16} aria-hidden="true" />
                  {need.benefits[0]}
                </p>
              </div>
            </article>
          </li>
        )
      })}
    </ul>
  )
}
