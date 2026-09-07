/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CAPTURE_LEAD_FUNCTION_URL?: string
  readonly VITE_TURNSTILE_SITE_KEY?: string
  readonly VITE_SITE_URL?: string
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string
  readonly VITE_WHATSAPP_NUMBER?: string
  readonly VITE_CONTACT_EMAIL?: string
  readonly VITE_CONTACT_PHONE?: string
  readonly VITE_LINKEDIN_URL?: string
  readonly VITE_INSTAGRAM_URL?: string
  readonly VITE_CALENDLY_URL?: string
  readonly DEV?: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
