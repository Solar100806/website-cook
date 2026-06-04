"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-brand-bg px-4">
      <div className="w-24 h-24 rounded-full bg-[#FFEDE9] flex items-center justify-center mb-8">
        <span className="text-5xl select-none">⚠️</span>
      </div>

      <h1 className="text-[40px] font-bold font-epilogue text-[#9B3F00] text-center leading-tight mb-4">
        Có gì đó không ổn rồi!
      </h1>

      <p className="max-w-md text-center text-lg text-brand-muted font-jakarta mb-2">
        Ứng dụng gặp phải một lỗi không mong muốn. Bạn có thể thử lại hoặc
        quay về trang chủ để tiếp tục.
      </p>

      {error.digest && (
        <p className="text-xs text-brand-muted font-jakarta mb-8 opacity-60">
          Mã lỗi: <span className="font-mono">{error.digest}</span>
        </p>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
        <button
          type="button"
          onClick={reset}
          className="flex items-center gap-3 px-10 py-4 rounded-full text-lg font-jakarta font-bold text-white cursor-pointer active:scale-95 transition-transform"
          style={{
            backgroundImage: "linear-gradient(135deg, #FF7A2C, #9B3F00)",
          }}
        >
          Thử lại
        </button>

        <Link
          href="/"
          className="flex items-center gap-3 px-10 py-4 rounded-full text-lg font-jakarta font-bold text-[#9B3F00] bg-[#FFDAD2] active:scale-95 transition-transform"
        >
          Về trang chủ
        </Link>
      </div>
    </main>
  );
}
