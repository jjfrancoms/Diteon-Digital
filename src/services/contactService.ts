import {
  isValidEndpoint,
  sendContactLead,
  type ContactLeadPayload,
} from './contactTransport'
export type {
  ContactLeadPayload,
  ContactServiceResponse,
} from './contactTransport'

export const contactEndpoint =
  import.meta.env.VITE_CAPTURE_LEAD_FUNCTION_URL?.trim() ?? ''
export const contactFormAvailable =
  isValidEndpoint(contactEndpoint) &&
  Boolean(import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim())
export function submitContactLead(
  payload: ContactLeadPayload,
  turnstileToken: string,
  signal?: AbortSignal,
) {
  return sendContactLead(contactEndpoint, payload, turnstileToken, { signal })
}
