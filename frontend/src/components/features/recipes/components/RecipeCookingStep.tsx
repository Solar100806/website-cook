import Image from "next/image";
import StepCard from "./RecipeStepCard";

export type RecipeStepDisplay = {
  id: number;
  step: string;
  image: string;
  title: string;
  desc: string;
};

type RecipeStepProps = {
  steps: RecipeStepDisplay[];
};

export default function RecipeStep({ steps }: RecipeStepProps) {
  const label =
    steps.length === 0
      ? "0 GIAI ĐOẠN CHI TIẾT"
      : `${steps.length} GIAI ĐOẠN CHI TIẾT`;

  return (
    <section className="col-span-8">
      <div className="max-w-[809px] w-full mr-auto">
        <div className="w-full h-[51px] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image
              className="mt-1"
              src="/assets/icons/book.svg"
              alt="icon"
              width={22}
              height={16}
            />
            <span className="text-[22px] font-semibold font-jakarta text-brand-orange">
              Các bước thực hiện
            </span>
          </div>
          <span className="text-base font-jakarta text-brand-muted">
            {label}
          </span>
        </div>
        <hr className="mt-2.5" />
        <div className="w-full flex flex-col gap-6 mt-6">
          {steps.map((item) => (
            <StepCard
              key={item.id}
              step={item.step}
              image={item.image}
              title={item.title}
              desc={item.desc}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
