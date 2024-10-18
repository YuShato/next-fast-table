import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

// export function getStorageList() {
//     const list = localStorage.getItem('dufavorites')
//     if (list) {
//         return JSON.parse(list)
//     } else {
//         return []
//     }
// }

// function FavoriteIconComponent({ favId, favData }: any) {
//     const [items, setItems] = useState(getStorageList())//
//     //main helper function to get data from the storage or set it


//     //on item change in the list save it to the state and localStorage
//     useEffect(() => {
//         localStorage.setItem('dufavorites', JSON.stringify(items))
//     }, [items])
//     //checking if the item is already in the list or not
//     const Favorites = items === null ? false : items.some(item => item.id === favData.id);

//     const handleToggleFavourite = () => {
//         if (Favorites) {
//             console.log("remove item")
//             const currentList = getStorageList()
//             const removeItem = currentList.find(item => item.id === favData.id);
//             if (removeItem) {
//                 const index = currentList.indexOf(removeItem);
//                 currentList.splice(index, 1);
//                 setItems(currentList);
//                 toast.warning('Запись удалена из избранного', {
//                     position: 'top-center',
//                     duration: 2000
//                 });
//             }
//         } else {
//             console.log("add item")
//             const currentList = getStorageList()
//             const newList = [...currentList, favData];
//             setItems(newList);
//             toast.success('Запись добавлена в избранное', {
//                 position: 'top-center',
//                 duration: 2000
//             });
//         }
//     }

//     return (
//         <>
//             {Favorites ?
//                 <Button isIconOnly onClick={handleToggleFavourite}
//                     variant="flat"
//                     className='p-1 border-r-2'
//                 >
//                     <Icon icon="mdi:heart" color="#CB003D" />
//                 </Button>
//                 :
//                 <Button isIconOnly onClick={handleToggleFavourite}
//                     className='p-1 border-r-2'
//                     variant="flat"
//                 >
//                     <Icon icon="mdi:heart-outline" color="#CB003D" />
//                 </Button>
//             }
//         </>
//     )
// }

export function getStorageList() {
    if (typeof window !== 'undefined') {
        const list = localStorage.getItem('dufavorites')
        if (list) {
            return JSON.parse(list)
        } else {
            return []
        }
    } else {
        return []
    }
}

function FavoriteIconComponent({ favId, favData }: any) {
    const [items, setItems] = useState(getStorageList())//
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (mounted) {
            localStorage.setItem('dufavorites', JSON.stringify(items))
        }
    }, [items, mounted])

    const Favorites = items === null ? false : items.some(item => item.id === favData.id);

    const handleToggleFavourite = () => {
        if (Favorites) {
            console.log("remove item")
            const currentList = getStorageList()
            const removeItem = currentList.find(item => item.id === favData.id);
            if (removeItem) {
                const index = currentList.indexOf(removeItem);
                currentList.splice(index, 1);
                setItems(currentList);
                toast.warning('Запись удалена из избранного', {
                    position: 'top-center',
                    duration: 2000
                });
            }
        } else {
            console.log("add item")
            const currentList = getStorageList()
            const newList = [...currentList, favData];
            setItems(newList);
            toast.success('Запись добавлена в избранное', {
                position: 'top-center',
                duration: 2000
            });
        }
    }

    return (
        <>
            {Favorites ?
                <Button isIconOnly onClick={handleToggleFavourite}
                    variant="flat"
                    className='p-1 border-r-2'
                >
                    <Icon icon="mdi:heart" color="#CB003D" />
                </Button>
                :
                <Button isIconOnly onClick={handleToggleFavourite}
                    className='p-1 border-r-2'
                    variant="flat"
                >
                    <Icon icon="mdi:heart-outline" color="#CB003D" />
                </Button>
            }
        </>
    )
}

//this is important because we have to render the component
// only in browser side, either component will through error
// because it will look for the local storage in the serverSide
// const FavoriteIcon = dynamic(() => Promise.resolve(FavoriteIconComponent), { ssr: false })

const FavoriteIcon = dynamic(() => Promise.resolve(FavoriteIconComponent), { ssr: false }) as React.ComponentType<{
    favId: any;
    favData: any;
}>;

export default FavoriteIcon