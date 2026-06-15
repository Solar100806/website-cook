import { NextRequest, NextResponse } from 'next/server';
import { IngredientService } from '@/server/services/ingredient.service';

const ingredientService = new IngredientService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source') ?? undefined;

    const data = await ingredientService.getPopularIngredients(source);
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('🔴 /api/ingredients/popular error:', err.message);
    return NextResponse.json(
      {
        success: false,
        error: { message: err.message || 'Internal Server Error' },
      },
      { status: 500 },
    );
  }
}
