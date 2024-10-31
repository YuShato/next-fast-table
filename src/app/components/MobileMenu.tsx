import { NavbarBrand, NavbarContent, NavbarItem, Link, NavbarMenuItem, NavbarMenu, NavbarMenuToggle, Tooltip, Button } from "@nextui-org/react"
import ThemeSwitch from "./ThemeSwitch";
import React from "react";
// import FavoriteModal from "./FavoriteModal";
import ClientSideComponent from "./FavoriteModal";
import { SocialList } from "./Social";
import Logo from "../../../public/logo.png"
import Image from "next/image";


function MobileMenu({ isMenuOpen, menuItems, isActive }) {
    return (
        <>
            <NavbarContent justify="start" >
                <NavbarMenuToggle aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"} style={{ padding: "20px", border: "1px solid #a7bce4", borderRadius: "10px" }} />
            </NavbarContent>

            <NavbarContent justify="center">
                <NavbarBrand >
                    {/* <div style={{ display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "10px", background: "#dfe1e1", width: "160px", height: "75px" }}>
                        <DPLogo />
                    </div> */}
                    <Image src={Logo} alt="logo" width={100} height={100} />
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

export default MobileMenu