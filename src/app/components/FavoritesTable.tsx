

import React from 'react'
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Pagination,
    getKeyValue,
    Tooltip,
    Button,
    Link,

} from "@nextui-org/react";
import { toast  } from 'sonner';
import { Icon } from '@iconify/react';
import { getStorageList } from '../../../package/src/FavoriteIcon';
import { useMedia } from 'react-use';


const EmptyFavorites = () => {
    return (
        <div className="flex flex-col h-full w-full items-center justify-center">
            <h2 className="text-2xl font-bold">В избранном пока нет записей.</h2>
            <p className='flex items-center align-middle gap-1 p-2'>Нажмите в таблице на кнопку
                <Icon icon="icon-park-outline:add-one" width={24} height={24} />
                для добавления записи в избранное.</p>
        </div>
    )
}

const DeleteFavButton = ({ item, setItems }) => {
    return (
        <Tooltip content="Удалить из избранного">
            <Button
                isIconOnly
                size='sm'
                radius='sm'
                onClick={() => {
                    const dufavorites = getStorageList();
                    const index = dufavorites.findIndex((fav) => fav.id === item.id);
                    if (index !== -1) {
                        dufavorites.splice(index, 1);
                        localStorage.setItem("dufavorites", JSON.stringify(dufavorites));
                        toast.warning('Запись удалена из избранного', {
                            position: 'top-center',
                            duration: 2000
                        });
                        setItems(getStorageList()); // обновляем список избранного
                    }
                }}
            >
                <Icon icon="mdi:close" />
            </Button>
        </Tooltip>
    )
}


const FavoritesTable = ({ favList }) => {
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const [page, setPage] = React.useState(1);
    const [items, setItems] = React.useState([]);
    const pages = Math.ceil(favList.length / rowsPerPage);

    const onRowsPerPageChange = React.useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, [rowsPerPage]);

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Всего в избранном <b>{favList.length}</b> записей</span>
                    <label className="flex items-center text-default-400 text-small">
                        Показать записей:
                        {' '}
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [
        onRowsPerPageChange,
        favList.length,
        items,
        rowsPerPage,
        setPage,
        page
    ]);

    interface Item {
        name: string;
        id: number;
    }

    React.useEffect(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        setItems(favList.slice(start, end));
    }, [rowsPerPage, page, favList]);

    const isMobile = useMedia("(max-width: 768px)", true);

    const memoizedTable = React.useMemo(() => {
        if (!items || !items.length) return null

        if (isMobile) {
            return (
                <Table
                    aria-label="Избранные записи"
                    radius='none'
                    bottomContent={favList.length > 0 ? (<div className="flex w-full justify-center">
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="primary"
                            page={page}
                            total={pages}
                            onChange={(page) => setPage(page)}
                            classNames={{
                                cursor:
                                    "pagination-custom-item",
                            }}

                        />
                    </div>) : null}
                    classNames={{
                        wrapper: "min-h-[222px] p-0",
                        table: "w-full text-small",
                    }}
                    isCompact
                    isStriped
                >
                    <TableHeader>
                        <TableColumn key="userName">ФИО</TableColumn>
                        <TableColumn key="userYear">Год</TableColumn>
                        <TableColumn key="userCity">Город</TableColumn>
                        <TableColumn key="userNumber">Документ</TableColumn>
                        <TableColumn key="actions">Удалить</TableColumn>
                    </TableHeader>
                    <TableBody items={items}>
                        {(item: Item) => (
                            <TableRow key={item.name}>
                                {(columnKey) => {
                                    if (columnKey === "actions") {
                                        return (
                                            <TableCell className='p-0.5 flex justify-center'>
                                                <DeleteFavButton item={item} setItems={setItems} />
                                            </TableCell>
                                        );
                                    } else if (columnKey === "userYear" && getKeyValue(item, columnKey) === "undefined") {
                                        return <TableCell className='p-0.5'>{" "}</TableCell>;
                                    } else if (columnKey === "userNumber" && getKeyValue(item, "userLink")) {
                                        return <TableCell className='p-0.5'>
                                            <Link href={getKeyValue(item, "userLink")} target="_blank" className='accent__text underline text-small'>{getKeyValue(item, columnKey)}</Link>
                                        </TableCell>;
                                    } else {
                                        return <TableCell className='p-0.5'>{getKeyValue(item, columnKey)}</TableCell>;
                                    }
                                }}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )
        }

        return (
            <Table
            radius='none'
                aria-label="Избранные записи"
                bottomContent={favList.length > 0 ? (<div className="flex w-full justify-center">
                    <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="primary"
                        page={page}
                        total={pages}
                        onChange={(page) => setPage(page)}
                        classNames={{
                            cursor:
                                "pagination-custom-item",
                        }}
                    />
                </div>) : null}
                classNames={{
                    wrapper: "min-h-[222px]",

                }}
                isStriped
            >
                <TableHeader>
                    <TableColumn key="userNumber">Номер документа</TableColumn>
                    <TableColumn key="userName">Фамилия, имя</TableColumn>
                    <TableColumn key="userCity">Город</TableColumn>
                    <TableColumn key="userYear">Год</TableColumn>
                    <TableColumn key="actions">Удалить</TableColumn>
                </TableHeader>
                <TableBody items={items}>
                    {(item: Item) => (
                        <TableRow key={item.name}>
                            {(columnKey) => {
                                if (columnKey === "actions") {
                                    return (
                                        <TableCell>
                                            <DeleteFavButton item={item} setItems={setItems} />
                                        </TableCell>
                                    );
                                } else if (columnKey === "userYear" && getKeyValue(item, columnKey) === "undefined") {
                                    return <TableCell>{" "}</TableCell>;
                                }

                                else {
                                    return <TableCell>{getKeyValue(item, columnKey)}</TableCell>;
                                }
                            }}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        );
    }, [items, page, pages, favList.length]);

    if (!favList.length || !items.length) {
        return (
            <EmptyFavorites />
        )
    }

    if (!items || !items.length) {
        return null
    }

    return (
        <>
            <h2 className="text-2xl font-bold flex justify-center"
                style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                Мои избранные записи
            </h2>

            <p className="text-center">Если вы хотите уточнить стоимость полной информации по этим записям, оставьте заявку в форме ниже.</p>

            {topContent}

            {memoizedTable}
        </>
    );
}

export default FavoritesTable