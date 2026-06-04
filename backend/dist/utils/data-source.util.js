"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveDataSource = resolveDataSource;
const env_1 = require("../config/env");
function resolveDataSource(source) {
    if (source === "supabase" || source === "spoonacular") {
        return source;
    }
    return env_1.ENV.DATA_SOURCE === "supabase" ? "supabase" : "spoonacular";
}
