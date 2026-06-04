import type { IngredientSuggestion } from '@/lib/api-client';

// ─── IngredientCard ───────────────────────────────────────────────────────────
export type IngredientCardProps = {
  name: string;
  image: string;
  onAdd: () => void;
  isAdded?: boolean;
};

// ─── IngredientPopular ────────────────────────────────────────────────────────
export type IngredientPopularProps = {
  items: IngredientSuggestion[];
  isPending: boolean;
  onQuickAdd: (name: string) => void;
  selected: string[];
};

// ─── IngredientSearch ─────────────────────────────────────────────────────────
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
