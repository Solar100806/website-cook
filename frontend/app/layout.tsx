
import { Providers } from "@/providers/providers";
import "@/styles/globals.css";

export const metadata = {
  title: "Food App",
  description: "Food Recipe App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
