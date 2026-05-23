"use client";

import { useEffect, useMemo, useState } from "react";
import type { RecipeFromApi } from "@/lib/api-client";
import { readRecipeFromStorage } from "@/utils/recipeStorage";
import RecipeDetailPageView from "@/components/features/recipes/components/RecipeStepPageView";
import type { IngredientListItem } from "@/components/features/recipes/components/RecipeIngredientList";
import type { RecipeStepDisplay } from "@/components/features/recipes/components/RecipeCookingStep";

const STEP_IMAGES = [
  "/assets/icons/chef.svg",
  "/assets/icons/book.svg",
  "/assets/icons/search.svg",
  "/assets/icons/tick.svg",
] as const;

const BANNER = "/assets/icons/chef.svg";

// 1. ĐÃ SỬA: Tương thích với 'extendedIngredients' của Spoonacular
function mapIngredients(api: any): IngredientListItem[] {
  const rawIngredients = api.extendedIngredients || api.ingredients || [];

  return rawIngredients.map((i: any) => {
    // Spoonacular dùng 'amount', code cũ dùng 'quantity'
    const amount = i.amount || i.quantity || "";
    const unit = i.unit || "";
    const qty = [amount, unit].filter(Boolean).join(" ").trim();

    return {
      id: i.id || Math.random(),
      name: i.name || "Nguyên liệu không tên",
      desc: qty || "—",
    };
  });
}

// 2. ĐÃ SỬA: Lấy mảng bước nấu từ 'analyzedInstructions'
function mapSteps(api: any): RecipeStepDisplay[] {
  let rawSteps = [];

  if (api.analyzedInstructions && api.analyzedInstructions.length > 0) {
    rawSteps = api.analyzedInstructions[0].steps || [];
  } else if (api.steps) {
    rawSteps = api.steps;
  }

  // Sắp xếp lại nếu cần (Spoonacular đã xếp sẵn theo 'number')
  const sorted = [...rawSteps].sort((a, b) => {
    const orderA = a.number || a.step_order || 0;
    const orderB = b.number || b.step_order || 0;
    return orderA - orderB;
  });

  return sorted.map((s, idx) => {
    // Spoonacular dùng trường 'step', code cũ dùng 'content'
    const content = s.step || s.content || "";
    const order = s.number || s.step_order || idx + 1;

    const lines = content
      .split("\n")
      .map((l: string) => l.trim())
      .filter(Boolean);

    const title =
      lines[0] && lines[0].length <= 100 ? lines[0] : `Bước ${order}`;
    const desc = lines.length > 1 ? lines.slice(1).join("\n") : content;

    return {
      id: order,
      step: String(order).padStart(2, "0"),
      image: STEP_IMAGES[idx % STEP_IMAGES.length],
      title,
      desc,
    };
  });
}

export default function RecipeDetailClient({ recipeId }: { recipeId: string }) {
  const [recipe, setRecipe] = useState<RecipeFromApi | null>(null);

  useEffect(() => {
    // 1. Vẫn đọc từ Storage ra trước để hiển thị ảnh và tên ngay lập tức (không bị giật nháy màn hình)
    const cachedRecipe = readRecipeFromStorage(recipeId);
    if (cachedRecipe) {
      setRecipe(cachedRecipe);
    }

    // 2. Đồng thời gọi API Backend để lấy TẤT TẦN TẬT chi tiết (nguyên liệu, bước nấu)
    const fetchRecipeDetail = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/recipes/${recipeId}`,
        );
        const json = await res.json();

        if (json.success && json.data) {
          // Ghi đè dữ liệu full từ API vào state
          setRecipe(json.data);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API chi tiết món ăn:", error);
      }
    };

    fetchRecipeDetail();
  }, [recipeId]);

  const ingredients = useMemo(
    () => (recipe ? mapIngredients(recipe) : []),
    [recipe],
  );

  const steps = useMemo(() => (recipe ? mapSteps(recipe) : []), [recipe]);

  // 3. ĐÃ SỬA: Lấy trường 'image' thay vì 'image_url'
  const imgRaw = recipe?.image || recipe?.image_url;
  const heroImage =
    imgRaw && (imgRaw.startsWith("http") || imgRaw.startsWith("/"))
      ? imgRaw
      : BANNER;

  return (
    <RecipeDetailPageView
      recipe={recipe}
      ingredients={ingredients}
      steps={steps}
      heroImage={heroImage}
    />
  );
}
