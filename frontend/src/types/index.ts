import type { RecipeFromApi } from "@/lib/api-client";

/** Card + navigation: includes full API object for detail (sessionStorage). */
export interface RecipeListItem {
  id: number;
  title: string;
  image: string;
  matchPercent: number;
  description?: string;
  missingIngredients?: string[];
  api: RecipeFromApi;
}
