import React from "react";
import { Providers } from "./providers";
import RootLayout from "../../package/src/RootLayout";



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
