import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { normalizeVietnamese } from '@/utils/vietnamese';
import { parseIngredientsFromURL } from '@/utils/parseIngredients';
import { SESSION_STORAGE_KEYS } from '@/constants';
import { useIngredientSearch } from './useIngredientSearch';
import { useIngredientPopular } from './useIngredientPopular';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Deduplicates ingredient names while preserving insertion order. */
function dedupePreserveOrder(names: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of names) {
    const n = raw.trim();
    if (!n) continue;
    const key = normalizeVietnamese(n);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(n);
  }
  return out;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Orchestrates all state and logic for the ingredient selection page.
 * Persists selections to sessionStorage and syncs with URL search params.
 */
export function useIngredientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── Selected ingredients ─────────────────────────────────────────────────
  const [selected, setSelected] = useState<string[]>([]);

  const selectedFromUrl = useMemo(
    () => dedupePreserveOrder(parseIngredientsFromURL(searchParams.get('ingredients'))),
    [searchParams],
  );

  // Restore from URL or sessionStorage on mount
  useEffect(() => {
    if (selectedFromUrl.length > 0) {
      setSelected(selectedFromUrl);
      return;
    }
    try {
      const cached = sessionStorage.getItem(SESSION_STORAGE_KEYS.selectedIngredients);
      if (!cached) return;
      const parsed = JSON.parse(cached) as unknown;
      if (!Array.isArray(parsed)) return;
      const restored = dedupePreserveOrder(
        parsed.filter((x): x is string => typeof x === 'string' && x.trim().length > 0),
      );
      if (restored.length > 0) setSelected(restored);
    } catch (err) {
      console.error('[useIngredientPage] Failed to read sessionStorage:', err);
    }
  }, [selectedFromUrl]);

  // Persist selected to sessionStorage whenever it changes
  useEffect(() => {
    try {
      sessionStorage.setItem(
        SESSION_STORAGE_KEYS.selectedIngredients,
        JSON.stringify(selected),
      );
    } catch (err) {
      console.error('[useIngredientPage] Failed to write sessionStorage:', err);
    }
  }, [selected]);

  // ── Sub-hooks ────────────────────────────────────────────────────────────
  const searchLogic = useIngredientSearch(selected);
  const popularLogic = useIngredientPopular();

  // ── Handlers ─────────────────────────────────────────────────────────────
  const onAdd = useCallback((name: string) => {
    setSelected((prev) => dedupePreserveOrder([...prev, name]));
  }, []);

  const onRemove = useCallback((name: string) => {
    const key = normalizeVietnamese(name);
    setSelected((prev) => prev.filter((x) => normalizeVietnamese(x) !== key));
  }, []);

  const onSearchSubmit = useCallback(() => {
    const trimmed = searchLogic.input.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    searchLogic.setInput('');
    searchLogic.setOpen(false);
  }, [searchLogic, onAdd]);

  const goRecipes = useCallback(() => {
    if (selected.length === 0) return;
    const payload = encodeURIComponent(JSON.stringify(selected));
    router.push(`/recipes?ingredients=${payload}`);
  }, [selected, router]);

  return {
    selected,
    onAdd,
    onRemove,
    goRecipes,
    onSearchSubmit,
    // Search
    input: searchLogic.input,
    onInputChange: searchLogic.setInput,
    open: searchLogic.open,
    onOpenChange: searchLogic.setOpen,
    debouncedInput: searchLogic.debouncedInput,
    suggestions: searchLogic.suggestions,
    isSuggestionsFetching: searchLogic.isSuggestionsFetching,
    // Popular
    popularItems: popularLogic.popularItems,
    isPopularPending: popularLogic.isPopularPending,
  };
}