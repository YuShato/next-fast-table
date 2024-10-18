"use client"
import React from 'react'
import { Button, Modal, ModalBody, ModalContent, ModalFooter, useDisclosure } from '@nextui-org/react'
import { Icon } from '@iconify/react'
import Image from 'next/image'

const AboutImg = ({ path, alt = "", text = "" }) => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    return (
        <div className='cursor-pointer flex justify-center' onClick={onOpen}   >
            {/* <Tooltip content="Посмотреть изображение" placement="right-start" offset={-20} color='foreground'> */}
            <Image src={path} width={600} height={600} alt={alt} loading='lazy' style={{ width: "100%", maxWidth: "600px", borderRadius: "10px", cursor: "zoom-in" }}></Image>
            {/* </Tooltip> */}

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
                className='p-10 w-full'
                style={{ width: "100%", padding: "20px", backdropFilter: "blur(10px)" }}
                closeButton={<Button variant="solid" isIconOnly style={{ backgroundColor: "#c42d55" }}>
                    <Icon icon="mingcute:close-fill" width={20} height={20} color='white' />
                </Button>}
                scrollBehavior={"inside"}
                size='5xl'
                onClose={onClose}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalBody>
                                <Image src={path} width={700} height={700} alt={alt} loading='lazy' style={{ width: "100%", borderRadius: "10px" }} objectFit='cover'></Image>
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