import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchIngredientSuggestions } from '@/services/ingredient.service';
import { normalizeVietnamese } from '@/utils/vietnamese';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

function buildSelectionKeySet(names: string[]): Set<string> {
  return new Set(names.map((n) => normalizeVietnamese(n)));
}

export function useIngredientSearch(selected: string[]) {
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);

  const debouncedInput = useDebouncedValue(input.trim(), 280);

  const { data: suggestions = [], isFetching: isSuggestionsFetching } = useQuery({
    queryKey: ['ingredientSuggest', debouncedInput, 'supabase'],
    queryFn: () => fetchIngredientSuggestions(debouncedInput),
    enabled: debouncedInput.length >= 1,
    staleTime: 30_000,
  });

  const selectedKeys = useMemo(() => buildSelectionKeySet(selected), [selected]);

  const filteredSuggestions = useMemo(
    () => suggestions.filter((s) => !selectedKeys.has(normalizeVietnamese(s.name))),
    [suggestions, selectedKeys],
  );

  return {
    input,
    setInput,
    open,
    setOpen,
    debouncedInput,
    suggestions: filteredSuggestions,
    isSuggestionsFetching,
  };
}