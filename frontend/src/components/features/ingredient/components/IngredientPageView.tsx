"use client";

import {
  IngredientPopular,
  IngredientSearch,
} from "@/components/features/ingredient";
import { useHomePage } from "@/hooks/ingredient/useIngredientPage";

export default function HomePageView() {
  const {
    selected,
    onAdd,
    onRemove,
    input,
    onInputChange,
    open,
    onOpenChange,
    debouncedInput,
    suggestions,
    isSuggestionsFetching,
    onSearchSubmit,
    goRecipes,
    popularItems,
    isPopularPending,
  } = useHomePage();

  return (
    <main className="min-h-screen flex flex-col bg-brand-bg">
      <div className="w-full max-w-7xl px-2 pt-16 mx-auto">
        <header className="text-center">
          <h1 className="text-7xl text-brand-orange font-bold font-epilogue text-[#9B3F00]">
            Hôm nay bạn muốn ăn gì?
          </h1>
          <div className="flex justify-center">
            <p className="max-w-167.5 mt-6 text-2xl text-brand-muted font-medium font-jakarta">
              Nhập nguyên liệu bạn đang có, chúng tôi sẽ gợi ý món ngon chuẩn vị
              nhất.
            </p>
          </div>
        </header>

        <IngredientSearch
          selected={selected}
          onAdd={onAdd}
          onRemove={onRemove}
          input={input}
          onInputChange={onInputChange}
          open={open}
          onOpenChange={onOpenChange}
          debouncedInput={debouncedInput}
          suggestions={suggestions}
          isSuggestionsFetching={isSuggestionsFetching}
          onSearchSubmit={onSearchSubmit}
          goRecipes={goRecipes}
        />

        <IngredientPopular
          items={popularItems}
          isPending={isPopularPending}
          onQuickAdd={onAdd}
        />
      </div>
    </main>
  );
}
