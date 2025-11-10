import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GlobalDataProvider } from "@/contexts/GlobalDataContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agenda - Sistema de Gerenciamento",
  description: "Sistema completo para gerenciamento",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  themeColor: "#8B5CF6",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Agenda",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#8B5CF6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Agenda Salão" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <GlobalDataProvider>
          {children}
        </GlobalDataProvider>
      </body>
    </html>
  );
}