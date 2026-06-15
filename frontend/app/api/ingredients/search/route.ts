import { NextRequest, NextResponse } from 'next/server';
import { IngredientService } from '@/server/services/ingredient.service';

const ingredientService = new IngredientService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('q');
    const source = searchParams.get('source') ?? undefined;

    if (!keyword) {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Từ khóa tìm kiếm (q) là bắt buộc.' },
        },
        { status: 400 },
      );
    }

    const data = await ingredientService.searchIngredients(keyword, source);
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('🔴 /api/ingredients/search error:', err.message);
    return NextResponse.json(
      {
        success: false,
        error: { message: err.message || 'Internal Server Error' },
      },
      { status: 500 },
    );
  }
}
