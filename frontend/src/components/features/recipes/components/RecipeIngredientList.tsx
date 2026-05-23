import Image from "next/image";

export type IngredientListItem = {
  id: number;
  name: string;
  desc: string;
};

type IngredientListProps = {
  items: IngredientListItem[];
};

export default function IngredientList({ items }: IngredientListProps) {
  return (
    <aside className="col-span-4">
      <div className="min-w-[243px] ml-24">
        <div className="flex items-center gap-2">
          <Image
            src="/assets/icons/icon.svg"
            alt="icon"
            width={22}
            height={19}
          />
          <span className="text-[22px] font-semibold font-epilogue text-brand-orange">
            Nguyên liệu
          </span>
        </div>
        <ul className="flex flex-col gap-4">
          {items.map((item, index) => (
            <li
              className="max-w-[243px] rounded-[12px] py-2.5 pl-4 bg-[#F3F4F5] flex items-center gap-2"
              key={`${item.id}-${index}`}
            >
              <div>
                <span className="text-brand-orange font-jakarta text-base">
                  {item.name}
                </span>
                <p className="text-brand-muted font-jakarta italic text-xs">
                  {item.desc}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
