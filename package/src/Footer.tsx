"use client"
import React from 'react'
import { SocialList } from '../../src/app/components/Social'
import { Tooltip, Link, Snippet } from '@nextui-org/react'
import { LogoWithSizes } from '../../src/app/components/MobileMenu';
import { useMedia } from 'react-use';

const Footer = () => {
    const isMobile = useMedia("(max-width: 768px)", false);

    return (
        <div className='footer'>
            <div>
                <Tooltip content="Перейти на основной сайт проекта">
                    <LogoWithSizes width={130} height={100} />
                </Tooltip>
            </div>

            <div className='footer-info'>
                <p>Проект "Дом предков"</p>
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

        </div>
    )
}

export default Footer