import { apiFetchJson } from "@/lib/api-client";
import type { RecipeFromApi } from "@/lib/api-client";

export function fetchRecipeSuggestions(
  ingredients: string[],
): Promise<RecipeFromApi[]> {
  const names = ingredients.map((s) => s.trim()).filter(Boolean);
  if (names.length === 0) return Promise.resolve([]);

  const ingredientsQuery = names.join(",");

  return apiFetchJson<RecipeFromApi[]>(
    `/recipes/by-ingredients?ingredients=${ingredientsQuery}`,
    {
      method: "GET",
    }
  );
}
