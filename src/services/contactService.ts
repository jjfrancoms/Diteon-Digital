export interface ContactLeadPayload {
  name: string;
  contact: string;
  solution: string;
  message?: string;
  company?: string;
  honeypot?: string;
}

export interface ContactServiceResponse {
  success: boolean;
  message: string;
  error?: string;
}

/**
 * Helper to extract UTM parameters from URL search parameters.
 */
function getUrlUtmParams(): {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
} {
  if (typeof window === 'undefined') {
    return { utm_source: null, utm_medium: null, utm_campaign: null };
  }
  try {
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source')?.trim();
    const utmMedium = params.get('utm_medium')?.trim();
    const utmCampaign = params.get('utm_campaign')?.trim();

    return {
      utm_source: utmSource ? utmSource : null,
      utm_medium: utmMedium ? utmMedium : null,
      utm_campaign: utmCampaign ? utmCampaign : null,
    };
  } catch {
    return { utm_source: null, utm_medium: null, utm_campaign: null };
  }
}

/**
 * Service to handle lead submissions to the secure `capture-lead` Edge Function.
 * Uses HTTP POST to the configured endpoint URL along with Cloudflare Turnstile token validation.
 */
export async function submitContactLead(
  payload: ContactLeadPayload,
  turnstileToken?: string
): Promise<ContactServiceResponse> {
  // Honeypot anti-spam quick check
  if (payload.honeypot && payload.honeypot.trim().length > 0) {
    return {
      success: false,
      message: 'Solicitud rechazada.',
      error: 'SPAM_DETECTED'
    };
  }

  const trimmedName = payload.name ? payload.name.trim() : '';
  const trimmedContact = payload.contact ? payload.contact.trim() : '';
  const trimmedSolution = payload.solution ? payload.solution.trim() : 'otro';
  const trimmedMessage = payload.message && payload.message.trim().length > 0 ? payload.message.trim() : null;
  const trimmedCompany = payload.company && payload.company.trim().length > 0 ? payload.company.trim() : null;

  // Classify contact string as email or phone
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmail = emailRegex.test(trimmedContact);
  const email = isEmail ? trimmedContact : null;
  const phone = !isEmail && trimmedContact.length > 0 ? trimmedContact : null;

  // Validation: must have a name and at least email or phone
  if (!trimmedName || (!email && !phone)) {
    return {
      success: false,
      message: 'Por favor ingresa tu nombre y un correo o teléfono de contacto válido.',
      error: 'VALIDATION_FAILED'
    };
  }

  const utmParams = getUrlUtmParams();
  const functionUrl = import.meta.env.VITE_CAPTURE_LEAD_FUNCTION_URL?.trim() || '';

  if (!functionUrl) {
    console.warn('[DITEON Contact Service] VITE_CAPTURE_LEAD_FUNCTION_URL is not configured.');
    return {
      success: false,
      message: 'El servicio de contacto no está disponible temporalmente. Por favor contáctanos por WhatsApp o Email.',
      error: 'ENDPOINT_NOT_CONFIGURED'
    };
  }

  const requestBody = {
    full_name: trimmedName,
    company_name: trimmedCompany,
    email: email,
    phone: phone,
    service_interest: trimmedSolution,
    message: trimmedMessage,
    source: 'landing',
    website_hp: payload.honeypot?.trim() || null,
    turnstile_token: turnstileToken?.trim() || null,
    utm_source: utmParams.utm_source,
    utm_medium: utmParams.utm_medium,
    utm_campaign: utmParams.utm_campaign
  };

  try {
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    let body: any = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }

    if ((response.status === 200 || response.status === 201) && body?.success === true) {
      return {
        success: true,
        message: body.message || 'Hemos recibido tus datos con éxito. Un ingeniero de software se comunicará contigo a la brevedad.'
      };
    }

    // Handles 400, 403, 413, 415, 429, 500 etc.
    const errorMessage = body?.error || body?.message || 'No pudimos procesar tu solicitud en este momento. Por favor contáctanos directamente por WhatsApp o Email.';
    console.error(`[DITEON Edge Function Error ${response.status}]`, body || errorMessage);

    return {
      success: false,
      message: errorMessage,
      error: body?.error || `HTTP_${response.status}`
    };
  } catch (err: unknown) {
    console.error('[DITEON Contact Lead Fetch Exception]', err);
    const errorMessage = err instanceof Error ? err.message : 'Error inesperado';
    return {
      success: false,
      message: 'No pudimos conectar con el servidor en este momento. Por favor contáctanos directamente por WhatsApp o Email.',
      error: errorMessage
    };
  }
}
