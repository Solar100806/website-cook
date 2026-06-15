"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/recipe.route.ts
const express_1 = require("express");
const recipe_controller_1 = require("../controllers/recipe.controller");
const recipeRouter = (0, express_1.Router)();
const recipeController = new recipe_controller_1.RecipeController();
// 1. Tìm theo nguyên liệu
recipeRouter.get('/by-ingredients', recipeController.getRecipesByIngredients);
// 2. Tìm kiếm chung (bằng biến q)
recipeRouter.get('/', recipeController.getRecipes);
recipeRouter.get('/:id', recipeController.getRecipeById);
exports.default = recipeRouter;
