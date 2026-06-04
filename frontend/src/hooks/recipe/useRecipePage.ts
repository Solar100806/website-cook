import { useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchRecipeSuggestions } from '@/services/recipe.service';
import { parseIngredientsFromURL } from '@/utils/parseIngredients';
import { PLACEHOLDER_IMG } from '@/constants';
import type { RecipeFromApi } from '@/lib/api-client';
import type { RecipeListItem } from '@/types';
import { ingredientNameMatchesSelection } from '@/utils/vietnamese';
import { persistRecipeForDetail } from '@/utils/recipeStorage';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Calculates match percent and resolves missing ingredients for a recipe
 * returned from the API.
 */
function mapToListItems(
  apiRecipes: RecipeFromApi[],
  selectedIngredients: string[],
): RecipeListItem[] {
  if (!apiRecipes || apiRecipes.length === 0) return [];

  return apiRecipes.map((r) => {
    const usedCount = r.usedIngredientCount ?? 0;
    const missedCount = r.missedIngredientCount ?? 0;
    const totalCount = usedCount + missedCount > 0 ? usedCount + missedCount : 1;
    const matchPercent = Math.round((usedCount / totalCount) * 100);

    // Derive the missing ingredients list
    const targetIngredients = (r.missedIngredients ?? r.ingredients ?? []) as any[];
    const missingIngredientsRaw = targetIngredients
      .filter((i: any) => !ingredientNameMatchesSelection(i.name, selectedIngredients))
      .map((i: any) => i.name as string);

    // If 100% match, force empty missing list (algorithm guarantee)
    const missingIngredients = matchPercent === 100 ? [] : missingIngredientsRaw;

    const imgRaw = r.image || r.image_url;
    const image =
      imgRaw && (imgRaw.startsWith('http') || imgRaw.startsWith('/'))
        ? imgRaw
        : PLACEHOLDER_IMG;

    return {
      id: r.id,
      title: r.title || r.name || 'Món ăn chưa có tên',
      image,
      matchPercent,
      description: r.description ?? undefined,
      missingIngredients,
      api: r,
    };
  });
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useRecipesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const ingredientsParam = searchParams.get('ingredients');
  const queryParam = searchParams.get('q');

  const selectedIngredients = useMemo(
    () => parseIngredientsFromURL(ingredientsParam),
    [ingredientsParam],
  );

  const hasFilters = Boolean(queryParam || selectedIngredients.length > 0);

  const { data: apiRecipes, isPending, isError, error } = useQuery({
    queryKey: ['recipeSuggest', selectedIngredients],
    queryFn: () => fetchRecipeSuggestions(selectedIngredients),
    enabled: selectedIngredients.length > 0,
  });

  const listItems = useMemo(
    () => (apiRecipes ? mapToListItems(apiRecipes, selectedIngredients) : []),
    [apiRecipes, selectedIngredients],
  );

  const onRecipeClick = useCallback(
    (recipe: RecipeListItem) => {
      persistRecipeForDetail(recipe.api);
      router.push(`/recipes/${recipe.api.id}`);
    },
    [router],
  );

  return {
    selectedIngredients,
    queryParam,
    hasFilters,
    listItems,
    isPending,
    isError,
    errorMessage:
      error instanceof Error ? error.message : 'Không tải được công thức.',
    onRecipeClick,
  };
}