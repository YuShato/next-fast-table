import React from "react";
import "./tailwind.css";
import "./styles.css"
import NavHeader from "../../src/app/components/NavHeader";

export default function RootLayout({ children }) {
    return (
        <div className="w-full h-screen relative p-4">
            <NavHeader />

            {children}
        </div>
    );
}
