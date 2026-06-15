import { NextRequest, NextResponse } from 'next/server';
import { RecipeService } from '@/server/services/recipe.service';

const recipeService = new RecipeService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ingredients = searchParams.get('ingredients');
    const source = searchParams.get('source') ?? undefined;

    if (!ingredients) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Danh sách nguyên liệu (ingredients) là bắt buộc.',
          },
        },
        { status: 400 },
      );
    }

    const data = await recipeService.searchRecipesByIngredients(
      ingredients,
      source,
    );
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('🔴 /api/recipes/by-ingredients error:', err.message);
    return NextResponse.json(
      {
        success: false,
        error: { message: err.message || 'Internal Server Error' },
      },
      { status: 500 },
    );
  }
}
