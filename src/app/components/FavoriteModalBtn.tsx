import React, { useEffect, useState } from 'react'
import { getStorageList } from '../../../package/src/FavoriteIcon';
import { Badge, Button, Link, Tooltip } from '@nextui-org/react';

const FavoriteModalBtn = ({ onOpen }) => {
    const [badgeCount, setBadgeCount] = useState(0);
    const [badgeColor, setBadgeColor] = useState('primary');

    useEffect(() => {
        const handleStorageChange = () => {
            const dufavorites = getStorageList();
            setBadgeCount(dufavorites.length);
            setBadgeColor(dufavorites.length > 0 ? 'success' : 'primary');
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
            setBadgeColor(dufavorites.length > 0 ? 'success' : 'primary');
        }, 500);

        return () => {
            clearInterval(intervalId);
        };
    }, []);


    return (
        <Tooltip content="Открыть список избранного">
            <Badge content={badgeCount} color={badgeColor as 'default' | 'success' | 'primary'} >
                <Button as={Link} color="primary" href="#" variant="flat"
                    // startContent={<Icon icon="mdi:heart-outline" />}
                    size="md"
                    onClick={onOpen}
                >
                    Мое избранное
                </Button>
            </Badge>
        </Tooltip>
    )
}

export default FavoriteModalBtn