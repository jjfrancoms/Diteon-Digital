import { contactConfig, getAvailableContactChannels, ContactChannelItem } from '../config/contact';

export type { ContactChannelItem };

/**
 * Returns structured communication channels based on active centralized configuration.
 * Prevents phantom/fake links while providing clean fallbacks.
 */
export function getContactChannels(customMessage?: string) {
  return {
    whatsapp: {
      url: contactConfig.whatsapp.getLink(customMessage),
      number: contactConfig.whatsapp.number,
      isConfigured: contactConfig.whatsapp.isConfigured,
    },
    email: {
      href: contactConfig.email.href,
      address: contactConfig.email.address,
      isConfigured: contactConfig.email.isConfigured,
    },
    phone: {
      href: contactConfig.phone.href,
      formatted: contactConfig.phone.raw,
      isConfigured: contactConfig.phone.isConfigured,
    },
    linkedin: {
      url: contactConfig.linkedin.url,
      isConfigured: contactConfig.linkedin.isConfigured,
    },
    instagram: {
      url: contactConfig.instagram.url,
      isConfigured: contactConfig.instagram.isConfigured,
    },
    calendly: {
      url: contactConfig.calendly.url,
      isConfigured: contactConfig.calendly.isConfigured,
    },
    availableList: getAvailableContactChannels(customMessage),
  };
}

