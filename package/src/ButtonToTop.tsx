import { Icon } from '@iconify/react'
import { Button, Tooltip } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'

const ButtonToTop = () => {
    const isBrowser = () => typeof window !== 'undefined'; //The approach recommended by Next.js

    function scrollToTop() {
        if (!isBrowser()) return;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const [isVisible, setIsVisible] = useState(false);

    const handleScroll = () => {
        // Показывать кнопку, когда пользователь прокручивает страницу вниз 
        if (window.scrollY > 100) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        // Добавить прослушиватель событий прокрутки, когда компонент монтируется 
        window.addEventListener('scroll', handleScroll);

        // Удалить прослушиватель событий, когда компонент отмонтируется 
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <Tooltip content="Вверх">
            <Button isIconOnly
                // color="warning"
                aria-label="Вверх"
                size='lg'
                variant='solid'
                className={`cursor-pointer fixed bottom-0 right-0 ml-auto z-50 items-center text-xl flex gap-2 ${isVisible ? 'opacity-100' : 'opacity-0'} `}
                style={{ transition: 'opacity 0.5s ease-in-out', bottom: `20px`, right: `20px`, background: '#B14101' }}
                onClick={scrollToTop}
            >
                <Icon icon="solar:arrow-to-top-left-linear" className="text-xl" />
            </Button>
        </Tooltip>
    )
}

export default ButtonToTop