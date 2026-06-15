import { NextRequest, NextResponse } from 'next/server';
import { RecipeService } from '@/server/services/recipe.service';

const recipeService = new RecipeService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source') ?? undefined;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'ID món ăn là bắt buộc.' },
        },
        { status: 400 },
      );
    }

    const data = await recipeService.getRecipeById(id, source);
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('🔴 /api/recipes/[id] error:', err.message);

    const status = err.message?.includes('không tìm thấy') ? 404 : 500;
    return NextResponse.json(
      {
        success: false,
        error: { message: err.message || 'Internal Server Error' },
      },
      { status },
    );
  }
}
