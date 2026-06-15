import { createClient } from '@supabase/supabase-js';
import { ENV } from './env';

// Dev-only escape hatch: disable TLS verification if explicitly requested.
// This avoids "unable to verify the first certificate" in some local environments.
// NEVER enable in production.
if (
  typeof process !== 'undefined' &&
  ENV.SUPABASE_INSECURE_TLS === 'true' &&
  process.env.NODE_ENV !== 'production'
) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const supabaseUrl = ENV.SUPABASE_URL;
const supabaseKey = ENV.SUPABASE_ANON_KEY;

if (ENV.DATA_SOURCE === 'supabase' && (!supabaseUrl || !supabaseKey)) {
  console.warn(
    "⚠️ Warning: SUPABASE_URL or SUPABASE_ANON_KEY is missing but DATA_SOURCE is 'supabase'.",
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder',
);
