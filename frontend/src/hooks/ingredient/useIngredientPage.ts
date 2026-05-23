import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { normalizeVietnamese } from "@/utils/vietnamese";
import { useIngredientSearch } from "./useIngredientSearch";
import { useIngredientPopular } from "./useIngredientPopular";

// Helper function
function dedupePreserveOrder(names: string[]): string[] {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const raw of names) {
        const n = raw.trim();
        if (!n) continue;
        const k = normalizeVietnamese(n);
        if (seen.has(k)) continue;
        seen.add(k);
        out.push(n);
    }
    return out;
}

export function useHomePage() {
    const router = useRouter();

    // 1. Quản lý state cốt lõi của cả trang
    const [selected, setSelected] = useState<string[]>([]);

    // 2. Gọi các hook con
    const searchLogic = useIngredientSearch(selected); // Truyền selected vào đây
    const popularLogic = useIngredientPopular();

    // 3. Các hàm xử lý tương tác
    const onAdd = useCallback((name: string) => {
        setSelected((prev) => dedupePreserveOrder([...prev, name]));
    }, []);

    const onRemove = useCallback((name: string) => {
        const k = normalizeVietnamese(name);
        setSelected((prev) => prev.filter((x) => normalizeVietnamese(x) !== k));
    }, []);

    const onSearchSubmit = useCallback(() => {
        const t = searchLogic.input.trim();
        if (!t) return;
        onAdd(t);
        searchLogic.setInput("");
        searchLogic.setOpen(false);
    }, [searchLogic.input, onAdd, searchLogic]);

    const goRecipes = useCallback(() => {
        if (selected.length === 0) return;
        const payload = encodeURIComponent(JSON.stringify(selected));
        router.push(`/recipes?ingredients=${payload}`);
    }, [selected, router]);

    // 4. Trả về payload khớp hoàn toàn với HomePageViewProps
    return {
        selected,
        onAdd,
        onRemove,
        goRecipes,
        onSearchSubmit,

        // Bóc tách từ searchLogic
        input: searchLogic.input,
        onInputChange: searchLogic.setInput,
        open: searchLogic.open,
        onOpenChange: searchLogic.setOpen,
        debouncedInput: searchLogic.debouncedInput,
        suggestions: searchLogic.suggestions,
        isSuggestionsFetching: searchLogic.isSuggestionsFetching,

        // Bóc tách từ popularLogic
        popularItems: popularLogic.popularItems,
        isPopularPending: popularLogic.isPopularPending,
    };
}