import React from "react";
import "./tailwind.css";
import "./styles.css"
import NavHeader from "../../src/app/components/NavHeader";
import Footer from "./Footer";

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
