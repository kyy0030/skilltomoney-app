import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "스킬투머니 | 배운 기술이 돈이 되는 원데이 클래스",
  description: "스킬투머니 - 배운 기술이 돈이 되는 실전 원데이 클래스. 배움에서 멈추지 않고 하루 만에 나만의 수익 파이프라인을 완성하세요.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col bg-[#070d1e] text-white antialiased">
        {/* 강좌 데이터를 hydration 전에 window.COURSES로 로드 */}
        <Script src="/data/courses.js" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  );
}
