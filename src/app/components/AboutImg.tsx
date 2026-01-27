"use client"
import React from 'react'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, useDisclosure } from '@nextui-org/react'
import { Icon } from '@iconify/react'
import Image from 'next/image'

const AboutImg = ({ path, alt = "", text = "" }) => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    return (
        <div className='cursor-pointer flex justify-center' onClick={onOpen}>
            <Image src={path} width={600} height={600} alt={alt} loading='lazy' style={{ width: "100%", maxWidth: "600px", borderRadius: "5px", cursor: "zoom-in" }} placeholder="blur"></Image>

            <Modal
                radius='none'
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
                className='custom-modal w-full'
                closeButton={<Button variant="solid" isIconOnly style={{ backgroundColor: "#ae3939", zIndex: 100 }}>
                    <Icon icon="mingcute:close-fill" width={20} height={20} color='white' />
                </Button>}
                scrollBehavior={"inside"}
                size='5xl'
                onClose={onClose}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalBody style={{ padding: 0 }}>
                                <Image src={path} width={700} height={700} alt={alt} loading='lazy' style={{ width: "100%", borderRadius: "5px" }} placeholder="blur"></Image>
                            </ModalBody>
                            <ModalFooter className='flex justify-center'>
                                <p className='text-center text-medium' style={{ fontSize: "18px" }} >{text}</p>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default AboutImg