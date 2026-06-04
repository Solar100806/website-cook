// ─── Shared primitive types ───────────────────────────────────────────────────

export interface ExtendedIngredient {
  id: number;
  name: string;
  amount: string | number;
  unit: string;
  image: string;
}

export interface RecipeStep {
  number: number;
  step: string;
  image: string;
}

export interface RecipeStepNormalized extends RecipeStep {
  step_order: number;
  content: string;
}

// ─── Search result (list view) ────────────────────────────────────────────────

export interface RecipeSearchItem {
  id: number | string;
  title: string;
  image: string;
  description: string;
  cook_time: string;
  difficulty: string;
  cuisine?: string;
}

export interface RecipeSearchResult {
  results: RecipeSearchItem[];
}

// ─── By-ingredients result ────────────────────────────────────────────────────

export interface RecipeByIngredientItem extends RecipeSearchItem {
  name: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  usedIngredients: ExtendedIngredient[];
  missedIngredients: ExtendedIngredient[];
  unusedIngredients: ExtendedIngredient[];
  extendedIngredients: ExtendedIngredient[];
}

// ─── Recipe detail ────────────────────────────────────────────────────────────

export interface RecipeDetail {
  id: number | string;
  title: string;
  name: string;
  description: string;
  image: string;
  image_url: string;
  cook_time: string;
  difficulty: string;
  extendedIngredients: ExtendedIngredient[];
  analyzedInstructions: Array<{
    name: string;
    steps: RecipeStep[];
  }>;
  steps: RecipeStepNormalized[];
}
