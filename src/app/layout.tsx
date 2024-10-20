import React from "react";
import { Providers } from "./providers";
import RootLayout from "../../package/src/RootLayout";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Служилые люди 16-18 века",
  description: "База служилых людей 16-18 века. Служилые люди. РГАДА, ф.210. Разрядный приказ. Поместный приказ.",
  keywords: ["Служилые люди 16-18 века", "Служилые люди", "РГАДА", "ф.210", "Разрядный приказ", "Поместный приказ", "Дворянство", " ф. 1209", "Александр Шатохин"],
};



export default function Layout({ children }) {
  return (
    <html lang="ru" suppressHydrationWarning className="scroll-smooth">
      
      <body className="relative">
        <Providers>
          <RootLayout>{children}</RootLayout>
        </Providers>
      </body>
    </html>
  );
}
