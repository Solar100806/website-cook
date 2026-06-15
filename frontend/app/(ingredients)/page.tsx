import { Suspense } from "react";
import HomePageView from "@/components/features/ingredient/components/IngredientPageView";

export default function HomePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex flex-col bg-brand-bg items-center justify-center">
        <p className="text-[#72544E] font-jakarta text-xl">Đang tải...</p>
      </main>
    }>
      <HomePageView />
    </Suspense>
  );
}
