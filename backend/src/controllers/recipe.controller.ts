import { Request, Response, NextFunction } from 'express';
import { RecipeService } from '../services/recipe.service';
import { asyncHandler } from '../utils/controller.util';

const recipeService = new RecipeService();

export class RecipeController {
  /** GET /api/recipes?q=...&cuisine=...&source=... */
  getRecipes = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const query = req.query.q as string;
    const cuisine = (req.query.cuisine as string) ?? '';
    const source = req.query.source as string | undefined;

    if (!query) {
      res.status(400).json({
        success: false,
        error: { message: 'Từ khóa tìm kiếm (q) là bắt buộc.' },
      });
      return;
    }

    const data = await recipeService.searchRecipes(query, cuisine, source);
    res.status(200).json({ success: true, data });
  });

  /** GET /api/recipes/by-ingredients?ingredients=...&source=... */
  getRecipesByIngredients = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const ingredients = req.query.ingredients as string;
      const source = req.query.source as string | undefined;

      if (!ingredients) {
        res.status(400).json({
          success: false,
          error: { message: 'Danh sách nguyên liệu (ingredients) là bắt buộc.' },
        });
        return;
      }

      const data = await recipeService.searchRecipesByIngredients(ingredients, source);
      res.status(200).json({ success: true, data });
    },
  );

  /** GET /api/recipes/:id?source=... */
  getRecipeById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const source = req.query.source as string | undefined;

    if (!id) {
      res.status(400).json({
        success: false,
        error: { message: 'ID món ăn là bắt buộc.' },
      });
      return;
    }

    const data = await recipeService.getRecipeById(id, source);
    res.status(200).json({ success: true, data });
  });
}