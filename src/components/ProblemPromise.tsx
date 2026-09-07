import { useState } from 'react'
import {
  MessageSquare,
  FileSpreadsheet,
  UserRound,
  Check,
  ArrowRight,
} from 'lucide-react'
import { Tabs } from './ui/Tabs'

export function ProblemPromise() {
  const [active, setActive] = useState('connected')
  return (
    <section className="section comparison" aria-labelledby="comparison-title">
      <div className="shell comparison__layout">
        <div>
          <span className="eyebrow">
            El mismo proceso. Otra forma de trabajar.
          </span>
          <h2 id="comparison-title">
            Del «¿quién lo tiene?»
            <br />
            al <em>«ya está en marcha».</em>
          </h2>
          <p>
            Así puede cambiar el seguimiento de una solicitud cuando la
            información deja de estar dispersa.
          </p>
        </div>
        <Tabs
          label="Comparar formas de seguimiento"
          activeId={active}
          onChange={setActive}
          tabs={[
            {
              id: 'manual',
              label: 'Proceso disperso',
              content: (
                <div className="comparison__flow">
                  <div>
                    <MessageSquare />
                    <span>
                      El cliente escribe<b>La solicitud queda en un chat</b>
                    </span>
                  </div>
                  <ArrowRight />
                  <div>
                    <FileSpreadsheet />
                    <span>
                      Alguien copia los datos
                      <b>Otra versión en una hoja de cálculo</b>
                    </span>
                  </div>
                  <ArrowRight />
                  <div>
                    <UserRound />
                    <span>
                      Se pregunta por el estado
                      <b>El seguimiento depende de recordar</b>
                    </span>
                  </div>
                  <p className="comparison__result">
                    Información repartida. Responsabilidad poco clara.
                  </p>
                </div>
              ),
            },
            {
              id: 'connected',
              label: 'Proceso conectado',
              content: (
                <div className="comparison__flow">
                  <div>
                    <MessageSquare />
                    <span>
                      El cliente escribe<b>La solicitud entra al sistema</b>
                    </span>
                  </div>
                  <ArrowRight />
                  <div>
                    <UserRound />
                    <span>
                      Se asigna un responsable
                      <b>La próxima acción queda registrada</b>
                    </span>
                  </div>
                  <ArrowRight />
                  <div>
                    <Check />
                    <span>
                      El equipo ve el estado
                      <b>Un historial compartido y consultable</b>
                    </span>
                  </div>
                  <p className="comparison__result">
                    <Check size={16} /> Un proceso visible, de principio a fin.
                  </p>
                </div>
              ),
            },
          ]}
        />
      </div>
    </section>
  )
}
