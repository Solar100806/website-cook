import type { IngredientSearchProps } from '@/types/ingredient';
import Button from "@/components/ui/Button";
import { normalizeVietnamese } from "@/utils/vietnamese";

export default function IngredientSearch({
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
}: IngredientSearchProps) {
  return (
    <section className="w-full py-12 px-4 flex flex-col items-center justify-center">
      <search className="w-full max-w-162 min-h-75.5 flex flex-col items-center justify-center relative">
        <form
          className="w-full h-24 flex justify-center"
          onSubmit={(e) => {
            e.preventDefault();
            onSearchSubmit();
          }}
        >
          <input
            value={input}
            onChange={(e) => {
              onInputChange(e.target.value);
              onOpenChange(true);
            }}
            onFocus={() => onOpenChange(true)}
            onBlur={() => {
              setTimeout(() => onOpenChange(false), 150);
            }}
            className="w-full h-full outline-none bg-white rounded-full shadow-[0px_12px_40px_0px_rgba(65,41,35,0.04)] 
                    placeholder:text-[#CAA59C] text-2xl font-jakarta pl-20 "
            placeholder="Thêm nguyên liệu (ví dụ: Cá hồi, Bơ...)"
            aria-autocomplete="list"
            aria-expanded={open}
          />
        </form>

        {open && debouncedInput.length >= 1 ? (
          <div className="absolute top-24 left-0 right-0 z-20 mt-2 max-h-64 overflow-auto rounded-2xl border border-[#E7E8E9] bg-white shadow-lg">
            {isSuggestionsFetching ? (
              <p className="px-4 py-3 text-sm text-brand-muted font-jakarta">
                Đang tìm nguyên liệu...
              </p>
            ) : suggestions.length === 0 ? (
              <p className="px-4 py-3 text-sm text-brand-muted font-jakarta">
                Không có nguyên liệu phù hiệu
              </p>
            ) : (
              <ul className="m-0 list-none p-0">
                {suggestions.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      className="w-full px-4 py-3 text-left text-base font-jakarta text-brand-brown hover:bg-[#FFEDE9]"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        onAdd(s.name);
                        onInputChange("");
                        onOpenChange(false);
                      }}
                    >
                      {s.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}

        <ul className="w-full flex flex-wrap justify-center items-center list-none gap-4 py-6">
          {selected.map((name) => (
            <li
              key={normalizeVietnamese(name)}
              className="px-6 py-2 text-center bg-[#FFDAD2]/40 border border-[#FF7A2C]/10 rounded-full flex items-center gap-2"
            >
              <span>{name}</span>
              <button
                type="button"
                className="text-brand-orange text-sm font-bold leading-none"
                aria-label={`Xóa ${name}`}
                onClick={() => onRemove(name)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>

        <div className="w-full min-h-24 flex items-center justify-center">
          <Button
            type="button"
            variant="gradient"
            iconSrc="/assets/icons/search.svg"
            iconAlt="Search"
            disabled={selected.length === 0}
            onClick={goRecipes}
          >
            Tìm kiếm công thức
          </Button>
        </div>
      </search>
    </section>
  );
}
