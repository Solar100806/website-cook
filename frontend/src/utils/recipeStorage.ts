import type { RecipeFromApi } from "@/lib/api-client";

const key = (id: number) => `food-app:recipe:${id}`;

export function persistRecipeForDetail(recipe: RecipeFromApi): void {
  try {
    sessionStorage.setItem(key(recipe.id), JSON.stringify(recipe));
  } catch {
    // ignore quota / private mode
  }
}

export function readRecipeFromStorage(recipeId: string): RecipeFromApi | null {
  const id = Number(recipeId);
  if (!Number.isFinite(id)) return null;
  try {
    const raw = sessionStorage.getItem(key(id));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RecipeFromApi;
    if (!parsed || typeof parsed !== "object" || parsed.id !== id) return null;
    return parsed;
  } catch {
    return null;
  }
}
