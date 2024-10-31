
import React from "react";
import { NavbarBrand, NavbarContent, NavbarItem, Link, NavbarMenuItem, NavbarMenu, NavbarMenuToggle, Tooltip, Button } from "@nextui-org/react"
import ThemeSwitch from "./ThemeSwitch";
import ClientSideComponent from "./FavoriteModal";
import { SocialList } from "./Social";
import { OrderBtn } from "./AboutOrder";
import Logo from "../../../public/logo.png"
import Image from "next/image";
import { PAGE_LINKS } from "./NavHeader";

function DecktopMenu({ isActive }) {
    return (
        <div className="header">
            <NavbarContent>
                {/* лого */}
                <NavbarBrand className="hover:opacity-80">
                    <Tooltip content="Перейти на основной сайт проекта">
                        <Link href="https://dompredkov.ru/" target="_blank" >
                            <Image src={Logo} alt="logo" width={190} height={100} />
                        </Link>
                    </Tooltip>
                </NavbarBrand>

                <NavbarContent className="social-list">
                    {/* соцсети */}
                    <SocialList viewType="light" />

                    <NavbarItem>
                        {/* тема */}
                        <ThemeSwitch />
                    </NavbarItem>
                </NavbarContent>
                <OrderBtn />
            </NavbarContent>

            <NavbarContent>
                {/* меню */}
                <NavbarContent>
                    {PAGE_LINKS.map((item, index) => (
                        <NavbarItem
                            key={`${item.href}-${index}`}
                            isActive={isActive(item.href)}
                            className="nav-menu" >
                            <Link
                                href={item.href}
                                className={`${isActive(item.href) ? "nav-menu nav-menu--active" : "nav-menu"}`}
                            >
                                {item.label}
                            </Link>
                        </NavbarItem>
                    ))}
                </NavbarContent>

                <NavbarItem  >
                    {/* избранное */}
                    <ClientSideComponent />
                </NavbarItem>
            </NavbarContent>
        </div>
    )
}

export default DecktopMenu