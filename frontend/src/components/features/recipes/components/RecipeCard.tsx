import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import type { RecipeListItem } from "@/types";

const PLACEHOLDER_IMG = "/assets/icons/chef.svg";

type RecipeCardProps = {
  recipe: RecipeListItem;
  onRecipeClick: () => void;
};

export default function RecipeCard({ recipe, onRecipeClick }: RecipeCardProps) {
  const { title, image, matchPercent, missingIngredients, description } =
    recipe;
  const isMatch = matchPercent === 100;

  const resolvedImage =
    image && (image.startsWith("http") || image.startsWith("/"))
      ? image
      : PLACEHOLDER_IMG;

  return (
    <article className="max-w-[384px] w-full rounded-[32px] shadow-[0_12px_40px_0_rgba(65,41,35,0.06)] flex flex-col h-full">
      <figure className="relative max-w-[384px] w-full m-0 h-[288px]">
        <Image
          src={resolvedImage}
          alt={title}
          fill
          className="rounded-t-[32px] object-cover"
          unoptimized={resolvedImage.startsWith("http")}
        />
        {isMatch ? (
          <figcaption className="absolute top-4 left-4 w-[130px] py-2 flex items-center justify-center gap-2 bg-[#366700] rounded-full">
            <Image src="/assets/icons/tick.svg" alt="" width={12} height={12} />
            <span className="text-xs font-bold font-jakarta text-[#D7FFB2]">
              KHỚP {matchPercent}%
            </span>
          </figcaption>
        ) : (
          <figcaption className="absolute top-4 left-4 w-[107px] py-2 flex items-center justify-center gap-2 bg-[#FDD34D] rounded-full">
            <span className="text-xs font-bold font-jakarta text-[#5C4900]">
              KHỚP {matchPercent}%
            </span>
          </figcaption>
        )}
      </figure>

      <div className="flex flex-col flex-1 px-8 py-6 justify-between">
        <div>
          <h3 className="text-2xl text-brand-brown font-epilogue font-bold mb-2">
            {title}
          </h3>

          {/* ĐÃ SỬA Ở ĐÂY 1: Thêm dòng text mô tả khi khớp 100% y hệt Figma */}
          {isMatch ? (
            <p className="w-full text-sm text-brand-muted font-jakarta leading-relaxed mt-4">
              Sẵn sàng để nấu. Bạn đã có đủ tất cả nguyên liệu cần thiết cho món
              ăn này.
            </p>
          ) : missingIngredients && missingIngredients.length > 0 ? (
            <div className="max-w-[320px] w-full flex flex-col gap-3 rounded-2xl bg-[#FFEDE9] p-5 mt-4">
              <div className="flex items-center gap-2">
                <Image
                  className="mt-0.5"
                  src="/assets/icons/shopping.svg"
                  alt="shopping"
                  width={12}
                  height={12}
                />
                <span className="text-xs font-bold font-jakarta text-brand-orange">
                  Cần bổ sung:
                </span>
              </div>
              <ul className="max-w-[280px] flex flex-wrap gap-2 m-0 p-0 list-none">
                {missingIngredients.map((item, index) => (
                  <li
                    key={index}
                    className="bg-[#FFD3C9] py-1 px-4 rounded-full font-medium font-jakarta text-xs text-brand-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="w-full text-sm text-brand-muted font-jakarta leading-relaxed mt-4">
              {description}
            </p>
          )}
        </div>

        {/* ĐÃ SỬA Ở ĐÂY 2: Thêm class "mt-auto" để ép khối Button này luôn bám chặt đáy thẻ bài */}
        <div className="w-full pt-6 mt-auto">
          {isMatch ? (
            <div className="w-full flex justify-center">
              <Button
                variant="gradient"
                className="w-[320px] h-[56px] px-0 py-0 text-base"
                onClick={onRecipeClick}
              >
                Bắt đầu nấu
              </Button>
            </div>
          ) : (
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-[#FFDAD2] font-bold text-[16px] text-jakarta text-brand-orange cursor-pointer active:scale-95 transition-transform"
            >
              Thêm nguyên liệu
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
