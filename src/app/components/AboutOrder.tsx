"use client"
import React from 'react'
import { Button, CardFooter, Link, Modal, ModalBody, ModalContent, Tooltip, useDisclosure } from '@nextui-org/react'
import ContactForm from './ContactForm'
import { Icon } from '@iconify/react'

export const OrderBtn = ({ viewType = "flat" }: { viewType: "shadow" | "flat" | "solid" | "bordered" | "light" | "faded" | "ghost" }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const variant = (["shadow", "flat", "solid", "bordered", "light", "faded", "ghost"] as const).includes(viewType)
        ? viewType as "shadow" | "flat" | "solid" | "bordered" | "light" | "faded" | "ghost"
        : "flat";

    return (
        <>
            <Tooltip content="Оставить заявку">
                <Button onPress={onOpen} variant={variant} color="primary" size='md'>ОСТАВИТЬ ЗАЯВКУ</Button>
            </Tooltip>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
                className='p-10 w-full'
                style={{ width: "100%", maxWidth: "700px", padding: "20px", backdropFilter: "blur(10px)" }}
                closeButton={<Button color="danger" variant="light" isIconOnly>
                    <Icon icon="mingcute:close-fill" width={22} height={22} color='#800627' />
                </Button>}
            >
                <ModalContent>
                    {(onClose) => (
                        <ModalBody>
                            <ContactForm />
                        </ModalBody>
                    )}
                </ModalContent>
            </Modal>

        </>)
}
const AboutOrder = () => {


    return (
        <CardFooter className='grid grid-cols-1 gap-2' style={{ width: "100%", paddingTop: "20px", paddingBottom: "20px" }}>
            <h3 style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Как получить сведения из базы данных:</h3>
            <ul style={{ listStyle: "none", fontSize: "24px", display: 'grid', gap: "10px", marginTop: "10px", fontWeight: "semibold" }}>
                <li className='flex gap-1 align-middle items-center'>
                    <Icon icon="material-symbols:mail" width={22} height={22} color='success' />
                    Написать на почту <Link href="mailto:aectann1985@yandex.ru">aectann1985@yandex.ru</Link>
                </li>
                <li className='flex gap-1 align-middle items-center'>
                    <Icon icon="hugeicons:vk" width={22} height={22} color='success' />
                    Написать мне в <Link href='https://vk.com/id2433917'>соцсети</Link>
                </li>
                <li className='flex gap-1 align-middle items-center'>
                    <Icon icon="material-symbols-light:import-contacts-outline-sharp" width={22} height={22} color='success' />
                    Заказать на сайте <OrderBtn viewType="flat" />
                </li>
            </ul>

        </CardFooter>
    )
}

export default AboutOrder