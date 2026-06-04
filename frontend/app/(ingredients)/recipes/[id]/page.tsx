import RecipeDetailClient from "./RecipeDetailClient";

interface StepPageProps {
  params: Promise<{ id: string }>;
}

export default async function StepPage({ params }: StepPageProps) {
  const { id } = await params;
  return <RecipeDetailClient recipeId={id} />;
}
