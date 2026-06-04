"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeController = void 0;
const recipe_service_1 = require("../services/recipe.service");
const recipeService = new recipe_service_1.RecipeService();
class RecipeController {
    // 1. Hàm xử lý tìm kiếm chung (yêu cầu param ?q=...)
    async getRecipes(req, res) {
        try {
            const query = req.query.q;
            const cuisine = req.query.cuisine;
            const source = req.query.source;
            if (!query) {
                res.status(400).json({ success: false, error: { message: 'Từ khóa tìm kiếm (q) là bắt buộc.' } });
                return;
            }
            const data = await recipeService.searchRecipes(query, cuisine || '', source);
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, error: { message: error.message } });
        }
    }
    // 2. HÀM MỚI CẦN THÊM: Xử lý tìm kiếm theo nguyên liệu (yêu cầu param ?ingredients=...)
    async getRecipesByIngredients(req, res) {
        try {
            const ingredients = req.query.ingredients;
            const source = req.query.source;
            if (!ingredients) {
                res.status(400).json({ success: false, error: { message: 'Danh sách nguyên liệu (ingredients) là bắt buộc.' } });
                return;
            }
            // Gọi hàm searchRecipesByIngredients từ Service
            const data = await recipeService.searchRecipesByIngredients(ingredients, source);
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, error: { message: error.message } });
        }
    }
    // 3. HÀM Lấy chi tiết món ăn
    async getRecipeById(req, res) {
        try {
            const id = req.params.id;
            const source = req.query.source;
            if (!id) {
                res.status(400).json({ success: false, error: { message: 'ID món ăn là bắt buộc.' } });
                return;
            }
            const data = await recipeService.getRecipeById(id, source);
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({ success: false, error: { message: error.message } });
        }
    }
}
exports.RecipeController = RecipeController;
