import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchIngredientSuggestions } from "@/services/ingredient.service";
import { normalizeVietnamese } from "@/utils/vietnamese";

// Helper hook
function useDebouncedValue<T>(value: T, delayMs: number): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delayMs);
        return () => clearTimeout(t);
    }, [value, delayMs]);
    return debounced;
}

function selectionKeySet(names: string[]): Set<string> {
    return new Set(names.map((n) => normalizeVietnamese(n)));
}

export function useIngredientSearch(selected: string[]) {
    const [input, setInput] = useState("");
    const [open, setOpen] = useState(false);
    const debouncedInput = useDebouncedValue(input.trim(), 280);

    const { data: suggestions = [], isFetching: isSuggestionsFetching } =
        useQuery({
            queryKey: ["ingredientSuggest", debouncedInput],
            queryFn: () => fetchIngredientSuggestions(debouncedInput),
            enabled: debouncedInput.length >= 1,
            staleTime: 30_000,
        });

    const selectedKeys = useMemo(() => selectionKeySet(selected), [selected]);
    const filteredSuggestions = useMemo(
        () =>
            suggestions.filter((s: any) => !selectedKeys.has(normalizeVietnamese(s.name))),
        [suggestions, selectedKeys]
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