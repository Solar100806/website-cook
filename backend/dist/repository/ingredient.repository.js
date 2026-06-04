"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseIngredientRepository = exports.SpoonacularIngredientRepository = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
const supabase_1 = require("../config/supabase");
// 1. Triển khai bằng Spoonacular API
class SpoonacularIngredientRepository {
    async searchIngredients(keyword) {
        if (!keyword || keyword.trim().length === 0) {
            return [];
        }
        try {
            const response = await axios_1.default.get(`${env_1.ENV.SPOONACULAR_BASE_URL}/food/ingredients/autocomplete`, {
                params: {
                    query: keyword.trim(),
                    number: 10,
                    metaInformation: true
                },
                headers: {
                    'x-api-key': env_1.ENV.SPOONACULAR_API_KEY
                }
            });
            return response.data.map((item) => ({
                id: item.id,
                name: item.name,
                image: item.image ? `https://spoonacular.com/cdn/ingredients_100x100/${item.image}` : ''
            }));
        }
        catch (error) {
            console.error("🔴 Lỗi Spoonacular Ingredient Repository:", error.message);
            throw new Error(`Spoonacular Ingredient API Error: ${error.message}`);
        }
    }
    async getPopularIngredients() {
        return [
            { id: 1123, name: "egg", image: "https://spoonacular.com/cdn/ingredients_100x100/egg.png" },
            { id: 5006, name: "chicken", image: "https://spoonacular.com/cdn/ingredients_100x100/whole-chicken.jpg" },
            { id: 11529, name: "tomato", image: "https://spoonacular.com/cdn/ingredients_100x100/tomato.png" },
            { id: 11215, name: "garlic", image: "https://spoonacular.com/cdn/ingredients_100x100/garlic.png" },
            { id: 11282, name: "onion", image: "https://spoonacular.com/cdn/ingredients_100x100/brown-onion.png" },
        ];
    }
}
exports.SpoonacularIngredientRepository = SpoonacularIngredientRepository;
// 2. Triển khai bằng Supabase
class SupabaseIngredientRepository {
    async searchIngredients(keyword) {
        if (!keyword || keyword.trim().length === 0) {
            return [];
        }
        try {
            const { data, error } = await supabase_1.supabase
                .from('ingredients')
                .select('id, name, image')
                .ilike('name', `%${keyword.trim()}%`)
                .limit(10);
            if (error)
                throw error;
            if (!data)
                return [];
            return data.map((item) => ({
                id: item.id,
                name: item.name,
                image: item.image || ''
            }));
        }
        catch (error) {
            const message = String(error?.message || error);
            // Khi RLS/policy chưa mở cho anon role, Supabase sẽ trả "permission denied".
            // Trả [] để UI không bị vỡ vì 500.
            if (message.toLowerCase().includes('permission denied')) {
                console.warn("⚠️ Supabase IngredientRepository (search): permission denied (RLS). Returning empty list.");
                return [];
            }
            console.error("🔴 Lỗi Supabase Ingredient Repository (search):", message);
            throw new Error(`Supabase Database Error: ${message}`);
        }
    }
    async getPopularIngredients() {
        try {
            // Thử lấy từ bảng ingredients trong Supabase
            const { data, error } = await supabase_1.supabase
                .from('ingredients')
                .select('id, name, image')
                .limit(5);
            if (error)
                throw error;
            // Nếu database trống, chuyển sang dùng Mock Data dự phòng để tránh crash UI
            if (!data || data.length === 0) {
                console.log("ℹ️ Supabase ingredients table trống, dùng Mock Data thay thế.");
                return this.getMockPopularIngredients();
            }
            return data.map((item) => ({
                id: item.id,
                name: item.name,
                image: item.image || ''
            }));
        }
        catch (error) {
            console.error("🔴 Lỗi Supabase Ingredient Repository (popular), sử dụng Mock Data dự phòng:", error.message);
            return this.getMockPopularIngredients();
        }
    }
    getMockPopularIngredients() {
        return [
            { id: 1123, name: "egg", image: "https://spoonacular.com/cdn/ingredients_100x100/egg.png" },
            { id: 5006, name: "chicken", image: "https://spoonacular.com/cdn/ingredients_100x100/whole-chicken.jpg" },
            { id: 11529, name: "tomato", image: "https://spoonacular.com/cdn/ingredients_100x100/tomato.png" },
            { id: 11215, name: "garlic", image: "https://spoonacular.com/cdn/ingredients_100x100/garlic.png" },
            { id: 11282, name: "onion", image: "https://spoonacular.com/cdn/ingredients_100x100/brown-onion.png" },
        ];
    }
}
exports.SupabaseIngredientRepository = SupabaseIngredientRepository;
