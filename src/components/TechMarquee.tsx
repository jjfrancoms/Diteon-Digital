import { useId, useState } from 'react'
import { Pause, Play } from 'lucide-react'

const technologies = [
  ['react', 'React'],
  ['typescript', 'TypeScript'],
  ['nodejs', 'Node.js'],
  ['postgresql', 'PostgreSQL'],
  ['supabase', 'Supabase'],
  ['github', 'GitHub'],
] as const

export function TechMarquee() {
  const titleId = useId()
  const [paused, setPaused] = useState(false)

  return (
    <div className="technology" data-paused={paused}>
      <div className="technology__heading">
        <p id={titleId}>Una base técnica elegida según tu proyecto</p>
        <button
          className="technology__toggle"
          type="button"
          aria-label={
            paused
              ? 'Reanudar movimiento de logos'
              : 'Pausar movimiento de logos'
          }
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? (
            <Play size={14} aria-hidden="true" />
          ) : (
            <Pause size={14} aria-hidden="true" />
          )}
          <span>{paused ? 'Reanudar' : 'Pausar'}</span>
        </button>
      </div>
      <div
        className="technology__viewport"
        role="region"
        aria-labelledby={titleId}
        tabIndex={0}
      >
        <div className="technology__track">
          {[false, true].map((duplicate) => (
            <ul
              className="technology__group"
              key={String(duplicate)}
              aria-hidden={duplicate || undefined}
              aria-label={duplicate ? undefined : 'Stack tecnológico de DITEON'}
            >
              {technologies.map(([asset, label]) => (
                <li key={asset}>
                  <img
                    src={`/brands/${asset}.svg`}
                    width="26"
                    height="26"
                    alt=""
                    loading="lazy"
                    draggable={false}
                  />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  )
}
