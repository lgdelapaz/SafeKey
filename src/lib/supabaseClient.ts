// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

declare global {
  interface ImportMetaEnv {
	readonly VITE_SUPABASE_URL: string
	readonly VITE_SUPABASE_ANON_KEY: string
	// add other env variables here as needed
  }

  interface ImportMeta {
	readonly env: ImportMetaEnv
  }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Function to set current user context for RLS
export const setCurrentUser = async (userId: string | null) => {
  if (userId) {
    await supabase.rpc('set_config', {
      setting_name: 'app.current_user_id',
      setting_value: userId,
      is_local: true
    });
  } else {
    await supabase.rpc('set_config', {
      setting_name: 'app.current_user_id',
      setting_value: '',
      is_local: true
    });
  }
};

// Function to enable RLS bypass for anonymous operations
export const setBypassRLS = async (bypass: boolean) => {
  await supabase.rpc('set_config', {
    setting_name: 'app.bypass_rls',
    setting_value: bypass ? 'true' : 'false',
    is_local: true
  });
};