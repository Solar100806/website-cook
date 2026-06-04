// src/routes/recipe.route.ts
import { Router } from 'express';
import { RecipeController } from '../controllers/recipe.controller';

const recipeRouter = Router();
const recipeController = new RecipeController();

// 1. Tìm theo nguyên liệu
recipeRouter.get('/by-ingredients', recipeController.getRecipesByIngredients);

// 2. Tìm kiếm chung (bằng biến q)
recipeRouter.get('/', recipeController.getRecipes);

recipeRouter.get('/:id', recipeController.getRecipeById);

export default recipeRouter;