"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeRecipeDetail = normalizeRecipeDetail;
const image_util_1 = require("./image.util");
function mapRawStep(rawStep, index, recipeImage) {
    const order = rawStep.number ?? rawStep.step_order ?? index + 1;
    const content = rawStep.step ?? rawStep.content ?? "";
    const fallbackImage = (0, image_util_1.extractSpoonacularStepImage)(rawStep, recipeImage) || recipeImage;
    const image = (0, image_util_1.normalizeImageUrl)(rawStep.image ?? rawStep.image_url, fallbackImage);
    return {
        number: order,
        step: content,
        step_order: order,
        content,
        image,
    };
}
function normalizeRecipeDetail(recipe) {
    const recipeImage = (0, image_util_1.normalizeImageUrl)(recipe.image ?? recipe.image_url);
    const rawSteps = recipe.analyzedInstructions?.[0]?.steps?.length > 0
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
