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


    return (
        <>
            <FavoriteModalBtn onOpen={onOpen} />

            <Modal
                radius='none'
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
                className='custom-modal'
                closeButton={<Button variant="solid" isIconOnly style={{ backgroundColor: "#ae3939", zIndex: 100 }}>
                    <Icon icon="mingcute:close-fill" width={20} height={20} color='white' />
                </Button>}
                scrollBehavior={"inside"}
                size='5xl'
                onClose={onClose}
            >
                <ModalContent >
                    {(onClose) => (
                        <>
                            <ModalBody className='modal-footer'>
                                <FavoritesTable favList={items} />
                            </ModalBody>

                            <ModalFooter className='modal-footer flex justify-center'>
                                <FavoritesForm favList={items} />
                            </ModalFooter>
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