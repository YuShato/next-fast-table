"use client"
import React, { useEffect, useState } from 'react'
import { Button, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react'
import { Icon } from '@iconify/react';
import { clearStorageList, getStorageList } from '../../../package/src/FavoriteIcon';
import FavoritesTable from './FavoritesTable';
import FavoritesForm from './FavoritesForm';
import FavoriteModalBtn from './FavoriteModalBtn';

const ContentFavoriteModal = ({ isOrdered = false, items = [], handleFormSubmit }) => {
    // после отправки формы вылезает сообщение что форма отправлена
    if (isOrdered) {
        return (<ModalContent >
            {(onClose) => (
                <>
                    <ModalHeader>
                        <p className='text-center'><b>Спасибо за заявку!</b><br /></p>
                    </ModalHeader>

                    <ModalBody className='modal-footer'>
                        <p className='text-center'>
                            Я отвечу Вам на указанный адрес электронной почты в ближайшее время.
                        </p>

                        <p className='text-center'>Пока Вы можете ознакомиться с основным сайтом {" "}
                            <Link className='accent__text' href='https://dompredkov.ru/' target='_blank'>"Дом Предков"</Link>.
                        </p>
                    </ModalBody>
                </>
            )}
        </ModalContent>)
    }

    // если форма еще не отправлена

    return (
        <ModalContent >
            {(onClose) => (
                <>
                    <ModalBody className='modal-footer'>
                        <FavoritesTable favList={items} />
                    </ModalBody>

                    <ModalFooter className='modal-footer flex justify-center'>
                        <FavoritesForm favList={items} handleFormSubmit={handleFormSubmit} />
                    </ModalFooter>
                </>
            )}
        </ModalContent>
    )

}

const FavoriteModal = ({ storageList = [] }) => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const [items, setItems] = useState(storageList);
    const [isOrdered, setIsOrdered] = useState(false);

    useEffect(() => {
        const handleStorageChange = () => {
            setItems(getStorageList());
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleFormSubmit = () => {
        clearStorageList(); // Очистить список избранного после отправки формы
        setItems([]); // Обновить состояние items
        setIsOrdered(true); // Установить флаг isOrdered в true
    };

    useEffect(() => {
        if (isOpen) {
            setItems(getStorageList());
            setIsOrdered(false);
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
                size='5xl'
                onClose={onClose}
                scrollBehavior="inside"
            >
                <ContentFavoriteModal isOrdered={isOrdered} items={items} handleFormSubmit={handleFormSubmit} />
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