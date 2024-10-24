"use client";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, NavbarMenuItem, NavbarMenu, NavbarMenuToggle, Image, Tooltip, Button } from "@nextui-org/react"
import { DPLogo } from "./NavLogo";
import ThemeSwitch from "./ThemeSwitch";
import React, { useEffect, useState } from "react";
import { useMedia } from "react-use";
import { usePathname } from 'next/navigation';
// import FavoriteModal from "./FavoriteModal";
import ClientSideComponent from "./FavoriteModal";
import { SocialList } from "./Social";
import { OrderBtn } from "./AboutOrder";
// import { OrderBtn } from "./AboutOrder";

const PAGE_LINKS = [
    { label: "База служилых людей", href: "/" },
    { label: "О проекте", href: "/about" },
    { label: "Контакты", href: "/contacts" },
    { label: "Как искать", href: "/faq" },
    // { label: "Админ", href: "/admin" },
]

function DecktopMenu({ isActive }) {
    //@ts-nocheck
    return (
        <div className="flex flex-col gap-4 w-full">
            <NavbarContent className="flex gap-4 w-full" justify="center" style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <NavbarBrand className="hover:opacity-80">
                    <Tooltip content="Перейти на основной сайт проекта">
                        <Link href="https://dompredkov.ru/" target="_blank" >
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "10px", background: "#dfe1e1", width: "160px", height: "75px" }}><DPLogo /></div>
                        </Link>
                    </Tooltip>
                </NavbarBrand>

                <NavbarItem>
                    <SocialList viewType="flat" />
                </NavbarItem>



                <NavbarContent justify="end">
                    {/* <NavbarItem>
                        <OrderBtn viewType="bordered" />
                    </NavbarItem> */}

                    <NavbarItem  >
                        {/* <FavoriteModal /> */}
                        <ClientSideComponent />
                    </NavbarItem>

                    <ThemeSwitch />
                </NavbarContent>

            </NavbarContent>

            <NavbarContent className="flex gap-4 w-full" justify="center" style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
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
        </div>
    )
}

function MobileMenu({ isMenuOpen, menuItems, isActive }) {
    return (
        <>
            <NavbarContent justify="start" >
                <NavbarMenuToggle aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"} style={{padding: "20px", border: "1px solid #a7bce4", borderRadius: "10px"}} />
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

            <NavbarMenu className="w-full absolute z-50" style={{ width: "100%", top: "120px" }}>
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`} className="pt-2" style={{ width: "100%", paddingTop: `${index === 0 ? '60px' : '10px'}` }}>
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

                <NavbarMenuItem >
                    {/* <FavoriteModal /> */}
                    <ClientSideComponent />
                </NavbarMenuItem>
{/* 
                <NavbarMenuItem style={{ marginTop: "50px", paddingBottom: "30px" }}>
                    <OrderBtn viewType="bordered" />
                </NavbarMenuItem> */}

                <NavbarMenuItem style={{ marginTop: "auto", paddingBottom: "30px" }}>
                    <SocialList viewType="flat" />
                </NavbarMenuItem>
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
            style={{ width: "100%", maxWidth: "1260px", margin: "0 auto", display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}
            height={"fit-content"}
        >
            {isMobile && mounted ?
                (<MobileMenu menuItems={PAGE_LINKS} isMenuOpen={isMenuOpen} isActive={isActive} />) :
                (<DecktopMenu isActive={isActive} />)}
        </Navbar>
    );
}