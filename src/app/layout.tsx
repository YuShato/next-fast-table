import React from "react";
import { Providers } from "./providers";
import NavHeader from "./components/NavHeader";



export default function Layout({ children }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="position-relative">
        <Providers>
          <NavHeader />

          {children}
        </Providers>
      </body>
    </html>
  );
}
