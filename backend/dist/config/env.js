"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.ENV = {
    PORT: process.env.PORT || 4000,
    SPOONACULAR_API_KEY: process.env.SPOONACULAR_API_KEY || '',
    SPOONACULAR_BASE_URL: 'https://api.spoonacular.com',
    SUPABASE_URL: process.env.SUPABASE_URL || '',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
    DATA_SOURCE: process.env.DATA_SOURCE || 'spoonacular',
    // Dev-only: allow self-signed / broken cert chains in some local environments.
    // Never enable in production.
    SUPABASE_INSECURE_TLS: process.env.SUPABASE_INSECURE_TLS || '',
};
