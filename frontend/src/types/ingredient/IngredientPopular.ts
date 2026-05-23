import { IngredientSuggestion } from "@/lib/api-client";

export type IngredientPopularProps = {
    items: IngredientSuggestion[];
    isPending: boolean;
    onQuickAdd: (name: string) => void;
};
