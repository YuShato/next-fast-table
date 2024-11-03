import React from "react";
import Image from "next/image";
import { NavbarBrand, NavbarContent, Link, NavbarMenuItem, NavbarMenu, NavbarMenuToggle, Tooltip } from "@nextui-org/react"
import ThemeSwitch from "./ThemeSwitch";
import ClientSideComponent from "./FavoriteModal";
import { SocialList } from "./Social";
import Logo from "../../../public/logo.png"

export const LogoWithSizes = ({ width = 100, height = 100 }) => {
    const style = {
        width: width === 100 && height === 100 ? undefined : width,
        height: width === 100 && height === 100 ? undefined : height,
        ...(width !== 100 || height !== 100 ? { width: width, height: "auto" } : {}),
      };

   return (
    <Link href="https://dompredkov.ru/" target="_blank" >
      <Tooltip content="Перейти на основной сайт проекта">
        <Image src={Logo} alt="logo" style={style} />
      </Tooltip>
    </Link>
  );
}


function MobileMenu({ isMenuOpen, menuItems, isActive }) {
    return (
        <>
            <NavbarContent justify="start" >
                <NavbarMenuToggle aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"} style={{ padding: "17px", border: "1px solid #FFD6A8", borderRadius: "3px", color: "#FFD6A8" }} />
            </NavbarContent>

            <NavbarContent justify="center">
                <NavbarBrand >
                    <LogoWithSizes width={110} height={100} />
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent justify="end">
                <ThemeSwitch />
            </NavbarContent>

            <NavbarMenu className="w-full absolute z-50" style={{ width: "100%", top: "70px" }}>
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`} className="pt-2" style={{ width: "100%", paddingTop: `${index === 0 ? '60px' : '10px'}`, paddingBottom: `${index === menuItems.length - 1 ? '60px' : '10px'}` }}>
                        <Link
                            className={`w-full ${isActive(item.href) ? "accent__text" : "text-foreground"}`}
                            color={isActive(item.href) ? "primary" : "foreground"}
                            href={item.href}
                            size="lg"
                            style={{ textTransform: 'uppercase', fontWeight: `${index === 0 || isActive(item.href) ? 'bold' : 'normal'}` }}
                        >
                            {item.label}
                        </Link>
                    </NavbarMenuItem>
                ))}

                <NavbarMenuItem >
                    <ClientSideComponent />
                </NavbarMenuItem>

                <NavbarMenuItem style={{ marginTop: "auto", paddingBottom: "30px" }}>
                    <SocialList viewType="light" mode="dark" />
                </NavbarMenuItem>
            </NavbarMenu>
        </>
    )
}

export default MobileMenu