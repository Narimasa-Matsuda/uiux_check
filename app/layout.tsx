import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UI/UX 無料AI診断 | サイト改善のヒントが3分でわかる",
  description:
    "URLを入力するだけでAIがサイトのUI/UXを診断。スコアと具体的な改善提案を即座にお届けします。完全無料・登録不要。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
