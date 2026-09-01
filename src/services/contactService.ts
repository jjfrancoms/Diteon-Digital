import type {
  SolutionOptionValue,
} from '../config/solutionOptions';

export interface ContactLeadPayload {
  fullName: string;
  companyName?: string;
  email?: string;
  phone?: string;
  solution: SolutionOptionValue;
  message?: string;
  honeypot?: string;
}

export interface ContactServiceResponse {
  success: boolean;
  message: string;
  error?: string;
}

interface CaptureLeadResponse {
  success?: boolean;
  message?: string;
  error?: string;
}

function normalizeOptionalText(
  value: string | undefined
): string | null {
  const normalized = value?.trim() ?? '';
  return normalized.length > 0 ? normalized : null;
}

export async function submitContactLead(
  payload: ContactLeadPayload,
  turnstileToken: string
): Promise<ContactServiceResponse> {
  const functionUrl =
    import.meta.env.VITE_CAPTURE_LEAD_FUNCTION_URL?.trim();

  if (!functionUrl) {
    return {
      success: false,
      message:
        'El formulario no está disponible temporalmente. Inténtalo nuevamente en unos minutos.',
      error: 'CAPTURE_LEAD_URL_NOT_CONFIGURED',
    };
  }

  if (!turnstileToken.trim()) {
    return {
      success: false,
      message:
        'Completa la verificación de seguridad antes de enviar la solicitud.',
      error: 'TURNSTILE_TOKEN_MISSING',
    };
  }

  try {
    const response = await fetch(functionUrl, {
      method: 'POST',
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
        turnstile_token: turnstileToken.trim(),
        website_hp: payload.honeypot?.trim() ?? '',
      }),
    });

    const data = (await response
      .json()
      .catch(() => ({}))) as CaptureLeadResponse;

    if (!response.ok || data.success === false) {
      return {
        success: false,
        message:
          data.error ||
          data.message ||
          'No se pudo registrar la solicitud. Inténtalo nuevamente.',
        error: `HTTP_${response.status}`,
      };
    }

    return {
      success: true,
      message:
        data.message ||
        'Solicitud recibida correctamente. Nos pondremos en contacto a la brevedad.',
    };
  } catch (error: unknown) {
    return {
      success: false,
      message:
        'No pudimos conectar con el servicio de contacto. Revisa tu conexión e inténtalo nuevamente.',
      error:
        error instanceof Error
          ? error.message
          : 'NETWORK_ERROR',
    };
  }
}
