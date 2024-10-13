"use client";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, NavbarMenuItem, NavbarMenu, NavbarMenuToggle, Button } from "@nextui-org/react"
import { DPLogo } from "./NavLogo";
import ThemeSwitch from "./ThemeSwitch";
import React from "react";
import { useMedia } from "react-use";
import { usePathname } from 'next/navigation';

const PAGE_LINKS = [
    { label: "База служилых людей", href: "/" },
    { label: "О проекте", href: "/about" },
    { label: "Контакты", href: "/contacts" },
    { label: "Советы по поиску", href: "/faq" },
    { label: "Админ", href: "/admin" },
]

function DecktopMenu({ isActive }) {
    return (
        <>
            <NavbarContent className=" flex gap-4" justify="center">
                <NavbarBrand className="hover:opacity-80">
                    <Link href="https://dompredkov.ru/" target="_blank" title="Перейти на основной сайт проекта" >
                        <DPLogo />
                    </Link>
                </NavbarBrand>

                {PAGE_LINKS.map((item, index) => (
                    <NavbarItem key={`${item}-${index}`} isActive={isActive(item.href)}>
                        <Link color={isActive(item.href) ? "primary" : "foreground"} href={item.href} className="hover:underline">{item.label}</Link>
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
                    <DPLogo />
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
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const isMobile = useMedia("(max-width: 768px)", true);

    const pathname = usePathname();
    const isActive = (path) => path === pathname;

    return (
        <Navbar
            isBordered
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}
            className="w-full p-2"
            shouldHideOnScroll
        >
            {isMobile ? (<MobileMenu menuItems={PAGE_LINKS} isMenuOpen={isMenuOpen} isActive={isActive} />) : (<DecktopMenu isActive={isActive} />)}
        </Navbar>
    );
}