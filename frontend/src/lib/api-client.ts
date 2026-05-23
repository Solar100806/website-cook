export type ApiSuccess<T> = { success: true; data: T };
export type ApiError = {
  success: false;
  error: { message: string; details?: unknown };
};

export type IngredientSuggestion = {
  id: number;
  name: string;
  img: string | null;
  create_at?: string;
  update_at?: string;
};

export type RecipeIngredient = {
  id: number;
  name: string;
  quantity: string;
  unit: string;
};

export type RecipeStep = {
  step_order: number;
  content: string;
};

export interface SpoonacularStep {
  number: number;
  step: string;
  ingredients?: any[];
  equipment?: any[];
}

export interface SpoonacularInstruction {
  name: string;
  steps: SpoonacularStep[];
}

/** Shape returned by `POST /recipes/suggest` */
export type RecipeFromApi = {
  id: number;
  name?: string;
  description?: string | null;
  image_url?: string | null;
  cook_time?: string | null;
  difficulty?: string | null;
  ingredients?: RecipeIngredient[];
  steps?: RecipeStep[];
  match_score?: number;

  // --- Các trường MỚI bổ sung cho API Spoonacular ---
  title?: string;
  image?: string;
  usedIngredientCount?: number;
  missedIngredientCount?: number;
  missedIngredients?: string[];
  usedIngredients?: string[];
  unusedIngredients?: string[];
  readyInMinutes?: number;
  servings?: number;
  analyzedInstructions?: SpoonacularInstruction[];
};

export async function apiFetchJson<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const url = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  const base = url || "http://localhost:4000";

  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });

  const json = (await res.json()) as ApiSuccess<T> | ApiError;

  if (!res.ok) {
    const msg =
      "success" in json && json.success === false
        ? json.error.message
        : res.statusText;
    throw new Error(msg || `Request failed: ${res.status}`);
  }

  if (!json || typeof json !== "object" || !("success" in json)) {
    throw new Error("Invalid API response");
  }

  if (json.success === false) {
    throw new Error(json.error.message);
  }

  return json.data;
}
