"use client"
import React from 'react'
import { Button, CardFooter, Link, Modal, ModalBody, ModalContent, Tooltip, useDisclosure } from '@nextui-org/react'
import ContactForm from './ContactForm'
import { Icon } from '@iconify/react'
import BeforeBtn from "../../../public/btn-before.svg"
import BtnAfter from "../../../public/btn-after.svg"
import Image from 'next/image'

export const OrderBtn = ({ isMobile = false }: { isMobile?: boolean }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    return (
        <>
            <div className='header-fav-wrap'>
                <Image src={BeforeBtn} alt="btn-before" className='btn-before' loading='lazy' width={34} height={3} />
                <Tooltip content="Оставить заявку">
                    <Button
                        onPress={onOpen}
                        size={"md"}
                        className={"order-btn"}
                    >
                        Оставить заявку
                    </Button>
                </Tooltip>
                <Image src={BtnAfter} alt="btn-after" className='btn-after' loading='lazy' width={64} height={3} />
            </div>

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
                    Заказать на сайте <OrderBtn />
                </li>
            </ul>

        </CardFooter>
    )
}

export default AboutOrder