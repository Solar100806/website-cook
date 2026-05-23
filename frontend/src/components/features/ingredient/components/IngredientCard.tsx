import { IngredientCardProps } from "@/types/ingredient/Ingredientcard";
import Image from "next/image";

export default function IngredientCard({
  name,
  image,
  onAdd,
}: IngredientCardProps) {
  return (
    <article className="flex flex-col items-center bg-white rounded-[32px] p-5 shadow-[0px_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0px_10px_40px_rgba(0,0,0,0.08)] transition-all duration-300 group">
      <div className="relative aspect-square max-w-32.5 w-full rounded-[24px] overflow-hidden ">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
          unoptimized={image.startsWith("http")}
        />
      </div>
      <h3 className="mt-5 mb-6 font-epilogue text-[20px] font-bold text-brand-brown">
        {name}
      </h3>
      <button
        type="button"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-full  font-bold text-[16px] cursor-pointer active:scale-95 transition-transform bg-[#FFEDE9] text-brand-orange"
        onClick={onAdd}
      >
        <span className="text-xl leading-none font-light">+</span>
        Thêm
      </button>
    </article>
  );
}
