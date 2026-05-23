import { apiFetchJson } from "@/lib/api-client";
import type { IngredientSuggestion } from "@/lib/api-client";

export function fetchIngredientSuggestions(
  q: string,
): Promise<IngredientSuggestion[]> {
  const trimmed = q.trim();
  if (!trimmed) return Promise.resolve([]);

  const params = new URLSearchParams({ q: trimmed });
  return apiFetchJson<IngredientSuggestion[]>(
    `/ingredients/search?${params.toString()}`,
  );
}
