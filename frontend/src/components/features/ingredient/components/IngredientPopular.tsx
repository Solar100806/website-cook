import { IngredientPopularProps } from "@/types/ingredient/IngredientPopular";
import IngredientCard from "./IngredientCard";

const PLACEHOLDER_IMG = "/assets/icons/chef.svg";

export default function IngredientPopular({
  items,
  isPending,
  onQuickAdd,
}: IngredientPopularProps) {
  return (
    <section className="w-full flex flex-col items-center mt-12 px-16">
      <h2 className="text-[30px] font-bold font-epilogue text-brand-orange text-[#9B3F00] ">
        Nguyên liệu phổ biến
      </h2>
      {isPending ? (
        <p className="mt-8 text-brand-muted font-jakarta">
          Đang tải gợi ý từ máy chủ…
        </p>
      ) : items.length === 0 ? (
        <p className="mt-8 text-brand-muted font-jakarta text-center max-w-md">
          Không có dữ liệu để hiển thị
        </p>
      ) : (
        <ul className="grid grid-cols-5 gap-4 mt-12 w-full">
          {items.map((item) => (
            <li key={item.id}>
              <IngredientCard
                name={item.name}
                image={
                  item.img && item.img.startsWith("http")
                    ? item.img
                    : PLACEHOLDER_IMG
                }
                onAdd={() => onQuickAdd(item.name)}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
