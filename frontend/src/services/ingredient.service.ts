import { apiFetchJson } from "@/lib/api-client";
import type { IngredientSuggestion } from "@/lib/api-client";

export function fetchIngredientSuggestions(
  q: string,
): Promise<IngredientSuggestion[]> {
  const normalizedQuery = q.trim().replace(/\s+/g, " ");
  if (!normalizedQuery) return Promise.resolve([]);

  const params = new URLSearchParams({
    q: normalizedQuery,
    source: "supabase",
  });

  return apiFetchJson<IngredientSuggestion[]>(
    `/ingredients/search?${params.toString()}`,
  ).then((items) => {
    const qLower = normalizedQuery.toLocaleLowerCase();
    const seen = new Set<string>();

    return items
      .filter((item) => {
        const name = (item.name || "").trim();
        if (!name) return false;

        const lower = name.toLocaleLowerCase();
        if (!lower.includes(qLower)) return false;
        if (seen.has(lower)) return false;

        seen.add(lower);
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  });
}
