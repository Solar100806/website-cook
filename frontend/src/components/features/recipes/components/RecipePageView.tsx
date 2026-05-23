"use client";

import { useRecipesPage } from "@/hooks/recipe/useRecipePage";
import RecipeList from "./RecipeList";

export default function RecipesPageView() {
  const {
    selectedIngredients,
    queryParam,
    hasFilters,
    listItems,
    isPending,
    isError,
    errorMessage,
    onRecipeClick,
  } = useRecipesPage();

  return (
    <main className="min-h-screen flex flex-col bg-brand-bg">
      <div className="w-full max-w-[1280px] mx-auto pt-12 px-4">
        <header className="max-w-[1232px] w-full">
          <h1 className="text-7xl font-epilogue font-extrabold mb-5">
            Gợi ý <span className="text-brand-orange italic">hôm nay.</span>
          </h1>
          <p className="max-w-[637px] w-full text-[20px] text-brand-muted font-jakarta">
            Chúng tôi đã tìm thấy những công thức tuyệt vời dựa trên nguyên liệu
            bạn hiện có. Tận hưởng hương vị tươi mới ngay tại nhà.
          </p>
          {hasFilters ? (
            <p className="mt-4 text-sm text-brand-muted font-jakarta">
              {queryParam ? `Từ khóa: "${queryParam}". ` : null}
              {selectedIngredients.length > 0
                ? `Nguyên liệu: ${selectedIngredients.join(", ")}.`
                : null}
            </p>
          ) : null}
        </header>

        {selectedIngredients.length === 0 ? (
          <p className="mt-12 text-brand-muted font-jakarta max-w-xl">
            Chưa có danh sách nguyên liệu. Hãy quay lại trang chủ, chọn nguyên
            liệu rồi bấm &quot;Tìm kiếm công thức&quot;.
          </p>
        ) : isPending ? (
          <p className="mt-12 text-brand-muted font-jakarta">
            Đang gọi API gợi ý công thức…
          </p>
        ) : isError ? (
          <p className="mt-12 text-red-600 font-jakarta">{errorMessage}</p>
        ) : listItems.length === 0 ? (
          <p className="mt-12 text-brand-muted font-jakarta">
            Không có công thức phù hợp với bộ nguyên liệu này.
          </p>
        ) : (
          <RecipeList recipes={listItems} onRecipeClick={onRecipeClick} />
        )}
      </div>
    </main>
  );
}
