import { useState } from 'react'
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  Box,
  Workflow,
  PanelsTopLeft,
  Users,
} from 'lucide-react'
import { Tabs } from './ui/Tabs'
import { needs, type ContactHandler } from '../config/experience'
import type { SolutionOptionValue } from '../config/solutionOptions'
import { trackEvent } from '../services/analytics'

const icons = [Users, Box, Workflow, PanelsTopLeft]
export function Services({
  onContact,
  onInterest,
}: {
  onContact: ContactHandler
  onInterest: (value: SolutionOptionValue) => void
}) {
  const [active, setActive] = useState('crm')
  return (
    <section className="section solutions" id="soluciones">
      <div className="shell">
        <div className="section-heading">
          <div>
            <span className="eyebrow">01 / Tu punto de partida</span>
            <h2>
              ¿Qué necesitas
              <br />
              <em>resolver primero?</em>
            </h2>
          </div>
          <p>
            Partimos de lo que frena tu operación. Juntos definimos qué
            construir y por dónde empezar.
          </p>
        </div>
        <Tabs
          label="Necesidades de tu negocio"
          activeId={active}
          onChange={(id) => {
            setActive(id)
            onInterest(id as SolutionOptionValue)
            trackEvent('solution_tab_selected', { solution: id })
          }}
          tabs={needs.map((need, index) => {
            const Icon = icons[index]
            return {
              id: need.id,
              label: need.label,
              content: (
                <div className="solution-panel">
                  <div className="solution-panel__copy">
                    <span className="feature-icon">
                      <Icon size={24} />
                    </span>
                    <h3>{need.title}</h3>
                    <p>{need.description}</p>
                    <ul className="check-list">
                      {need.benefits.map((benefit) => (
                        <li key={benefit}>
                          <Check size={16} />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    <button
                      className="text-link"
                      onClick={() => {
                        trackEvent('solution_contact_click', {
                          solution: need.id,
                        })
                        onContact(need.id)
                      }}
                    >
                      Quiero resolver esto <ArrowUpRight size={17} />
                    </button>
                  </div>
                  <div className="solution-panel__visual">
                    <img
                      src={`/demos/${need.visual}.svg`}
                      alt={`Ejemplo de interfaz para ${need.label.toLowerCase()}`}
                      width="1000"
                      height="620"
                      loading="lazy"
                    />
                    <span className="demo-caption">
                      Concepto de solución · el alcance se define contigo
                    </span>
                  </div>
                </div>
              ),
            }
          })}
        />
        <p className="solutions__note">
          ¿Necesitas POS, caja o un ERP?{' '}
          <button className="inline-link" onClick={() => onContact('erp')}>
            Podemos conectar varias áreas de tu negocio <ArrowRight size={14} />
          </button>
        </p>
      </div>
    </section>
  )
}
