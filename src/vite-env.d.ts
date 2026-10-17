/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  readonly VITE_CESTUDY_CONTACT_EMAIL?: string;
  readonly VITE_BUG_REPORT_EMAIL?: string;
  readonly VITE_GCASH_QR_URL?: string;
  readonly VITE_PAYPAL_SUPPORT_URL?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
