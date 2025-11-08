/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_CORBADO_PROJECT_ID: string
  readonly VITE_TWILIO_ACCOUNT_SID: string
  readonly VITE_TWILIO_AUTH_TOKEN: string
  readonly VITE_TWILIO_VERIFY_SID: string
  readonly VITE_HUGGINGFACE_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}