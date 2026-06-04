import { useQuery } from "@tanstack/react-query";
import { apiFetchJson } from "@/lib/api-client";
import type { IngredientSuggestion } from "@/lib/api-client";

export function useIngredientPopular() {
    const { data: popularItems = [], isPending: isPopularPending } = useQuery({
        queryKey: ["ingredientPopular"],
        queryFn: () => apiFetchJson<IngredientSuggestion[]>("/ingredients/popular"),
        staleTime: 5 * 60_000, // Cache trong 5 phút
    });

    return { popularItems, isPopularPending };
}