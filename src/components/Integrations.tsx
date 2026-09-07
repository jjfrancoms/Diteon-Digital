import { useState } from 'react'
import {
  MessageSquare,
  LayoutList,
  UserRound,
  Bell,
  Check,
  ArrowRight,
} from 'lucide-react'
import { TechMarquee } from './TechMarquee'
import { Tabs } from './ui/Tabs'

const flows = [
  {
    id: 'whatsapp',
    label: 'WhatsApp → seguimiento',
    input: 'Llega un mensaje',
    inputDetail: 'WhatsApp Business',
    rule: 'Registrar y asignar',
    ruleDetail: 'Según las reglas de tu equipo',
    output: 'Preparar una tarea',
    outputDetail: 'Responsable y siguiente acción',
    description:
      'Ejemplo: una consulta puede convertirse en una oportunidad con responsable y próxima tarea. Requiere una integración compatible y permisos de WhatsApp Business.',
  },
  {
    id: 'formulario',
    label: 'Formulario → equipo',
    input: 'Entra una solicitud',
    inputDetail: 'Formulario de tu web',
    rule: 'Validar y organizar',
    ruleDetail: 'Datos e interés de la consulta',
    output: 'Notificar al equipo',
    outputDetail: 'Un aviso con el contexto necesario',
    description:
      'Ejemplo: validar una solicitud, guardarla en el sistema y avisar al equipo. Las notificaciones y los destinatarios se definen según tu operación.',
  },
]
export function Integrations() {
  const [active, setActive] = useState('whatsapp')
  return (
    <section className="section integrations" id="integraciones">
      <div className="shell">
        <div className="section-heading">
          <div>
            <span className="eyebrow">05 / Herramientas que conversan</span>
            <h2>
              Conectar herramientas.
              <br />
              <em>Dar continuidad al trabajo.</em>
            </h2>
          </div>
          <p>
            La integración tiene sentido cuando resuelve un paso real. Así puede
            verse un flujo conectado.
          </p>
        </div>
        <Tabs
          label="Ejemplos de integración"
          activeId={active}
          onChange={setActive}
          tabs={flows.map((flow) => ({
            id: flow.id,
            label: flow.label,
            content: (
              <>
                <div className="connection-flow">
                  <div className="connection-node">
                    <span className="connection-node__icon">
                      {flow.id === 'whatsapp' ? (
                        <MessageSquare />
                      ) : (
                        <LayoutList />
                      )}
                    </span>
                    <span className="micro-label">01 / ENTRADA</span>
                    <h3>{flow.input}</h3>
                    <p>{flow.inputDetail}</p>
                  </div>
                  <div className="connection-beam" aria-hidden="true">
                    <i />
                    <ArrowRight size={16} />
                  </div>
                  <div className="connection-node connection-node--core">
                    <span className="connection-node__icon">
                      <UserRound />
                    </span>
                    <span className="micro-label">02 / SISTEMA</span>
                    <h3>{flow.rule}</h3>
                    <p>{flow.ruleDetail}</p>
                  </div>
                  <div className="connection-beam" aria-hidden="true">
                    <i />
                    <ArrowRight size={16} />
                  </div>
                  <div className="connection-node">
                    <span className="connection-node__icon">
                      <Bell />
                    </span>
                    <span className="micro-label">03 / ACCIÓN</span>
                    <h3>{flow.output}</h3>
                    <p>{flow.outputDetail}</p>
                  </div>
                </div>
                <p className="integrations__note">
                  <Check size={18} />
                  {flow.description}
                </p>
              </>
            ),
          }))}
        />
        <TechMarquee />
      </div>
    </section>
  )
}
