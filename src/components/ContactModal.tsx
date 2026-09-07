import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  Info,
  LoaderCircle,
} from 'lucide-react'
import {
  contactFormAvailable,
  submitContactLead,
} from '../services/contactService'
import {
  validateContact,
  type ContactFields,
  type FormErrors,
} from '../services/contactValidation'
import {
  SOLUTION_OPTIONS,
  type SolutionOptionValue,
} from '../config/solutionOptions'
import { getAvailableContactChannels } from '../config/contact'
import { trackEvent } from '../services/analytics'
import { Modal } from './ui/Modal'
import { TurnstileWidget } from './TurnstileWidget'
export { SOLUTION_OPTIONS, type SolutionOptionValue }

type Status = 'idle' | 'submitting' | 'success' | 'error'
interface Props {
  isOpen: boolean
  onClose: () => void
  defaultSolution?: SolutionOptionValue
  initialMessage?: string
}
export function ContactModal({
  isOpen,
  onClose,
  defaultSolution = 'otro',
  initialMessage = '',
}: Props) {
  const id = useId()
  const [fields, setFields] = useState<ContactFields>({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    solution: defaultSolution,
    message: initialMessage,
    honeypot: '',
  })
  const [token, setToken] = useState('')
  const [resetKey, setResetKey] = useState(0)
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [feedback, setFeedback] = useState('')
  const [verificationFailed, setVerificationFailed] = useState(false)
  const controller = useRef<AbortController | null>(null)
  const inFlight = useRef(false)
  const form = useRef<HTMLFormElement>(null)
  const successHeading = useRef<HTMLHeadingElement>(null)
  const channels = getAvailableContactChannels(
    `Hola DITEON, me interesa ${SOLUTION_OPTIONS.find((item) => item.value === fields.solution)?.label ?? 'conversar sobre un proyecto'}.`,
  )
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim() ?? ''
  useEffect(() => {
    trackEvent('contact_form_started', { initialSolution: defaultSolution })
    return () => {
      controller.current?.abort()
      controller.current = null
      inFlight.current = false
    }
  }, [defaultSolution])
  useEffect(() => {
    if (status === 'success') successHeading.current?.focus()
  }, [status])
  function update(field: keyof ContactFields, value: string) {
    setFields((previous) => ({ ...previous, [field]: value }))
    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
      ...(field === 'email' || field === 'phone' ? { contact: undefined } : {}),
    }))
  }
  function focusInvalid(nextErrors: FormErrors) {
    const field = nextErrors.fullName
      ? 'fullName'
      : nextErrors.companyName
        ? 'companyName'
        : nextErrors.email || nextErrors.contact
          ? 'email'
          : nextErrors.phone
            ? 'phone'
            : nextErrors.solution
              ? 'solution'
              : nextErrors.message
                ? 'message'
                : 'verification'
    requestAnimationFrame(() =>
      document.getElementById(`${id}-${field}`)?.focus(),
    )
  }
  async function submit(event: FormEvent) {
    event.preventDefault()
    if (inFlight.current || !contactFormAvailable) return
    const nextErrors = validateContact(fields, token)
    setErrors(nextErrors)
    setFeedback('')
    if (Object.keys(nextErrors).length) {
      focusInvalid(nextErrors)
      return
    }
    inFlight.current = true
    const request = new AbortController()
    controller.current = request
    setStatus('submitting')
    trackEvent('contact_form_submit', { solution: fields.solution })
    try {
      const result = await submitContactLead(
        { ...fields, solution: fields.solution as SolutionOptionValue },
        token,
        request.signal,
      )
      if (controller.current !== request || request.signal.aborted) return
      setStatus(result.success ? 'success' : 'error')
      setFeedback(result.message)
      if (result.success)
        trackEvent('contact_form_success', { solution: fields.solution })
      else {
        setToken('')
        setResetKey((value) => value + 1)
        trackEvent('contact_form_error', { error: result.error })
      }
    } finally {
      if (controller.current === request) {
        controller.current = null
        inFlight.current = false
      }
    }
  }
  const errorFor = (field: keyof ContactFields) =>
    errors[field] ||
    (field === 'email' || field === 'phone' ? errors.contact : undefined)
  const describedBy = (field: keyof ContactFields) =>
    errorFor(field)
      ? `${id}-${field}-error`
      : field === 'email' || field === 'phone'
        ? `${id}-contact-hint`
        : undefined
  const fieldError = (field: keyof ContactFields) =>
    errorFor(field) && (
      <p className="field-error" id={`${id}-${field}-error`}>
        {errorFor(field)}
      </p>
    )
  const channelLinks = channels.length > 0 && (
    <div className="contact-channels">
      {channels.map((channel) => (
        <a
          key={channel.id}
          href={channel.href}
          target={channel.isExternal ? '_blank' : undefined}
          rel={channel.isExternal ? 'noopener noreferrer' : undefined}
          onClick={() =>
            trackEvent(
              channel.id === 'call'
                ? 'phone_click'
                : (`${channel.id}_click` as Parameters<typeof trackEvent>[0]),
            )
          }
        >
          {channel.label}
          <ArrowUpRight size={13} />
        </a>
      ))}
    </div>
  )
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        status === 'success'
          ? 'Gracias por escribirnos'
          : 'Hablemos de tu proyecto'
      }
      subtitle={
        status === 'success'
          ? undefined
          : 'Cuéntanos qué quieres mejorar. Empecemos por tu necesidad.'
      }
    >
      {status === 'success' ? (
        <div className="contact-success">
          <span className="contact-success__icon">
            <Check size={27} />
          </span>
          <h3 ref={successHeading} tabIndex={-1}>
            Solicitud recibida
          </h3>
          <p role="status">{feedback}</p>
          <button className="button button--dark" onClick={onClose}>
            Volver a la página
          </button>
        </div>
      ) : !contactFormAvailable ? (
        <div>
          <div
            className="form-notice"
            role="status"
            tabIndex={-1}
            data-initial-focus
          >
            <Info size={19} />
            <span>
              El formulario no está disponible temporalmente.
              {channels.length
                ? ' Puedes conversar con nosotros por estos canales.'
                : 'Vuelve a intentarlo más tarde.'}
            </span>
          </div>
          {initialMessage && (
            <div className="unavailable-summary">
              <h3>Tu punto de partida</h3>
              <p>{initialMessage}</p>
            </div>
          )}
          {channelLinks}
        </div>
      ) : (
        <form
          ref={form}
          className="contact-form"
          noValidate
          onSubmit={submit}
          aria-busy={status === 'submitting'}
        >
          <fieldset disabled={status === 'submitting'}>
            <legend>Nombre y un medio de contacto son necesarios.</legend>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor={`${id}-fullName`}>Nombre completo *</label>
                <input
                  id={`${id}-fullName`}
                  name="full_name"
                  autoComplete="name"
                  data-initial-focus
                  required
                  maxLength={120}
                  value={fields.fullName}
                  onChange={(event) => update('fullName', event.target.value)}
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={describedBy('fullName')}
                  placeholder="¿Cómo te llamas?"
                />
                {fieldError('fullName')}
              </div>
              <div className="form-field">
                <label htmlFor={`${id}-companyName`}>
                  Empresa <span>(opcional)</span>
                </label>
                <input
                  id={`${id}-companyName`}
                  name="company_name"
                  autoComplete="organization"
                  maxLength={150}
                  value={fields.companyName}
                  onChange={(event) =>
                    update('companyName', event.target.value)
                  }
                  aria-invalid={Boolean(errors.companyName)}
                  aria-describedby={describedBy('companyName')}
                  placeholder="Nombre de tu negocio"
                />
                {fieldError('companyName')}
              </div>
              <div className="form-field">
                <label htmlFor={`${id}-email`}>Correo electrónico</label>
                <input
                  id={`${id}-email`}
                  type="email"
                  name="email"
                  autoComplete="email"
                  maxLength={255}
                  value={fields.email}
                  onChange={(event) => update('email', event.target.value)}
                  aria-invalid={Boolean(errorFor('email'))}
                  aria-describedby={describedBy('email')}
                  placeholder="tu@empresa.com"
                />
                {fieldError('email')}
              </div>
              <div className="form-field">
                <label htmlFor={`${id}-phone`}>WhatsApp o teléfono</label>
                <input
                  id={`${id}-phone`}
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  maxLength={30}
                  value={fields.phone}
                  onChange={(event) => update('phone', event.target.value)}
                  aria-invalid={Boolean(errorFor('phone'))}
                  aria-describedby={describedBy('phone')}
                  placeholder="Incluye el prefijo de tu país"
                />
                {fieldError('phone')}
              </div>
              <p
                className="form-hint form-contact-hint"
                id={`${id}-contact-hint`}
              >
                Completa al menos uno: correo o teléfono.
              </p>
            </div>
            <div className="form-field">
              <label htmlFor={`${id}-solution`}>¿Qué necesitas resolver?</label>
              <select
                id={`${id}-solution`}
                name="service_interest"
                value={fields.solution}
                onChange={(event) => update('solution', event.target.value)}
                aria-invalid={Boolean(errors.solution)}
                aria-describedby={describedBy('solution')}
              >
                {SOLUTION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {fieldError('solution')}
            </div>
            <div className="form-field">
              <label htmlFor={`${id}-message`}>
                Cuéntanos un poco más <span>(opcional)</span>
              </label>
              <textarea
                id={`${id}-message`}
                name="message"
                rows={4}
                maxLength={2000}
                value={fields.message}
                onChange={(event) => update('message', event.target.value)}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={describedBy('message')}
                placeholder="¿Cómo trabajas hoy y qué te gustaría mejorar?"
              />
              {fieldError('message')}
              <span className="form-message-count">
                {fields.message.length} / 2000
              </span>
            </div>
            <div className="honeypot" aria-hidden="true">
              <label htmlFor={`${id}-website`}>Sitio web</label>
              <input
                id={`${id}-website`}
                name="website_hp"
                tabIndex={-1}
                autoComplete="off"
                value={fields.honeypot}
                onChange={(event) => update('honeypot', event.target.value)}
              />
            </div>
          </fieldset>
          <div
            id={`${id}-verification`}
            tabIndex={-1}
            aria-label="Verificación de seguridad"
          >
            <TurnstileWidget
              siteKey={siteKey}
              resetKey={resetKey}
              onVerify={(value) => {
                setToken(value)
                setVerificationFailed(false)
                setErrors((previous) => ({ ...previous, turnstile: undefined }))
              }}
              onExpire={() => {
                setToken('')
                setErrors((previous) => ({
                  ...previous,
                  turnstile: 'La verificación expiró. Complétala nuevamente.',
                }))
                setVerificationFailed(true)
              }}
              onError={() => {
                setToken('')
                setVerificationFailed(true)
                setErrors((previous) => ({
                  ...previous,
                  turnstile:
                    'No se pudo cargar la verificación. Revisa tu conexión y vuelve a intentarlo.',
                }))
              }}
            />
            {errors.turnstile && (
              <p className="field-error" role="alert">
                {errors.turnstile}
              </p>
            )}
            {verificationFailed && (
              <button
                type="button"
                className="text-link"
                disabled={status === 'submitting'}
                onClick={() => {
                  setToken('')
                  setVerificationFailed(false)
                  setResetKey((value) => value + 1)
                  setErrors((previous) => ({
                    ...previous,
                    turnstile: undefined,
                  }))
                }}
              >
                Reintentar verificación
              </button>
            )}
          </div>
          {feedback && status === 'error' && (
            <div className="form-notice form-notice--error" role="alert">
              <AlertCircle size={19} />
              <span>{feedback}</span>
            </div>
          )}
          <p className="form-hint">
            Usaremos tus datos para responder a esta consulta. Consulta la{' '}
            <a
              href="/privacidad.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              política de privacidad (se abre en otra pestaña)
            </a>
            .
          </p>
          <button
            type="submit"
            className="button button--blue form-submit"
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? (
              <>
                <LoaderCircle size={18} className="spinner" /> Enviando
                solicitud…
              </>
            ) : (
              <>
                Enviar mi consulta <ArrowUpRight size={17} />
              </>
            )}
          </button>
          <p className="form-hint" role="status">
            {status === 'submitting'
              ? 'Esperando confirmación. Puedes cerrar esta ventana; el envío podría haberse recibido.'
              : channels.length
                ? 'También puedes usar los canales de contacto disponibles.'
                : 'Revisa tus datos antes de enviar la consulta.'}
          </p>
          {channelLinks}
        </form>
      )}
    </Modal>
  )
}
