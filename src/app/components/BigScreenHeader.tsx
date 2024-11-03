import React from "react";
import { NavbarBrand, NavbarContent, NavbarItem, Link, Tooltip } from "@nextui-org/react"
import ThemeSwitch from "./ThemeSwitch";
import ClientSideComponent from "./FavoriteModal";
import { SocialList } from "./Social";
import { OrderBtn } from "./AboutOrder";
import Logo from "../../../public/logo.png"
import Image from "next/image";
import { PAGE_LINKS } from "./NavHeader";


const BigScreenHeader = ({ isActive }) => {
    return (
        <div className="header">
            {/* меню */}
            <NavbarContent>
                {/* <NavbarItem> */}
                <NavbarBrand className="hover:opacity-80" style={{ minWidth: "190px" }}>
                    <Tooltip content="Перейти на основной сайт проекта">
                        <Link href="https://dompredkov.ru/" target="_blank" >
                            <Image src={Logo} alt="logo" width={190} height={100} />
                        </Link>
                    </Tooltip>
                </NavbarBrand>

                {/* </NavbarItem> */}
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

                <NavbarItem  >
                    <OrderBtn />
                </NavbarItem>

                <NavbarItem  >
                    {/* избранное */}
                    <ClientSideComponent />
                </NavbarItem>

                <NavbarContent>
                    {/* соцсети */}
                    <SocialList viewType="light" />

                    {/* тема */}
                </NavbarContent>
                <ThemeSwitch />
            </NavbarContent>
        </div>
    )
}

export default BigScreenHeader
