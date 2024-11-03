
import React from "react";
import { NavbarBrand, NavbarContent, NavbarItem, Link, Tooltip } from "@nextui-org/react"
import ThemeSwitch from "./ThemeSwitch";
import ClientSideComponent from "./FavoriteModal";
import { SocialList } from "./Social";
import { OrderBtn } from "./AboutOrder";
import { PAGE_LINKS } from "./NavHeader";
import { LogoWithSizes } from "./MobileMenu";

function DecktopMenu({ isActive }) {
    return (
        <div className="header">
            <NavbarContent>
                {/* лого */}
                <NavbarBrand className="hover:opacity-80">
                    {/* <Tooltip content="Перейти на основной сайт проекта"> */}
                        <LogoWithSizes width={190} height={100} />
                    {/* </Tooltip> */}
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