import { contactConfig } from '../config/contact';

/**
 * Generates an official WhatsApp conversation URL with contextual message.
 * Respects VITE_WHATSAPP_NUMBER without inventing fake fallback phone numbers.
 */
export function getWhatsAppLink(customMessage?: string): { url: string; isConfigured: boolean } {
  return {
    url: contactConfig.whatsapp.getLink(customMessage),
    isConfigured: contactConfig.whatsapp.isConfigured,
  };
}

