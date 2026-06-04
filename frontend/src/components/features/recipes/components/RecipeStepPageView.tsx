import Image from "next/image";
import IngredientList, {
  type IngredientListItem,
} from "./RecipeIngredientList";
import RecipeStep, { type RecipeStepDisplay } from "./RecipeCookingStep";
import type { RecipeFromApi } from "@/lib/api-client";

interface RecipeDetailPageViewProps {
  recipe: RecipeFromApi | null;
  ingredients: IngredientListItem[];
  steps: RecipeStepDisplay[];
  heroImage: string;
}

export default function RecipeDetailPageView({
  recipe,
  ingredients,
  steps,
  heroImage,
}: RecipeDetailPageViewProps) {
  if (!recipe) {
    return (
      <main className="min-h-screen flex flex-col bg-brand-bg items-center justify-center px-4">
        <p className="text-brand-muted font-jakarta text-center max-w-md">
          Không có dữ liệu chi tiết trong phiên làm việc. Hãy quay lại danh sách
          gợi ý và chọn một công thức để xem chi tiết. Nếu bạn vừa tạo công thức
          mới, hãy đảm bảo rằng bạn đã lưu nó trước khi quay lại đây.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-brand-bg">
      <div className="w-full mx-auto">
        <section className="relative h-80 w-full overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={heroImage}
              alt={recipe.title || recipe.name || "Hình ảnh món ăn"}
              fill
              className="object-cover"
              unoptimized={heroImage.startsWith("http")}
              priority
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-8 left-8 flex flex-col gap-3 ml-20">
            <span className="w-fit rounded-[8px] font-jakarta text-base text-white border border-white/30 px-2 py-1 bg-white/20">
              LỰA CHỌN CỦA BẠN
            </span>
            <h1 className="text-[40px] font-jakarta font-bold text-white">
              {recipe.title || recipe.name}
            </h1>
            <p className="text-sm font-jakarta text-white/80 max-w-xl">
              {recipe.description || ""}
              {recipe.cook_time ? ` · ${recipe.cook_time}` : ""}
              {recipe.difficulty ? ` · ${recipe.difficulty}` : ""}
            </p>
          </div>
        </section>
        <div className="px-4 mt-10 grid grid-cols-12 gap-10">
          <IngredientList items={ingredients} />
          <RecipeStep steps={steps} />
        </div>
      </div>
    </main>
  );
}
