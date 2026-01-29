"use client"
import React, { useState, useEffect } from 'react'
import { SocialList } from '../../src/app/components/Social'
import { Tooltip, Link, Snippet } from '@nextui-org/react'
import { LogoWithSizes } from '../../src/app/components/MobileMenu';


const Footer = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 768px)");
        setIsMobile(mediaQuery.matches);
        const handler = (e) => setIsMobile(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    return (
        <footer className='footer'>
            <div>
                <Tooltip content="Перейти на основной сайт проекта">
                    <LogoWithSizes width={130} height={100} />
                </Tooltip>
            </div>

            <div className='footer-info'>
                <Link href="https://dompredkov.ru" target="_blank" >    Проект {" "}"Дом предков"</Link>
                <Tooltip content="Написать на почту">
                    <Link href="mailto:dompredkov@yandex.ru" target="_blank" >dompredkov@yandex.ru</Link>
                </Tooltip>

            </div>

            <div className='footer-info'>
                <h5>Телефон:</h5>
                <Snippet symbol=""
                    size={isMobile ? "sm" : "md"}
                    style={{ color: "#FFD6A8" }}
                    variant='flat'
                    tooltipProps={{ content: "Копировать номер" }}
                    radius='none'
                >
                    8-926-495-31-17
                </Snippet>
            </div>


            <SocialList viewType="light" />

        </footer>
    )
}

export default Footer