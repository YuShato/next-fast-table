"use client"
import React from 'react'
import { Button, CardFooter, Link, Modal, ModalBody, ModalContent, useDisclosure } from '@nextui-org/react'
import ContactForm from './ContactForm'
import { Icon } from '@iconify/react'
const AboutOrder = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <CardFooter>
            <h3 style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Как получить сведения из базы данных:</h3>
            <ul>
                <li>написать на почту <Link href="mailto:aectann1985@yandex.ru">aectann1985@yandex.ru</Link> </li>
                <li>Написать мне в <Link href='https://vk.com/id2433917'>соцсети</Link> </li>
                <li>либо <Button onPress={onOpen} variant='flat'>оставьте заявку</Button>  </li>
            </ul>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
                className='p-10 w-full'
                style={{ width: "100%", maxWidth: "500px", padding: "20px", backdropFilter: "blur(10px)" }}
                closeButton={<Button color="danger" variant="light" isIconOnly>
                    <Icon icon="mingcute:close-fill" width={20} height={20} color='#800627' />
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
        </CardFooter>
    )
}

export default AboutOrder