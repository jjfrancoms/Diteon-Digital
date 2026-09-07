import type { SolutionOptionValue } from '../config/solutionOptions'

export interface ContactLeadPayload {
  fullName: string
  companyName?: string
  email?: string
  phone?: string
  solution: SolutionOptionValue
  message?: string
  honeypot?: string
}
export interface ContactServiceResponse {
  success: boolean
  message: string
  error?: string
}
interface TransportOptions {
  signal?: AbortSignal
  timeoutMs?: number
  fetcher?: typeof fetch
}
const normalizeOptionalText = (value?: string) => value?.trim() || null
const failure = (error: string, message: string): ContactServiceResponse => ({
  success: false,
  error,
  message,
})
export function isValidEndpoint(value: string) {
  try {
    const url = new URL(value)
    return (
      (url.protocol === 'https:' ||
        (url.protocol === 'http:' &&
          ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname))) &&
      !url.username &&
      !url.password &&
      !url.hash
    )
  } catch {
    return false
  }
}

/** Wire contract for capture-lead. Keep database credentials and Turnstile secrets on the server. */
export async function sendContactLead(
  endpoint: string,
  payload: ContactLeadPayload,
  token: string,
  { signal, timeoutMs = 15000, fetcher = fetch }: TransportOptions = {},
): Promise<ContactServiceResponse> {
  if (!isValidEndpoint(endpoint))
    return failure(
      'CAPTURE_LEAD_URL_NOT_CONFIGURED',
      'El formulario no está disponible temporalmente. Puedes utilizar los canales de contacto que aparecen aquí.',
    )
  if (!token.trim())
    return failure(
      'TURNSTILE_TOKEN_MISSING',
      'Completa la verificación de seguridad antes de enviar la solicitud.',
    )
  if (signal?.aborted)
    return failure('ABORTED', 'Se cerró la solicitud de envío.')
  const controller = new AbortController()
  let timedOut = false
  const abort = () => controller.abort()
  signal?.addEventListener('abort', abort, { once: true })
  let abortListener: () => void = () => {}
  const interrupted = new Promise<ContactServiceResponse>((resolve) => {
    abortListener = () =>
      resolve(
        timedOut
          ? failure(
              'TIMEOUT',
              'El servicio tardó demasiado y no pudimos confirmar la recepción. Puedes contactarnos por otro canal; evita reenviar inmediatamente.',
            )
          : failure('ABORTED', 'Se cerró la solicitud de envío.'),
      )
    controller.signal.addEventListener('abort', abortListener, { once: true })
  })
  const timer = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, timeoutMs)
  const request = async (): Promise<ContactServiceResponse> => {
    try {
      const response = await fetcher(endpoint, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          full_name: payload.fullName.trim(),
          company_name: normalizeOptionalText(payload.companyName),
          email: normalizeOptionalText(payload.email),
          phone: normalizeOptionalText(payload.phone),
          service_interest: payload.solution,
          message: normalizeOptionalText(payload.message),
          source: 'landing',
          turnstile_token: token.trim(),
          website_hp: payload.honeypot?.trim() ?? '',
        }),
      })
      if (!response.ok) {
        const message =
          response.status === 429
            ? 'Hay demasiadas solicitudes. Espera unos minutos antes de intentarlo de nuevo.'
            : response.status === 400 || response.status === 403
              ? 'No se pudo validar la solicitud. Revisa los datos y completa nuevamente la verificación.'
              : 'El servicio no pudo confirmar la recepción. Inténtalo más tarde o utiliza otro canal de contacto.'
        return failure(`HTTP_${response.status}`, message)
      }
      const data: unknown = await response.json().catch(() => null)
      if (
        !data ||
        typeof data !== 'object' ||
        !('success' in data) ||
        data.success !== true
      ) {
        return failure(
          'INVALID_RESPONSE',
          'No recibimos una confirmación válida del servicio. Puedes consultar por otro canal antes de volver a enviar.',
        )
      }
      return {
        success: true,
        message:
          'Tu solicitud fue recibida. Nos pondremos en contacto usando los datos que compartiste.',
      }
    } catch {
      return controller.signal.aborted
        ? abortResult()
        : failure(
            'NETWORK_ERROR',
            'No pudimos confirmar el envío. Revisa tu conexión o utiliza otro canal de contacto.',
          )
    }
  }
  function abortResult() {
    return timedOut
      ? failure(
          'TIMEOUT',
          'El servicio tardó demasiado y no pudimos confirmar la recepción. Puedes contactarnos por otro canal; evita reenviar inmediatamente.',
        )
      : failure('ABORTED', 'Se cerró la solicitud de envío.')
  }
  try {
    return await Promise.race([request(), interrupted])
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', abort)
    controller.signal.removeEventListener('abort', abortListener)
  }
}
