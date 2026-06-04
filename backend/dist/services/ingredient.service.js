"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IngredientService = void 0;
const ingredient_repository_1 = require("../repository/ingredient.repository");
const data_source_util_1 = require("../utils/data-source.util");
class IngredientService {
    getRepository(source) {
        const dataSource = (0, data_source_util_1.resolveDataSource)(source);
        if (dataSource === "supabase") {
            return new ingredient_repository_1.SupabaseIngredientRepository();
        }
        return new ingredient_repository_1.SpoonacularIngredientRepository();
    }
    async searchIngredients(keyword, source) {
        return this.getRepository(source).searchIngredients(keyword);
    }
    async getPopularIngredients(source) {
        return this.getRepository(source).getPopularIngredients();
    }
}
exports.IngredientService = IngredientService;
