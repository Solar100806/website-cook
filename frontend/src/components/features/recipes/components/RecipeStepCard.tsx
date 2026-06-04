import Image from "next/image";
import React, { useState } from "react";

export default function StepCard({
  step,
  image,
  title,
  desc,
}: {
  step: string;
  image: string;
  title: string;
  desc: string;
}) {
  const [currentImage, setCurrentImage] = useState(image);

  React.useEffect(() => {
    setCurrentImage(image);
  }, [image]);

  return (
    <article className="w-full max-w-[809px] flex justify-between rounded-2xl border border-[#E7E8E9] p-6">
      <div className="flex flex-col flex-1 max-w-[511px] w-full">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="font-epilogue text-4xl font-semibold leading-none text-[#9B3F00]/10">
            {step}
          </span>
          <span className="text-base font-epilogue font-semibold text-[#9B3F00]">
            {title}
          </span>
        </div>
        <p className=" text-base max-w-[511px] w-full text-[#72544E] font-epilogue leading-[26px] whitespace-pre-line">
          {desc}
        </p>
      </div>
      <div className="relative h-[160px] w-[224px] shrink-0 overflow-hidden rounded-[16px]">
        <Image
          className="object-cover"
          src={currentImage}
          alt={title}
          fill
          unoptimized={currentImage.startsWith("http")}
          onError={() => setCurrentImage("/assets/icons/chef.svg")}
        />
      </div>
    </article>
  );
}
