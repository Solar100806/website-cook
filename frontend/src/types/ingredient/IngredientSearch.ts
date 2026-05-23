import { IngredientSuggestion } from "@/lib/api-client";

export type IngredientSearchProps = {
    selected: string[];
    onAdd: (name: string) => void;
    onRemove: (name: string) => void;
    input: string;
    onInputChange: (val: string) => void;
    open: boolean;
    onOpenChange: (val: boolean) => void;
    debouncedInput: string;
    suggestions: IngredientSuggestion[];
    isSuggestionsFetching: boolean;
    onSearchSubmit: () => void;
    goRecipes: () => void;
};