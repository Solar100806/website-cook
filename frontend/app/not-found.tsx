import Link from "next/link";

export const metadata = {
  title: "404 – Không tìm thấy trang | Food App",
  description: "Trang bạn tìm kiếm không tồn tại.",
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-brand-bg px-4">
      <div className="relative select-none mb-6">
        <span
          className="text-[180px] font-extrabold font-epilogue leading-none"
          style={{
            backgroundImage: "linear-gradient(135deg, #FF7A2C, #9B3F00)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </span>

        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-5xl">
          🍽️
        </span>
      </div>

      <h1 className="text-[36px] font-bold font-epilogue text-[#9B3F00] text-center leading-tight mb-4">
        Trang không tồn tại
      </h1>

      <p className="max-w-md text-center text-lg text-brand-muted font-jakarta mb-10">
        Có vẻ như trang bạn đang tìm đã bị xóa, đổi tên, hoặc chưa bao giờ
        tồn tại. Hãy quay về trang chủ để tiếp tục khám phá công thức nấu ăn!
      </p>

      <Link
        href="/"
        className="flex items-center gap-3 px-12 py-5 rounded-full text-xl font-jakarta font-bold text-white active:scale-95 transition-transform"
        style={{
          backgroundImage: "linear-gradient(135deg, #FF7A2C, #9B3F00)",
        }}
      >
        🏠 Về trang chủ
      </Link>

      <Link
        href="/recipes"
        className="mt-4 text-sm font-jakarta text-brand-muted underline underline-offset-4 hover:text-brand-orange transition-colors"
      >
        Hoặc xem gợi ý công thức
      </Link>
    </main>
  );
}
