/**
 * Custom analytics dispatcher to track interaction events without coupling
 * to a specific third-party provider (GA4, Plausible, PostHog, etc.).
 */

export type AnalyticsEventName =
  | 'hero_cta_click'
  | 'hero_contact_click'
  | 'solution_tab_selected'
  | 'solution_cta_click'
  | 'solution_contact_click'
  | 'whatsapp_click'
  | 'email_click'
  | 'phone_click'
  | 'linkedin_click'
  | 'instagram_click'
  | 'calendly_click'
  | 'faq_opened'
  | 'contact_form_started'
  | 'contact_form_submit'
  | 'contact_form_submitted'
  | 'contact_form_success'
  | 'contact_form_error';

export function trackEvent(eventName: AnalyticsEventName, properties?: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    // Dispatch a custom window event that tag managers or listeners can capture
    window.dispatchEvent(
      new CustomEvent('diteon_analytics', {
        detail: {
          event: eventName,
          properties,
          timestamp: new Date().toISOString()
        }
      })
    );

    // Optional console log in development
    if (import.meta.env.DEV) {
      console.log(`[Analytics Event] ${eventName}:`, properties || {});
    }
  }
}
