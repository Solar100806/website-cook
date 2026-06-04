import { Router } from 'express';
import { RecipeController } from '../controllers/recipe.controller';

const recipeRouter = Router();
const recipeController = new RecipeController();

// GET /api/recipes/by-ingredients?ingredients=...
recipeRouter.get('/by-ingredients', recipeController.getRecipesByIngredients);

// GET /api/recipes?q=...
recipeRouter.get('/', recipeController.getRecipes);

// GET /api/recipes/:id
recipeRouter.get('/:id', recipeController.getRecipeById);

export default recipeRouter;
