

import { Link, Navbar, NavbarContent, NavbarItem } from '@nextui-org/react'
import React from 'react'

const AboutNav = () => {

    return (
        <Navbar
            isBordered
            shouldHideOnScroll
            className='z-10 pb-4 about-nav'
            isBlurred
        >
            <NavbarContent className='flex justify-center flex-wrap'>
                <NavbarItem >
                    <Link href="#about" className='hover:underline uppercase'>
                        О проекте
                    </Link>
                </NavbarItem>

                <NavbarItem >
                    <Link className='hover:underline uppercase' href="#history">
                        История проекта
                    </Link>
                </NavbarItem>

                <NavbarItem>
                    <Link href="#data" className='hover:underline uppercase'>
                        Какие данные можно узнать?
                    </Link>
                </NavbarItem>

                <NavbarItem>
                    <Link href="#example" className='hover:underline uppercase'>
                        Пример записи
                    </Link>
                </NavbarItem>

                <NavbarItem>
                    <Link href="#order" className='hover:underline uppercase'>
                        Как заказать
                    </Link>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    )
}

export default AboutNav