"use client"
import React from 'react'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, useDisclosure } from '@nextui-org/react'
import { Icon } from '@iconify/react'
import Image from 'next/image'

const AboutImg = ({ path, alt="", text="" }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <div className='cursor-pointer' onClick={onOpen}>
            <Image src={path} width={500} height={500} alt={alt} loading='lazy' style={{ width: "100%", maxWidth: "500px", borderRadius: "10px" }}></Image>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
                className='p-10 w-full'
                style={{ width: "100%", padding: "20px", backdropFilter: "blur(10px)" }}
                closeButton={<Button  variant="solid" isIconOnly style={{ backgroundColor: "#c42d55" }}>
                    <Icon icon="mingcute:close-fill" width={20} height={20} color='white' />
                </Button>}
                scrollBehavior={"inside"}
                size='5xl'
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                        <ModalBody>
                            <Image src={path} width={700} height={700} alt={alt} loading='lazy' style={{ width: "100%", borderRadius: "10px" }} objectFit='cover'></Image>
                        </ModalBody>
                        <ModalFooter>
                            <p>{text}</p>
                        </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default AboutImg