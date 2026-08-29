import { contactConfig } from '../config/contact';

export interface ContactLeadPayload {
  name: string;
  contact: string;
  solution: string;
  message?: string;
  honeypot?: string;
}

export interface ContactServiceResponse {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Service to handle lead submissions to the real backend or API endpoint.
 * Configured via centralized contactConfig.
 */
export async function submitContactLead(
  payload: ContactLeadPayload
): Promise<ContactServiceResponse> {
  // Honeypot anti-spam check
  if (payload.honeypot && payload.honeypot.trim().length > 0) {
    return {
      success: false,
      message: 'Solicitud rechazada.',
      error: 'SPAM_DETECTED'
    };
  }

  const apiUrl = contactConfig.apiUrl;

  // Safe fail if backend API URL is not configured
  if (!contactConfig.hasApiConfigured || !apiUrl) {
    console.warn(
      '[DITEON Contact Service] VITE_CONTACT_API_URL no está configurada o no es una URL válida. El formulario no simulará éxito ficticio.'
    );
    return {
      success: false,
      message: 'No pudimos enviar el formulario en este momento. Por favor contáctanos directamente por WhatsApp o Email.',
      error: 'ENDPOINT_NOT_CONFIGURED'
    };
  }

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: payload.name,
        contact: payload.contact,
        solution: payload.solution,
        message: payload.message || '',
        submittedAt: new Date().toISOString()
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || `No pudimos enviar el formulario en este momento (código ${response.status}). Por favor contáctanos por WhatsApp o Email.`,
        error: `HTTP_${response.status}`
      };
    }

    const data = await response.json().catch(() => ({}));
    return {
      success: true,
      message: data.message || 'Solicitud recibida correctamente por el servidor. Nos comunicaremos contigo a la brevedad.'
    };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Error de conexión';
    return {
      success: false,
      message: 'No pudimos conectar con el servidor en este momento. Por favor contáctanos directamente por WhatsApp o Email.',
      error: errorMessage
    };
  }
}

