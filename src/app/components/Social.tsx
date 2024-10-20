import React from 'react'
import { Button, Card, CardBody, CardHeader, Link, Tooltip } from '@nextui-org/react'
import { Icon } from '@iconify/react'

export function SocialList({viewType = "default" }) {
    return (
        <div className='flex gap-4'>
            <Tooltip content="Написать в WhatsApp">
                <Button
                    href="https://wa.me/79264953117?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%20%D0%B7%D0%B0%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D0%B5%D1%81%D0%BE%D0%B2%D0%B0%D0%BB%D0%B8%20%D0%B2%D0%B0%D1%88%D0%B8%20%D1%83%D1%81%D0%BB%D1%83%D0%B3%D0%B8"
                    as={Link}
                    target="_blank"
                    // color="primary"
                    isIconOnly
                    variant={viewType === "default" ? "solid" : "flat"}
                    size="lg"
                    className='hover:opacity-80 hover:scale-110'

                >
                    <Icon icon="logos:whatsapp-icon" height={34} width={34} />
                </Button>
            </Tooltip>

            <Tooltip content="Написать в VK">
                <Button
                    href="https://vk.com/id2433917"
                    as={Link}
                    target="_blank"
                    // color="primary"
                    isIconOnly
                    variant={viewType === "default" ? "solid" : "flat"}
                    size="lg"
                    className='hover:opacity-80'

                >
                    <Icon className='hover:opacity-80' color='#0077FF' fill='#0077FF' icon="ion:logo-vk" height={34} width={34} />
                </Button>
            </Tooltip>

            <Tooltip content="Написать в Телеграм">
                <Button
                    href="https://t.me/Aleksander_Shatokhin"
                    // @Aleksander_Shatokhin
                    as={Link}
                    target="_blank"
                    // color="primary"
                    isIconOnly
                    variant={viewType === "default" ? "solid" : "flat"}
                    size="lg"
                    className='hover:opacity-80'

                >
                    <Icon icon="logos:telegram" height={34} width={34} />
                </Button>
            </Tooltip>
        </div>
    )
}


export default function Social() {
    return (
        <Card shadow='md'>
            <CardHeader className='text-xl'>
                <h3 style={{ fontWeight: 'bold' }}>Соцсети:</h3>
            </CardHeader>
            <CardBody className='flex row-auto gap-3'>
                <SocialList />
            </CardBody>
        </Card>
    )
}