"use client"
import React from 'react'
import { Button, CardFooter, Link, Modal, ModalBody, ModalContent, Tooltip, useDisclosure } from '@nextui-org/react'
import ContactForm from './ContactForm'
import { Icon } from '@iconify/react'
import BeforeBtn from "../../../public/btn-before.svg"
import BtnAfter from "../../../public/btn-after.svg"
import Image from 'next/image'
import ButtonToTop from '../../../package/src/ButtonToTop'

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
                        className={"order-btn standart-btn"}
                    >
                        Оставить заявку
                    </Button>
                </Tooltip>
                <Image src={BtnAfter} alt="btn-after" className='btn-after' loading='lazy' width={64} height={3} />
            </div>

            <Modal
                radius='none'
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
                className='custom-modal'
                closeButton={<Button color="danger" variant="light" isIconOnly style={{ zIndex: 100 }}>
                    <Icon icon="mingcute:close-fill" width={22} height={22} color='#ae3939' />
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
        <CardFooter className='card order-block '>
            <h3>Как получить сведения из базы данных:</h3>
            <ul>
                <li >
                    <Icon icon="material-symbols:mail" width={22} height={22} />

                    <p>
                        Написать на почту <Link href="mailto:aectann1985@yandex.ru">aectann1985@yandex.ru</Link>
                    </p>
                </li>

                <li >
                    <Icon icon="hugeicons:vk" width={22} height={22} />
                    <p>
                        Написать мне в <Link href='https://vk.com/id2433917'>соцсети</Link>
                    </p>
                </li>

                <li style={{ alignItems: "center" }}>
                    <Icon icon="material-symbols-light:import-contacts-outline-sharp" width={22} height={22} />

                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>

                        Заказать на сайте <OrderBtn />
                    </div>
                </li>
            </ul>

            <ButtonToTop />

        </CardFooter>
    )
}

export default AboutOrder