"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { Button, Link, Modal, ModalBody, ModalContent, ModalFooter, Tooltip, useDisclosure } from '@nextui-org/react'
import { Icon } from '@iconify/react';
import { getStorageList } from '../../../package/src/FavoriteIcon';
import FavoritesTable from './FavoritesTable';
import FavoritesForm from './FavoritesForm';
import FavoriteModalBtn from './FavoriteModalBtn';

const FavoriteModal = ({ storageList = [] }) => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const [items, setItems] = useState(storageList);



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

    const footerContent = useMemo(() => {
        if (items.length > 0) {
            <ModalFooter className='modal-footer flex justify-center'>
                <FavoritesForm />
            </ModalFooter>
        }

        return <></>;
    }, [items]);

    return (
        <>
            <FavoriteModalBtn onOpen={onOpen} />

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
                radius='sm'
            >
                <ModalContent >
                    {(onClose) => (
                        <>
                            <ModalBody className='modal-footer'>
                                <FavoritesTable favList={items} />
                            </ModalBody>

                            {footerContent}
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

const ClientSideComponent = () => {
    const storageList = getStorageList();


    return (
        <FavoriteModal storageList={storageList} />
    );
};

export default ClientSideComponent;

// export default FavoriteModal