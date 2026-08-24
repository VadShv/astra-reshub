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
  title: "SourcerHub — Сорсинг системных инженеров",
  description:
    "44 поисковые системы для рекрутера: GitHub, LinkedIn, hh.ru, Хабр, VK, Telegram, Yandex, Bing и др. Единая выборка и экспорт в ХАНТ.",
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
    "Москва",
    "Россия",
    "рекрутинг",
    "сорсинг",
  ],
  icons: {
    icon: "/logo.svg",
  },
  manifest: "/manifest.webmanifest",
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
          defaultTheme="light"
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
