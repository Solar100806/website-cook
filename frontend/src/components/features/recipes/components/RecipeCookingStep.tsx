import Image from "next/image";
import StepCard from "./RecipeStepCard";

const FALLBACK_STEP_IMAGE = "/assets/icons/chef.svg";

function resolveStepImage(raw: string): string {
  const val = (raw || "").trim();
  if (!val) return FALLBACK_STEP_IMAGE;

  if (
    val.startsWith("http://") ||
    val.startsWith("https://") ||
    val.startsWith("/")
  ) {
    return val;
  }

  return FALLBACK_STEP_IMAGE;
}

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
            <span className="text-[22px] font-semibold font-jakarta text-[#9B3F00]">
              Các bước thực hiện
            </span>
          </div>
          <span className="text-base font-jakarta text-[#72544E]">{label}</span>
        </div>
        <hr className="mt-2.5" />
        <div className="w-full flex flex-col gap-6 mt-6">
          {steps.map((item) => (
            <StepCard
              key={item.id}
              step={item.step}
              image={resolveStepImage(item.image)}
              title={item.title}
              desc={item.desc}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
