'use client';

import { useEffect, useMemo, useCallback, useState } from 'react';
import { apiFetchJson, type RecipeFromApi } from '@/lib/api-client';
import { readRecipeFromStorage } from '@/utils/recipeStorage';
import { PLACEHOLDER_IMG } from '@/constants';
import RecipeDetailPageView from '@/components/features/recipes/components/RecipeStepPageView';
import type { IngredientListItem } from '@/components/features/recipes/components/RecipeIngredientList';
import type { RecipeStepDisplay } from '@/components/features/recipes/components/RecipeCookingStep';

const STEP_IMAGES = [
  '/assets/icons/chef.svg',
  '/assets/icons/book.svg',
  '/assets/icons/search.svg',
  '/assets/icons/tick.svg',
] as const;

// ─── Data mappers ─────────────────────────────────────────────────────────────

/** Maps API ingredient data to the display format. */
function mapIngredients(api: RecipeFromApi): IngredientListItem[] {
  const rawIngredients = (api as any).extendedIngredients ?? (api as any).ingredients ?? [];

  return rawIngredients.map((i: any, idx: number) => {
    const amount = i.amount ?? i.quantity ?? '';
    const unit = i.unit ?? '';
    const qty = [amount, unit].filter(Boolean).join(' ').trim();

    return {
      id: i.id ?? idx, // use array index as stable fallback instead of Math.random()
      name: i.name ?? 'Nguyên liệu không tên',
      desc: qty || '—',
    };
  });
}

/** Maps API step data to the display format. */
function mapSteps(api: RecipeFromApi): RecipeStepDisplay[] {
  const rawSteps: any[] =
    (api as any).analyzedInstructions?.[0]?.steps?.length > 0
      ? (api as any).analyzedInstructions[0].steps
      : (api as any).steps ?? [];

  return [...rawSteps]
    .sort((a, b) => (a.number ?? a.step_order ?? 0) - (b.number ?? b.step_order ?? 0))
    .map((s, idx) => {
      const content: string = s.step ?? s.content ?? '';
      const order: number = s.number ?? s.step_order ?? idx + 1;

      const lines = content
        .split('\n')
        .map((l: string) => l.trim())
        .filter(Boolean);

      const title = lines[0] && lines[0].length <= 100 ? lines[0] : `Bước ${order}`;
      const desc = lines.length > 1 ? lines.slice(1).join('\n') : content;

      const rawImage = s.image ?? s.image_url ?? '';
      const image =
        typeof rawImage === 'string' && rawImage.trim().length > 0
          ? rawImage
          : STEP_IMAGES[idx % STEP_IMAGES.length];

      return {
        id: order,
        step: String(order).padStart(2, '0'),
        image,
        title,
        desc,
      };
    });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RecipeDetailClient({ recipeId }: { recipeId: string }) {
  const [recipe, setRecipe] = useState<RecipeFromApi | null>(null);

  useEffect(() => {
    // Show cached data immediately for instant perceived performance
    const cached = readRecipeFromStorage(recipeId);
    if (cached) setRecipe(cached);

    // Always fetch fresh data in the background
    apiFetchJson<RecipeFromApi>(`/recipes/${recipeId}`)
      .then(setRecipe)
      .catch((err) => console.error('Lỗi khi gọi API chi tiết món ăn:', err));
  }, [recipeId]);

  const ingredients = useMemo(
    () => (recipe ? mapIngredients(recipe) : []),
    [recipe],
  );

  const steps = useMemo(() => (recipe ? mapSteps(recipe) : []), [recipe]);

  const heroImage = useMemo(() => {
    const imgRaw = recipe?.image ?? (recipe as any)?.image_url;
    return imgRaw && (imgRaw.startsWith('http') || imgRaw.startsWith('/'))
      ? imgRaw
      : PLACEHOLDER_IMG;
  }, [recipe]);

  return (
    <RecipeDetailPageView
      recipe={recipe}
      ingredients={ingredients}
      steps={steps}
      heroImage={heroImage}
    />
  );
}
