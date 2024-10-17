"use client";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, NavbarMenuItem, NavbarMenu, NavbarMenuToggle, Image, Tooltip } from "@nextui-org/react"
import { DPLogo } from "./NavLogo";
import ThemeSwitch from "./ThemeSwitch";
import React, { useEffect, useState } from "react";
import { useMedia } from "react-use";
import { usePathname } from 'next/navigation';
import { useTheme } from "next-themes";

const PAGE_LINKS = [
    { label: "База служилых людей", href: "/" },
    { label: "О проекте", href: "/about" },
    { label: "Контакты", href: "/contacts" },
    { label: "Советы по поиску", href: "/faq" },
    // { label: "Админ", href: "/admin" },
]

function DecktopMenu({ isActive }) {
    //@ts-nocheck
    return (
        <>
            <NavbarContent className=" flex gap-4" justify="center">
                <NavbarBrand className="hover:opacity-80">
                    <Tooltip content="Перейти на основной сайт проекта">
                        <Link href="https://dompredkov.ru/" target="_blank" >
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "10px", background: "#dfe1e1", width: "160px", height: "75px" }}><DPLogo /></div>
                        </Link>
                    </Tooltip>
                </NavbarBrand>

                {PAGE_LINKS.map((item, index) => (
                    <NavbarItem key={`${item.href}-${index}`} isActive={isActive(item.href)} >
                        <Link
                            color={isActive(item.href) ? "primary" : "foreground"}
                            href={item.href} className="hover:underline"
                            style={{ textTransform: 'uppercase', fontWeight: `${index === 0 ? 'bold' : 'normal'}` }}
                            size="lg"
                        >
                            {item.label}
                        </Link>
                    </NavbarItem>
                ))}

            </NavbarContent>

            <NavbarContent justify="end">
                <ThemeSwitch />
            </NavbarContent>


        </>
    )
}

function MobileMenu({ isMenuOpen, menuItems, isActive }) {
    return (
        <>
            <NavbarContent justify="start">
                <NavbarMenuToggle aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"} />
            </NavbarContent>

            <NavbarContent justify="center">
                <NavbarBrand >
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "10px", background: "#dfe1e1", width: "160px", height: "75px" }}>
                        <DPLogo />
                    </div>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent justify="end">
                <ThemeSwitch />
            </NavbarContent>

            <NavbarMenu>
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`} className="pt-2">
                        <Link
                            className="w-full"
                            color={isActive(item.href) ? "primary" : "foreground"}
                            href={item.href}
                            size="lg"
                            style={{ textTransform: 'uppercase', fontWeight: `${index === 0 ? 'bold' : 'normal'}` }}
                        >
                            {item.label}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </>
    )
}

export default function NavHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isMobile = useMedia("(max-width: 768px)", true);

    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    const pathname = usePathname();

    const isActive = (path) => path === pathname;

    return (
        <Navbar
            isBordered
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}
            className="w-full p-3"
            shouldHideOnScroll
        >
            {isMobile && mounted ?
                (<MobileMenu menuItems={PAGE_LINKS} isMenuOpen={isMenuOpen} isActive={isActive} />) :
                (<DecktopMenu isActive={isActive} />)}
        </Navbar>
    );
}