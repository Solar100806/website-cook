const SPOONACULAR_INGREDIENT_CDN =
  "https://spoonacular.com/cdn/ingredients_100x100";
const SPOONACULAR_EQUIPMENT_CDN =
  "https://spoonacular.com/cdn/equipment_100x100";

export function normalizeImageUrl(
  value: string | null | undefined,
  fallback = "",
): string {
  if (!value || typeof value !== "string") return fallback;

  const trimmed = value.trim();
  if (!trimmed) return fallback;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  if (trimmed.includes("/")) {
    return `https://spoonacular.com/cdn/${trimmed}`;
  }

  return `${SPOONACULAR_INGREDIENT_CDN}/${trimmed}`;
}

export function extractSpoonacularStepImage(
  step: {
    image?: string;
    ingredients?: Array<{ image?: string }>;
    equipment?: Array<{ image?: string }>;
  },
  recipeImage = "",
): string {
  if (step.image) {
    return normalizeImageUrl(step.image, recipeImage);
  }

  const ingredientImage = step.ingredients?.find((item) => item.image)?.image;
  if (ingredientImage) {
    return `${SPOONACULAR_INGREDIENT_CDN}/${ingredientImage}`;
  }

  const equipmentImage = step.equipment?.find((item) => item.image)?.image;
  if (equipmentImage) {
    return `${SPOONACULAR_EQUIPMENT_CDN}/${equipmentImage}`;
  }

  return recipeImage;
}
