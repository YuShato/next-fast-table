import React from "react";
import "./tailwind.css";
import "./styles.css"
import dynamic from "next/dynamic";
import Footer from "./Footer";

const NavHeader = dynamic(() => import("../../src/app/components/NavHeader"), {
    ssr: false,
});

export default function RootLayout({ children }) {
    return (
        <div className="w-full h-screen relative">
            <NavHeader />
            <main style={{ minHeight: "100%" }}>

                {children}
            </main>

            <Footer />
        </div>
    );
}
