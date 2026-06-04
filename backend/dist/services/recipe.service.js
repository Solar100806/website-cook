"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeService = void 0;
const recipe_repository_1 = require("../repository/recipe.repository");
const data_source_util_1 = require("../utils/data-source.util");
class RecipeService {
    getRepository(source) {
        const dataSource = (0, data_source_util_1.resolveDataSource)(source);
        if (dataSource === "supabase") {
            return new recipe_repository_1.SupabaseRecipeRepository();
        }
        return new recipe_repository_1.SpoonacularRecipeRepository();
    }
    // 1. Hàm tìm kiếm chung
    async searchRecipes(query, cuisine, source) {
        return this.getRepository(source).searchRecipes(query, cuisine);
    }
    // 2. Hàm tìm kiếm theo nguyên liệu
    async searchRecipesByIngredients(ingredients, source) {
        // Chuyển chuỗi nguyên liệu phân tách bằng dấu phẩy thành mảng để truyền vào Repository
        const ingredientsList = ingredients
            .split(',')
            .map(i => i.trim())
            .filter(Boolean);
        return this.getRepository(source).searchRecipesByIngredients(ingredientsList);
    }
    // 3. Hàm lấy chi tiết món ăn
    async getRecipeById(id, source) {
        return this.getRepository(source).getRecipeById(id);
    }
}
exports.RecipeService = RecipeService;
