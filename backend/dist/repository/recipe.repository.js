"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseRecipeRepository = exports.SpoonacularRecipeRepository = void 0;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
const supabase_1 = require("../config/supabase");
const recipe_mapper_1 = require("../utils/recipe.mapper");
const image_util_1 = require("../utils/image.util");
// 1. Triển khai bằng Spoonacular API
class SpoonacularRecipeRepository {
    async searchRecipes(query, cuisine) {
        try {
            const response = await axios_1.default.get(`${env_1.ENV.SPOONACULAR_BASE_URL}/recipes/complexSearch`, {
                params: {
                    query: query,
                    cuisine: cuisine,
                    number: 9
                },
                headers: {
                    "x-api-key": env_1.ENV.SPOONACULAR_API_KEY,
                }
            });
            return response.data;
        }
        catch (error) {
            console.error("🔴 Lỗi Spoonacular Recipe Repository (search):", error.response?.data || error.message);
            const errorMsg = error.response?.data?.message || error.message;
            throw new Error(`Spoonacular Service Error: ${errorMsg}`);
        }
    }
    async searchRecipesByIngredients(ingredients) {
        try {
            const response = await axios_1.default.get(`${env_1.ENV.SPOONACULAR_BASE_URL}/recipes/findByIngredients`, {
                params: {
                    ingredients: ingredients.join(','),
                    number: 9,
                    ranking: 1
                },
                headers: {
                    'x-api-key': env_1.ENV.SPOONACULAR_API_KEY
                }
            });
            return response.data;
        }
        catch (error) {
            console.error("🔴 Lỗi Spoonacular Recipe Repository (by ingredients):", error.response?.data || error.message);
            throw new Error(`Spoonacular Service Error: ${error.message}`);
        }
    }
    async getRecipeById(id) {
        try {
            const response = await axios_1.default.get(`${env_1.ENV.SPOONACULAR_BASE_URL}/recipes/${id}/information`, {
                headers: {
                    'x-api-key': env_1.ENV.SPOONACULAR_API_KEY
                }
            });
            return (0, recipe_mapper_1.normalizeRecipeDetail)(response.data);
        }
        catch (error) {
            console.error("🔴 Lỗi Spoonacular Recipe Repository (get details):", error.response?.data || error.message);
            const errorMsg = error.response?.data?.message || error.message;
            throw new Error(`Spoonacular Service Error: ${errorMsg}`);
        }
    }
}
exports.SpoonacularRecipeRepository = SpoonacularRecipeRepository;
// 2. Triển khai bằng Supabase DB
class SupabaseRecipeRepository {
    async searchRecipes(query, cuisine) {
        try {
            let dbQuery = supabase_1.supabase
                .from('recipes')
                .select('id, title, name, image, image_url, description, cook_time, difficulty, cuisine');
            if (query && query.trim()) {
                const term = `%${query.trim()}%`;
                dbQuery = dbQuery.or(`title.ilike.${term},name.ilike.${term},description.ilike.${term}`);
            }
            if (cuisine && cuisine.trim()) {
                dbQuery = dbQuery.ilike('cuisine', `%${cuisine.trim()}%`);
            }
            const { data, error } = await dbQuery.limit(9);
            if (error)
                throw error;
            const results = (data || []).map((r) => ({
                id: r.id,
                title: r.title || r.name || 'Món ăn chưa có tên',
                image: r.image || r.image_url || '',
                description: r.description || '',
                cook_time: r.cook_time || '',
                difficulty: r.difficulty || '',
                cuisine: r.cuisine || ''
            }));
            return { results };
        }
        catch (error) {
            console.error("🔴 Lỗi Supabase Recipe Repository (search):", error.message);
            throw new Error(`Supabase Database Error: ${error.message}`);
        }
    }
    async searchRecipesByIngredients(ingredients) {
        try {
            const { data: recipes, error } = await supabase_1.supabase
                .from('recipes')
                .select(`
                    id,
                    title,
                    name,
                    image,
                    image_url,
                    description,
                    cook_time,
                    difficulty,
                    cuisine,
                    recipe_ingredients (
                        id,
                        quantity,
                        unit,
                        ingredients (
                            id,
                            name,
                            image
                        )
                    )
                `);
            if (error)
                throw error;
            if (!recipes || recipes.length === 0)
                return [];
            const normalizedSearch = ingredients
                .map(i => i.toLowerCase().trim())
                .filter(Boolean);
            const matched = recipes.map((recipe) => {
                const recipeIngredients = recipe.recipe_ingredients || [];
                const used = [];
                const missed = [];
                recipeIngredients.forEach((ri) => {
                    if (!ri.ingredients)
                        return;
                    const ingredientName = ri.ingredients.name || '';
                    const normName = ingredientName.toLowerCase().trim();
                    const isMatched = normalizedSearch.some(search => normName.includes(search) || search.includes(normName));
                    const ingObj = {
                        id: ri.ingredients.id,
                        name: ingredientName,
                        image: ri.ingredients.image || '',
                        amount: ri.quantity || '',
                        unit: ri.unit || ''
                    };
                    if (isMatched) {
                        used.push(ingObj);
                    }
                    else {
                        missed.push(ingObj);
                    }
                });
                return {
                    id: recipe.id,
                    title: recipe.title || recipe.name || 'Món ăn chưa có tên',
                    name: recipe.name || recipe.title || 'Món ăn chưa có tên',
                    image: recipe.image || recipe.image_url || '',
                    description: recipe.description || '',
                    cook_time: recipe.cook_time || '',
                    difficulty: recipe.difficulty || '',
                    usedIngredientCount: used.length,
                    missedIngredientCount: missed.length,
                    usedIngredients: used,
                    missedIngredients: missed,
                    unusedIngredients: [],
                    // Đính kèm sẵn thông tin chi tiết vào payload
                    extendedIngredients: recipeIngredients.map((ri) => ({
                        id: ri.ingredients?.id || Math.random(),
                        name: ri.ingredients?.name || 'Nguyên liệu không tên',
                        amount: ri.quantity || '',
                        unit: ri.unit || '',
                        image: ri.ingredients?.image || ''
                    }))
                };
            });
            // Lọc ra các công thức chứa ít nhất 1 nguyên liệu được chọn
            const filtered = matched.filter(r => r.usedIngredientCount > 0);
            // Sắp xếp theo thứ tự ưu tiên: khớp nhiều nhất -> thiếu ít nhất
            filtered.sort((a, b) => b.usedIngredientCount - a.usedIngredientCount ||
                a.missedIngredientCount - b.missedIngredientCount);
            return filtered.slice(0, 9);
        }
        catch (error) {
            console.error("🔴 Lỗi Supabase Recipe Repository (by ingredients):", error.message);
            throw new Error(`Supabase Database Error: ${error.message}`);
        }
    }
    async getRecipeById(id) {
        try {
            const isUuid = isNaN(Number(id));
            let queryBuilder = supabase_1.supabase
                .from('recipes')
                .select(`
                    id,
                    title,
                    name,
                    description,
                    image,
                    image_url,
                    cook_time,
                    difficulty,
                    cuisine,
                    recipe_ingredients (
                        id,
                        quantity,
                        unit,
                        ingredients (
                            id,
                            name,
                            image
                        )
                    ),
                    recipe_steps (
                        id,
                        step_order,
                        content,
                        image,
                        image_url
                    )
                `);
            if (isUuid) {
                queryBuilder = queryBuilder.eq('id', id);
            }
            else {
                queryBuilder = queryBuilder.eq('id', Number(id));
            }
            const { data: recipe, error } = await queryBuilder.maybeSingle();
            if (error)
                throw error;
            if (!recipe) {
                throw new Error(`Món ăn với ID ${id} không tìm thấy trên hệ thống.`);
            }
            // Map cấu trúc dữ liệu trả về tương thích với Spoonacular API
            const extendedIngredients = (recipe.recipe_ingredients || []).map((ri) => ({
                id: ri.ingredients?.id || Math.random(),
                name: ri.ingredients?.name || 'Nguyên liệu không tên',
                amount: ri.quantity || '',
                unit: ri.unit || '',
                image: ri.ingredients?.image ? `https://spoonacular.com/cdn/ingredients_100x100/${ri.ingredients.image}` : ''
            }));
            const recipeImage = (0, image_util_1.normalizeImageUrl)(recipe.image ?? recipe.image_url, recipe.image ?? recipe.image_url ?? '');
            const steps = (recipe.recipe_steps || [])
                .sort((a, b) => a.step_order - b.step_order)
                .map((s) => ({
                number: s.step_order,
                step: s.content,
                image: (0, image_util_1.normalizeImageUrl)(s.image ?? s.image_url, recipeImage)
            }));
            return {
                id: recipe.id,
                title: recipe.title || recipe.name || 'Món ăn chưa có tên',
                name: recipe.name || recipe.title || 'Món ăn chưa có tên',
                description: recipe.description || '',
                image: recipeImage,
                image_url: recipeImage,
                cook_time: recipe.cook_time || '',
                difficulty: recipe.difficulty || '',
                extendedIngredients,
                analyzedInstructions: [
                    {
                        name: '',
                        steps: steps
                    }
                ],
                steps: steps.map((s) => ({
                    step_order: s.number,
                    content: s.step,
                    image: s.image
                }))
            };
        }
        catch (error) {
            console.error(`🔴 Lỗi Supabase Recipe Repository (details for ${id}):`, error.message);
            throw new Error(`Supabase Database Error: ${error.message}`);
        }
    }
}
exports.SupabaseRecipeRepository = SupabaseRecipeRepository;
