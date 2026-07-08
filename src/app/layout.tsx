import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GitFind — Поиск системных разработчиков по GitHub",
  description:
    "Поиск системных разработчиков (C, C++, Go, Python, Rust) в Москве и России: СУБД, Linux, СХД, СРК, ядро и сетевое ПО. Экспорт выборки в формат ХАНТ.",
  keywords: [
    "GitHub",
    "системные разработчики",
    "C",
    "C++",
    "Go",
    "Python",
    "Rust",
    "СУБД",
    "Linux",
    "СХД",
    "СРК",
    "Москва",
    "Россия",
    "рекрутинг",
  ],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <SonnerToaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
