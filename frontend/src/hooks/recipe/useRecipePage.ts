import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchRecipeSuggestions } from "@/services/recipe.service";
import type { RecipeFromApi } from "@/lib/api-client";
import type { RecipeListItem } from "@/types";
import { ingredientNameMatchesSelection } from "@/utils/vietnamese";
import { persistRecipeForDetail } from "@/utils/recipeStorage";

const PLACEHOLDER_IMG = "/assets/icons/chef.svg";

// --- Helpers ---
function parseIngredientsFromSearchParams(raw: string | null): string[] {
    if (!raw) return [];
    const decoded = (() => {
        try {
            return decodeURIComponent(raw);
        } catch {
            return raw;
        }
    })();
    try {
        const parsed = JSON.parse(decoded) as unknown;
        if (Array.isArray(parsed)) {
            return parsed.filter(
                (x): x is string => typeof x === "string" && x.trim().length > 0,
            );
        }
    } catch {
        /* fall through */
    }
    if (decoded.includes(",")) {
        return decoded
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    }
    return decoded.trim() ? [decoded.trim()] : [];
}

function mapToListItems(
    apiRecipes: RecipeFromApi[], // Dùng tạm any hoặc bạn cần update lại type RecipeFromApi
    selectedIngredients: string[],
): RecipeListItem[] {
    if (!apiRecipes || apiRecipes.length === 0) return [];

    // Spoonacular không có match_score, nên ta tạm dùng usedIngredientCount để tính điểm
    const maxScore = Math.max(1, ...apiRecipes.map((r) => r.usedIngredientCount || 1));

    return apiRecipes.map((r) => {
        // 1. SỬA CÔNG THỨC TÍNH % KHỚP CHÍNH XÁC TUYỆT ĐỐI
        // Tính tổng số nguyên liệu của riêng món này thay vì so sánh với maxScore
        const usedCount = r.usedIngredientCount || 0;
        const missedCount = r.missedIngredientCount || 0;
        const totalCount = usedCount + missedCount > 0 ? usedCount + missedCount : 1; // Tránh lỗi chia cho 0
        const matchPercent = Math.round((usedCount / totalCount) * 100);

        // 2. LẤY DANH SÁCH NGUYÊN LIỆU THIẾU
        const targetIngredients = r.missedIngredients || r.ingredients || [];
        const missingIngredientsRaw = targetIngredients
            .filter(
                (i: any) => !ingredientNameMatchesSelection(i.name, selectedIngredients),
            )
            .map((i: any) => i.name);

        // 3. BẢO HIỂM UI (FAILSAFE CHỐNG LỖI HIỂN THỊ)
        // Nếu thuật toán đã báo khớp 100%, ép buộc danh sách thiếu phải là mảng rỗng
        const missingIngredients = matchPercent === 100 ? [] : missingIngredientsRaw;

        // 4. XỬ LÝ HÌNH ẢNH
        const imgRaw = r.image || r.image_url;
        const image =
            imgRaw && imgRaw.startsWith("http")
                ? imgRaw
                : imgRaw || PLACEHOLDER_IMG;

        return {
            id: r.id,
            title: r.title || r.name || "Món ăn chưa có tên",
            image,
            matchPercent,
            description: r.description || undefined,
            missingIngredients,
            api: r,
        };
    });
}

// --- Custom Hook ---
export function useRecipesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const ingredientsParam = searchParams.get("ingredients");
    const queryParam = searchParams.get("q");

    const selectedIngredients = useMemo(
        () => parseIngredientsFromSearchParams(ingredientsParam),
        [ingredientsParam],
    );

    const hasFilters = Boolean(queryParam || selectedIngredients.length > 0);

    const {
        data: apiRecipes,
        isPending,
        isError,
        error,
    } = useQuery({
        queryKey: ["recipeSuggest", selectedIngredients],
        queryFn: () => fetchRecipeSuggestions(selectedIngredients),
        enabled: selectedIngredients.length > 0,
    });

    const listItems = useMemo(
        () => (apiRecipes ? mapToListItems(apiRecipes, selectedIngredients) : []),
        [apiRecipes, selectedIngredients],
    );

    const onRecipeClick = (recipe: RecipeListItem) => {
        persistRecipeForDetail(recipe.api);
        router.push(`/recipes/${recipe.api.id}`);
    };

    return {
        selectedIngredients,
        queryParam,
        hasFilters,
        listItems,
        isPending,
        isError,
        errorMessage: error instanceof Error ? error.message : "Không tải được công thức.",
        onRecipeClick,
    };
}