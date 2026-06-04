import { Request, Response } from 'express';
import { IngredientService } from '../services/ingredient.service';
import { asyncHandler } from '../utils/controller.util';

const ingredientService = new IngredientService();

export class IngredientController {
  /** GET /api/ingredients/search?q=...&source=... */
  search = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const keyword = req.query.q as string;
    const source = req.query.source as string | undefined;

    if (!keyword) {
      res.status(400).json({
        success: false,
        error: { message: 'Từ khóa tìm kiếm (q) là bắt buộc.' },
      });
      return;
    }

    const data = await ingredientService.searchIngredients(keyword, source);
    res.status(200).json({ success: true, data });
  });

  /** GET /api/ingredients/popular?source=... */
  getPopular = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const source = req.query.source as string | undefined;
    const data = await ingredientService.getPopularIngredients(source);
    res.status(200).json({ success: true, data });
  });
}