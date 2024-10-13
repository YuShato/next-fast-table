import React from "react";
import Link from "next/link";
import { Providers } from "./providers";
import ThemeSwitch from "./components/ThemeSwitch";


export default function Layout({ children }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body>
        <Providers>
          <header className="p-4 flex gap-4 w-full">

            {/* <Link href="/" className="hover:underline">База служилых людей</Link>

          <Link href="/documents" className="hover:underline">Документы</Link>

          <Link href="/admin" className="hover:underline">Админ</Link> */}
            <ThemeSwitch />
          </header>

          {children}
        </Providers>
      </body>
    </html>
  );
}
