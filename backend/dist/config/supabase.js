"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const env_1 = require("./env");
// Dev-only escape hatch: disable TLS verification if explicitly requested.
// This avoids "unable to verify the first certificate" in some local environments.
if (env_1.ENV.SUPABASE_INSECURE_TLS === 'true') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}
const supabaseUrl = env_1.ENV.SUPABASE_URL;
const supabaseKey = env_1.ENV.SUPABASE_ANON_KEY;
if (env_1.ENV.DATA_SOURCE === 'supabase' && (!supabaseUrl || !supabaseKey)) {
    console.warn("⚠️ Warning: SUPABASE_URL or SUPABASE_ANON_KEY is missing in your environment configuration but DATA_SOURCE is set to 'supabase'.");
}
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder');
