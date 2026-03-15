import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "大学城美食探探",
  description: "专为大学生设计的美食探索与社交App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex justify-center items-center min-h-screen bg-[#0F0F11]`}>
        <main className="w-full max-w-[400px] h-[850px] max-h-[100dvh] bg-[#F4F5F7] relative overflow-hidden shadow-2xl rounded-none sm:rounded-[3rem] border-8 border-[#1A1A1A]">
          {children}
        </main>
      </body>
    </html>
  );
}
