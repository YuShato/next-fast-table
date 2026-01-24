import React, { useEffect, useState } from 'react'
import { getStorageList } from '../../../package/src/FavoriteIcon';
import { Badge, Button, Tooltip } from '@nextui-org/react';
import BeforeBtn from "../../../public/btn-before.svg"
import BtnAfter from "../../../public/btn-after.svg"
import Image from 'next/image';

const FavoriteModalBtn = ({ onOpen }) => {
    const [badgeCount, setBadgeCount] = useState(0);
    const [badgeClassName, setBadgeClassName] = useState('fav-badge-empty');

    useEffect(() => {
        const handleStorageChange = () => {
            const dufavorites = getStorageList();
            setBadgeCount(dufavorites.length);
            setBadgeClassName(dufavorites.length > 0 ? 'fav-badge' : 'fav-badge-empty');
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const dufavorites = getStorageList();
            setBadgeCount(dufavorites.length);
            setBadgeClassName(dufavorites.length > 0 ? 'fav-badge' : 'fav-badge-empty');
        }, 500);

        return () => {
            clearInterval(intervalId);
        };
    }, []);


    return (
        <div className='header-fav-wrap'>
            <Image src={BeforeBtn} alt="btn-before" className='btn-before' loading='lazy' width={34} height={3} />

            <Badge content={badgeCount} className={badgeClassName} >
                <Tooltip content="Открыть список избранного">
                    <Button
                        href="#"
                        size="md"
                        onPress={onOpen}
                        className='header-fav-btn'
                    >
                        Мое избранное
                    </Button>
                </Tooltip>
            </Badge>

            <Image src={BtnAfter} alt="btn-after" className='btn-after' loading='lazy' width={64} height={3} />
        </div>
    )
}

export default FavoriteModalBtn