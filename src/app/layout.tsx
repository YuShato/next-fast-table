import React from "react";
import Link from "next/link";


export default function Layout({ children }) {
  return (
    <html className="light">
      <body>
        <header className="p-4 flex gap-4 w-full">

          <Link href="/" className="hover:underline">База служилых людей</Link>

          <Link href="/documents" className="hover:underline">Документы</Link>

          <Link href="/admin" className="hover:underline">Админ</Link>
        </header>

        {children}</body>
    </html>
  );
}
