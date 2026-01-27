import React from "react";
import { Providers } from "./providers";
import RootLayout from "../../package/src/RootLayout";

import { Metadata } from "next";
import ChunkErrorBoundary from "./components/ChunkErrorBoundary";

export const metadata: Metadata = {
  title: "Служилые люди 16-18 века",
  description: "База служилых людей 16-18 века. Служилые люди. РГАДА, ф.210. Разрядный приказ. Поместный приказ.",
  keywords: ["Служилые люди 16-18 века", "Служилые люди", "РГАДА", "ф.210", "Разрядный приказ", "Поместный приказ", "Дворянство", " ф. 1209", "Александр Шатохин"],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  }
};



export default function Layout({ children }) {
  return (
    <html lang="ru" suppressHydrationWarning className="scroll-smooth">

      <body className="relative">
        <ChunkErrorBoundary>
          <Providers>

            <RootLayout>{children}</RootLayout>
          </Providers>
        </ChunkErrorBoundary>
      </body>
    </html >
  );
}
