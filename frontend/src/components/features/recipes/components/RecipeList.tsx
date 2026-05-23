import RecipeCard from "./RecipeCard";
import type { RecipeListItem } from "@/types";

type RecipeListProps = {
  recipes: RecipeListItem[];
  onRecipeClick: (recipe: RecipeListItem) => void;
};

export default function RecipeList({ recipes, onRecipeClick }: RecipeListProps) {
  if (recipes.length === 0) return null;

  return (
    <section className="grid grid-cols-3 gap-x-4 gap-y-10 mt-16">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onRecipeClick={() => onRecipeClick(recipe)}
        />
      ))}
    </section>
  );
}
