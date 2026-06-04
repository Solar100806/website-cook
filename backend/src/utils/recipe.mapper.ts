import { extractSpoonacularStepImage, normalizeImageUrl } from "./image.util";

export interface NormalizedRecipeStep {
  number: number;
  step: string;
  step_order: number;
  content: string;
  image: string;
}

function mapRawStep(
  rawStep: {
    number?: number;
    step_order?: number;
    step?: string;
    content?: string;
    image?: string;
    image_url?: string;
    ingredients?: Array<{ image?: string }>;
    equipment?: Array<{ image?: string }>;
  },
  index: number,
  recipeImage: string,
): NormalizedRecipeStep {
  const order = rawStep.number ?? rawStep.step_order ?? index + 1;
  const content = rawStep.step ?? rawStep.content ?? "";

  const fallbackImage =
    extractSpoonacularStepImage(rawStep, recipeImage) || recipeImage;

  const image = normalizeImageUrl(
    rawStep.image ?? rawStep.image_url,
    fallbackImage,
  );

  return {
    number: order,
    step: content,
    step_order: order,
    content,
    image,
  };
}

export function normalizeRecipeDetail(recipe: any): any {
  const recipeImage = normalizeImageUrl(recipe.image ?? recipe.image_url);

  const rawSteps =
    recipe.analyzedInstructions?.[0]?.steps?.length > 0
      ? recipe.analyzedInstructions[0].steps
      : recipe.steps ?? [];

  const steps = [...rawSteps]
    .sort((a, b) => {
      const orderA = a.number ?? a.step_order ?? 0;
      const orderB = b.number ?? b.step_order ?? 0;
      return orderA - orderB;
    })
    .map((step, index) => mapRawStep(step, index, recipeImage));

  return {
    ...recipe,
    image: recipeImage || recipe.image || "",
    image_url: recipeImage || recipe.image_url || "",
    analyzedInstructions: [{ name: "", steps }],
    steps: steps.map((step) => ({
      step_order: step.step_order,
      content: step.content,
      image: step.image,
    })),
  };
}
