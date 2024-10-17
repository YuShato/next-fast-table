import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@nextui-org/react";
import { Icon } from "@iconify/react";


function FavoriteIconComponent({ favId, favData }: any) {
    const [items, setItems] = useState(getStorageList())//
    //main helper function to get data from the storage or set it
    function getStorageList() {
        const list = localStorage.getItem('dufavorites')
        if (list) {
            return JSON.parse(list)
        } else {
            return []
        }
    }

    //on item change in the list save it to the state and localStorage
    useEffect(() => {
        localStorage.setItem('dufavorites', JSON.stringify(items))
    }, [items])
    //checking if the item is already in the list or not
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
            }
        } else {
            console.log("add item")
            const currentList = getStorageList()
            const newList = [...currentList, favData];
            setItems(newList);
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