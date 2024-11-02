import React from 'react'
import { Button, Card, CardBody, CardHeader, Link, Tooltip } from '@nextui-org/react'
import { Icon } from '@iconify/react'

export function SocialList({ viewType = "light", mode = "default" }: { viewType?: "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | "ghost" | undefined, mode?: "default" | "dark" }) {
    return (
        <div className='flex gap-3 social-list'>
            <Tooltip content="Написать в WhatsApp">
                <Button
                    href="https://wa.me/79264953117?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%20%D0%B7%D0%B0%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D0%B5%D1%81%D0%BE%D0%B2%D0%B0%D0%BB%D0%B8%20%D0%B2%D0%B0%D1%88%D0%B8%20%D1%83%D1%81%D0%BB%D1%83%D0%B3%D0%B8"
                    as={Link}
                    target="_blank"
                    isIconOnly
                    variant={viewType}
                    size="sm"
                    className={`${viewType === "light" ? "nav-header-social-btn" : "hover:opacity-80 hover:scale-110"} ${mode === "dark" ? "dark-social-btn" : ""}`}

                >
                    {viewType === "light" ?
                        <Icon icon="ic:baseline-whatsapp" className={mode === "dark" ? "dark-social-icon " : ""}

                        /> :
                        <Icon icon="logos:whatsapp-icon" height={34} width={34} />}
                </Button>
            </Tooltip>

            <Tooltip content="Написать в VK">
                <Button
                    href="https://vk.com/id2433917"
                    as={Link}
                    target="_blank"
                    isIconOnly
                    variant={viewType}
                    size="sm"
                    className={`${viewType === "light" ? "nav-header-social-btn" : "hover:opacity-80 hover:scale-110"} ${mode === "dark" ? "dark-social-btn" : ""}`}

                >
                    <Icon icon="hugeicons:vk" className={mode === "dark" ? "dark-social-icon " : ""} />
                </Button>
            </Tooltip>

            <Tooltip content="Написать в Телеграм">
                <Button
                    href="https://t.me/Aleksander_Shatokhin"
                    as={Link}
                    target="_blank"
                    isIconOnly
                    variant={viewType}
                    size="sm"
                    className={`${viewType === "light" ? "nav-header-social-btn" : "hover:opacity-80 hover:scale-110"} ${mode === "dark" ? "dark-social-btn" : ""}`}
                >
                    {viewType === "light" ?
                        <Icon icon="ph:telegram-logo" className={mode === "dark" ? "dark-social-icon " : ""} /> :
                        <Icon icon="logos:telegram" height={34} width={34} />}
                </Button>
            </Tooltip>
        </div>
    )
}


export default function Social() {
    return (
        <Card radius="none">
            <CardHeader className='text-xl'>
                <h3 style={{ fontWeight: 'bold' }}>Соцсети:</h3>
            </CardHeader>
            <CardBody className='flex row-auto gap-3'>
                <SocialList mode="dark" />
            </CardBody>
        </Card>
    )
}