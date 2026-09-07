import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react'

interface TabItem {
  id: string
  label: string
  content: ReactNode
}
interface TabsProps {
  tabs: readonly TabItem[]
  activeId: string
  onChange: (id: string) => void
  label: string
  className?: string
}

export function Tabs({
  tabs,
  activeId,
  onChange,
  label,
  className = '',
}: TabsProps) {
  const prefix = useId()
  const refs = useRef<Array<HTMLButtonElement | null>>([])
  function navigate(event: KeyboardEvent, index: number) {
    const next =
      event.key === 'ArrowRight'
        ? (index + 1) % tabs.length
        : event.key === 'ArrowLeft'
          ? (index - 1 + tabs.length) % tabs.length
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? tabs.length - 1
              : -1
    if (next < 0) return
    event.preventDefault()
    onChange(tabs[next].id)
    refs.current[next]?.focus({ preventScroll: true })
    refs.current[next]?.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
      behavior: 'instant',
    })
  }
  return (
    <div className={`tabs ${className}`}>
      <div className="tabs__list" role="tablist" aria-label={label}>
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => {
              refs.current[index] = el
            }}
            type="button"
            role="tab"
            id={`${prefix}-tab-${tab.id}`}
            aria-controls={`${prefix}-panel-${tab.id}`}
            aria-selected={activeId === tab.id}
            tabIndex={activeId === tab.id ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => navigate(event, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className="tabs__panel"
          id={`${prefix}-panel-${tab.id}`}
          role="tabpanel"
          aria-labelledby={`${prefix}-tab-${tab.id}`}
          tabIndex={0}
          hidden={activeId !== tab.id}
        >
          {tab.content}
        </div>
      ))}
    </div>
  )
}
