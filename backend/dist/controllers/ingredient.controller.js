"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngredientController = void 0;
const ingredient_service_1 = require("../services/ingredient.service");
class IngredientController {
    service;
    constructor() {
        this.service = new ingredient_service_1.IngredientService();
    }
    search = async (req, res) => {
        try {
            const keyword = req.query.q;
            const source = req.query.source;
            if (!keyword) {
                res.status(400).json({
                    success: false,
                    error: { message: "Từ khóa tìm kiếm (q) là bắt buộc" }
                });
                return;
            }
            const result = await this.service.searchIngredients(keyword, source);
            res.status(200).json({
                success: true,
                data: result
            });
        }
        catch (error) {
            console.error("Lỗi API Search Ingredients:", error.message);
            res.status(500).json({
                success: false,
                error: { message: error.message || 'Internal server error' }
            });
        }
    };
    getPopular = async (req, res) => {
        try {
            const source = req.query.source;
            const results = await this.service.getPopularIngredients(source);
            res.status(200).json({
                success: true,
                data: results
            });
        }
        catch (error) {
            console.error('Lỗi API Get Popular:', error.message);
            res.status(500).json({
                success: false,
                error: { message: error.message || 'Internal server error' }
            });
        }
    };
}
exports.IngredientController = IngredientController;
