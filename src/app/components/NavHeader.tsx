"use client";
import { Navbar } from "@nextui-org/react"
import React, { useCallback,  useMemo, useState } from "react";
import { useMedia } from "react-use";
import { usePathname } from 'next/navigation';
import MobileMenu from "./MobileMenu";
import BigScreenHeader from "./BigScreenHeader";
import DecktopMenu from "./DesktopMenu";

export const PAGE_LINKS = [
    { label: "База служилых людей", href: "/", isBold: true },
    { label: "О проекте", href: "/about" },
    { label: "Контакты", href: "/contacts" },
    { label: "Как искать", href: "/faq" },
    { label: `Сайт "Дом Предков"`, href: "https://dompredkov.ru", target: "_blank" },
    // { label: "Админ", href: "/admin" },
]

const AdaptiveHeader = ({ isMenuOpen, setIsMenuOpen, isActive,
    isMobile = false
}) => {

    const [isOrderBtnVisible, setIsOrderBtnVisible] = useState(true);

    if (isMobile) {
        return (<Navbar
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}
            className="nav-header"
            shouldHideOnScroll
            height={"fit-content"}
        >
            <MobileMenu menuItems={PAGE_LINKS} isMenuOpen={isMenuOpen} isActive={isActive} />

        </Navbar>)
    }

    return (
        <>
            {/* desktop */}
            <Navbar
                isMenuOpen={isMenuOpen}
                onMenuOpenChange={setIsMenuOpen}
                className="nav-header nav-header--desktop"
                shouldHideOnScroll={false}
                height={"fit-content"}
            >
                <BigScreenHeader isActive={isActive} />
            </Navbar>

            {/* medium */}
            <Navbar
                isMenuOpen={isMenuOpen}
                onMenuOpenChange={setIsMenuOpen}
                className="nav-header nav-header--medium"
                shouldHideOnScroll
                height={"fit-content"}
                onScroll={() => setIsOrderBtnVisible(false)}
            >
                <DecktopMenu isActive={isActive} isOrderBtnVisible={isOrderBtnVisible} />
            </Navbar>
        </>
    );

}

export default function NavHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isMobile = useMedia("(max-width: 768px)", false);



    const pathname = usePathname();
    const isActive = useCallback((path) => path === pathname, [pathname]);

    const memoizedAdaptiveHeader = useMemo(
        () => (
            <AdaptiveHeader
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                isActive={isActive}
                isMobile={isMobile}

            />
        ),
        [isMenuOpen,
            isMobile, isActive]
    );

    return memoizedAdaptiveHeader;
}