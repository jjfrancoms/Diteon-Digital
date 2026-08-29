/**
 * Centralized Contact and Channels Configuration for DITEON
 * 
 * Rules & Security Standards:
 * - Reads public environment variables with VITE_ prefix.
 * - Under NO circumstance does this or any client file store private API keys, tokens, or service role secrets.
 * - Normalizes data formats (e.g. cleans numbers for wa.me / tel: protocols).
 * - Implements strict availability flags: if an environment variable is empty or absent,
 *   the channel is flagged as unavailable so the UI never renders dead/broken buttons or href="#".
 */

export interface ContactChannelItem {
  id: 'whatsapp' | 'email' | 'call' | 'linkedin' | 'instagram' | 'calendly';
  label: string;
  category: 'primary' | 'fast' | 'formal' | 'direct' | 'professional' | 'social' | 'meeting';
  available: boolean;
  href: string;
  displayValue?: string;
  isExternal: boolean;
  iconBrand?: 'whatsapp' | 'linkedin' | 'instagram' | 'github';
  systemIcon?: string;
}

export interface ContactConfig {
  apiUrl?: string;
  hasApiConfigured: boolean;
  whatsapp: {
    number?: string;
    cleanNumber?: string;
    isConfigured: boolean;
    getLink: (message?: string) => string;
  };
  email: {
    address?: string;
    href: string;
    isConfigured: boolean;
  };
  phone: {
    raw?: string;
    clean?: string;
    href: string;
    isConfigured: boolean;
  };
  linkedin: {
    url?: string;
    isConfigured: boolean;
  };
  instagram: {
    url?: string;
    isConfigured: boolean;
  };
  calendly: {
    url?: string;
    isConfigured: boolean;
  };
}

// 1. Raw Environment Variables
const rawApiUrl = import.meta.env.VITE_CONTACT_API_URL?.trim();
const rawWaNumber = import.meta.env.VITE_WHATSAPP_NUMBER?.trim();
const rawEmail = import.meta.env.VITE_CONTACT_EMAIL?.trim();
const rawPhone = import.meta.env.VITE_CONTACT_PHONE?.trim();
const rawLinkedin = import.meta.env.VITE_LINKEDIN_URL?.trim();
const rawInstagram = import.meta.env.VITE_INSTAGRAM_URL?.trim();
const rawCalendly = import.meta.env.VITE_CALENDLY_URL?.trim();

// 2. Normalization Helpers
const cleanDigitsOnly = (val?: string) => (val ? val.replace(/\D/g, '') : '');
const cleanPhoneTel = (val?: string) => (val ? val.replace(/[^\d+]/g, '') : '');

// 3. WhatsApp Link Builder
const defaultWhatsAppMessage = 'Hola DITEON, me gustaría recibir asesoría sobre software a medida para mi negocio.';

export const buildWhatsAppUrl = (number?: string, customMessage?: string): string => {
  const msg = encodeURIComponent(customMessage || defaultWhatsAppMessage);
  const clean = cleanDigitsOnly(number);
  if (clean) {
    return `https://wa.me/${clean}?text=${msg}`;
  }
  return `https://wa.me/?text=${msg}`;
};

// 4. Centralized Immutable Configuration
export const contactConfig: ContactConfig = {
  apiUrl: rawApiUrl || undefined,
  hasApiConfigured: Boolean(rawApiUrl && rawApiUrl.startsWith('http')),
  whatsapp: {
    number: rawWaNumber || undefined,
    cleanNumber: cleanDigitsOnly(rawWaNumber) || undefined,
    isConfigured: Boolean(rawWaNumber && rawWaNumber.length >= 6),
    getLink: (customMessage?: string) => buildWhatsAppUrl(rawWaNumber, customMessage),
  },
  email: {
    address: Boolean(rawEmail && rawEmail.includes('@')) ? rawEmail : undefined,
    href: Boolean(rawEmail && rawEmail.includes('@'))
      ? `mailto:${rawEmail}?subject=${encodeURIComponent('Consulta DITEON - Software a medida')}`
      : '',
    isConfigured: Boolean(rawEmail && rawEmail.includes('@')),
  },
  phone: {
    raw: rawPhone || undefined,
    clean: cleanPhoneTel(rawPhone) || undefined,
    href: Boolean(rawPhone && rawPhone.length >= 5) ? `tel:${cleanPhoneTel(rawPhone)}` : '',
    isConfigured: Boolean(rawPhone && rawPhone.length >= 5),
  },
  linkedin: {
    url: Boolean(rawLinkedin && rawLinkedin.startsWith('http')) ? rawLinkedin : undefined,
    isConfigured: Boolean(rawLinkedin && rawLinkedin.startsWith('http')),
  },
  instagram: {
    url: Boolean(rawInstagram && rawInstagram.startsWith('http')) ? rawInstagram : undefined,
    isConfigured: Boolean(rawInstagram && rawInstagram.startsWith('http')),
  },
  calendly: {
    url: Boolean(rawCalendly && rawCalendly.startsWith('http')) ? rawCalendly : undefined,
    isConfigured: Boolean(rawCalendly && rawCalendly.startsWith('http')),
  },
};

/**
 * Returns strictly available, verified communication channels with their UI metadata.
 * Can be filtered or rendered conditionally without dead links or href="#".
 */
export function getAvailableContactChannels(customMessage?: string): ContactChannelItem[] {
  const list: ContactChannelItem[] = [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      category: 'fast',
      available: contactConfig.whatsapp.isConfigured,
      href: contactConfig.whatsapp.getLink(customMessage),
      displayValue: contactConfig.whatsapp.number,
      isExternal: true,
      iconBrand: 'whatsapp',
    },
    {
      id: 'email',
      label: 'Email',
      category: 'formal',
      available: contactConfig.email.isConfigured,
      href: contactConfig.email.href,
      displayValue: contactConfig.email.address,
      isExternal: false,
      systemIcon: 'mail',
    },
    {
      id: 'call',
      label: 'Llamar',
      category: 'direct',
      available: contactConfig.phone.isConfigured,
      href: contactConfig.phone.href,
      displayValue: contactConfig.phone.raw,
      isExternal: false,
      systemIcon: 'call',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      category: 'professional',
      available: contactConfig.linkedin.isConfigured,
      href: contactConfig.linkedin.url || '',
      displayValue: 'LinkedIn',
      isExternal: true,
      iconBrand: 'linkedin',
    },
    {
      id: 'instagram',
      label: 'Instagram',
      category: 'social',
      available: contactConfig.instagram.isConfigured,
      href: contactConfig.instagram.url || '',
      displayValue: 'Instagram',
      isExternal: true,
      iconBrand: 'instagram',
    },
    {
      id: 'calendly',
      label: 'Agendar reunión',
      category: 'meeting',
      available: contactConfig.calendly.isConfigured,
      href: contactConfig.calendly.url || '',
      displayValue: 'Calendly',
      isExternal: true,
      systemIcon: 'calendar_month',
    },
  ];

  return list.filter((ch) => ch.available && Boolean(ch.href));
}
