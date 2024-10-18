"use client"
import React, { useEffect, useState } from 'react'
import { Button, Link, Modal, ModalBody, ModalContent, ModalFooter, Tooltip, useDisclosure } from '@nextui-org/react'
import { Icon } from '@iconify/react';
import { getStorageList } from '../../../package/src/FavoriteIcon';
import FavoritesTable from './FavoritesTable';

const FavoriteModal = () => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const [items, setItems] = useState(getStorageList());


    useEffect(() => {
        const handleStorageChange = () => {
            setItems(getStorageList());
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        if (isOpen) {
            setItems(getStorageList());
        }
    }, [isOpen]);

    return (
        <>
            <Tooltip content="Открыть список избранного">
                <Button as={Link} color="primary" href="#" variant="flat"
                    startContent={<Icon icon="mdi:heart-outline" />}
                    size="md"
                    onClick={onOpen}
                >
                    Мое избранное
                </Button>
            </Tooltip>

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
                                <FavoritesTable favList={items} />
                            </ModalBody>
                            <ModalFooter className='flex justify-center'>
                                i am footer
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default FavoriteModal