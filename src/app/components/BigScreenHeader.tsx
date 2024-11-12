import React from "react";
import { NavbarBrand, NavbarContent, NavbarItem, Link, Tooltip } from "@nextui-org/react"
import ThemeSwitch from "./ThemeSwitch";
import ClientSideComponent from "./FavoriteModal";
import { SocialList } from "./Social";
import { OrderBtn } from "./AboutOrder";
import Boy1 from "../../../public/boy1.png"
import Image from "next/image";
import { PAGE_LINKS } from "./NavHeader";


const BigScreenHeader = ({ isActive, isOrderBtnVisible = false }) => {
    return (
        <div className="header">
            {/* меню */}
            <NavbarContent>
                {/* <NavbarItem> */}
                <NavbarBrand className="hover:opacity-80" style={{ minWidth: "60px" }}>
                    <Tooltip content="На главную">
                        <Link href="/" target="_self" >
                            <Image src={Boy1} alt="logo" width={70} height={70} />
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
                            className={`$ ${isActive(item.href) ? "nav-menu nav-menu--active" : "nav-menu"}`}
                            target={item.target ? item.target : "_self"}
                        >
                            {item.isBold ? <b>{item.label}</b> : item.label}
                        </Link>
                    </NavbarItem>
                ))}

                <NavbarItem  >
                    <OrderBtn />
                </NavbarItem>

                {isOrderBtnVisible && <NavbarItem  >
                    {/* избранное */}
                    <ClientSideComponent />
                </NavbarItem>}

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
