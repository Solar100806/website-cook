import { NextRequest, NextResponse } from 'next/server';
import { RecipeService } from '@/server/services/recipe.service';

const recipeService = new RecipeService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const cuisine = searchParams.get('cuisine') ?? '';
    const source = searchParams.get('source') ?? undefined;

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Từ khóa tìm kiếm (q) là bắt buộc.' },
        },
        { status: 400 },
      );
    }

    const data = await recipeService.searchRecipes(query, cuisine, source);
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('🔴 /api/recipes error:', err.message);
    return NextResponse.json(
      {
        success: false,
        error: { message: err.message || 'Internal Server Error' },
      },
      { status: 500 },
    );
  }
}
