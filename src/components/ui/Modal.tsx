import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
  className = '',
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const backdropDown = useRef(false)
  useEffect(() => {
    if (!isOpen || !ref.current) return
    const dialog = ref.current
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    const overflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    dialog
      .querySelector<HTMLElement>('[data-initial-focus]')
      ?.focus({ preventScroll: true })
    return () => {
      dialog.close()
      document.body.style.overflow = overflow
      if (previous?.isConnected) previous.focus({ preventScroll: true })
    }
  }, [isOpen])
  if (!isOpen) return null
  return createPortal(
    <dialog
      ref={ref}
      className={`modal modal--${maxWidth} ${className}`}
      aria-labelledby={titleId}
      aria-describedby={subtitle ? `${titleId}-description` : undefined}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onPointerDown={(event) => {
        backdropDown.current = event.target === event.currentTarget
      }}
      onClick={(event) => {
        if (backdropDown.current && event.target === event.currentTarget)
          onClose()
      }}
    >
      <div className="modal__surface">
        <header className="modal__header">
          <div>
            <h2 id={titleId}>{title}</h2>
            {subtitle && <p id={`${titleId}-description`}>{subtitle}</p>}
          </div>
          <button
            className="icon-button"
            type="button"
            onClick={onClose}
            aria-label="Cerrar ventana"
          >
            <X size={21} />
          </button>
        </header>
        <div className="modal__body">{children}</div>
      </div>
    </dialog>,
    document.body,
  )
}
