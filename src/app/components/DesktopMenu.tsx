
import React from "react";
import { NavbarBrand, NavbarContent, NavbarItem, Link, Tooltip } from "@nextui-org/react"
// import ThemeSwitch from "./ThemeSwitch";
import ClientSideComponent from "./FavoriteModal";
import { SocialList } from "./Social";
import { OrderBtn } from "./AboutOrder";
import { PAGE_LINKS } from "./NavHeader";
import { LogoWithSizes } from "./MobileMenu";
import Boy1 from "../../../public/boy1.png"
import Image from "next/image";

function DecktopMenu({ isActive, isOrderBtnVisible = false }) {
    return (
        <div className="header header--middle">
            <NavbarContent>
                {/* лого */}
                <NavbarBrand className="hover:opacity-80" style={{ display: "flex", alignItems: "center", width: "80px" }}>
                    <Tooltip content="На главную">
                        <Link href="/" target="_self" >
                            <Image src={Boy1} alt="logo" width={45} height={70} />
                        </Link>
                    </Tooltip>
                </NavbarBrand>

                <NavbarContent className="social-list">
                    {/* соцсети */}
                    <NavbarItem>
                        <SocialList viewType="light" />
                    </NavbarItem>

                    <NavbarItem>
                        {/* тема */}
                        {/* <ThemeSwitch /> */}
                    </NavbarItem>

                    {isOrderBtnVisible && (<NavbarItem  >
                        <ClientSideComponent />
                    </NavbarItem>)}

                    <NavbarItem>
                        <OrderBtn />
                    </NavbarItem>
                </NavbarContent>
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
                                target={item.target ? item.target : "_self"}
                            >
                                {item.isBold ? <b>{item.label}</b> : item.label}
                            </Link>
                        </NavbarItem>
                    ))}
                </NavbarContent>

            </NavbarContent>
        </div>
    )
}

export default DecktopMenu