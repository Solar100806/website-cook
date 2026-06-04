// File: app/recipes/page.tsx (hoặc app/(routes)/recipes/page.tsx)
import { Suspense } from "react";
import RecipesPageView from "@/components/features/recipes/components/RecipePageView";

export default function RecipesPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-brand-bg px-4 pt-12">
          <p className="text-brand-muted font-jakarta">Đang tải dữ liệu...</p>
        </main>
      }
    >
      <RecipesPageView />
    </Suspense>
  );
}
