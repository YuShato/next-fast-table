import React from "react";
import {
    Button,
    Pagination,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger
} from "@nextui-org/react";
import { PAGE_PAGINATION_SIZES_DESKTOP, PAGE_PAGINATION_SIZES_MOBILE } from "./constants";
import { useMedia } from "react-use";


const PaginationWithSizes = ({ table }) => {
    const isMobile = useMedia("(max-width: 768px)", true);

    if (isMobile) {
        return (
            <DropdownMenu
                aria-label="pageSize"
                variant="solid"
                color="primary"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={[table.getState().pagination.pageSize]}
            >
                {PAGE_PAGINATION_SIZES_MOBILE.map((pageSize) => {
                    return (
                        <DropdownItem
                            key={pageSize}
                            onClick={() => table.setPageSize(pageSize)}
                        >
                            {pageSize}
                        </DropdownItem>
                    );
                })}
            </DropdownMenu>
        )
    }

    return (
        <DropdownMenu
            aria-label="pageSize"
            variant="solid"
            color="primary"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={[table.getState().pagination.pageSize]}
        >
            {PAGE_PAGINATION_SIZES_DESKTOP.map((pageSize) => {
                return (
                    <DropdownItem
                        key={pageSize}
                        onClick={() => {
                            table.setPageSize(pageSize)
                            localStorage.setItem('pageSize', `${pageSize}`);
                        }
                        }
                    >
                        {pageSize}
                    </DropdownItem>
                );
            })}
        </DropdownMenu>
    )
}

export default function TablePagination({ isMobile, table, total }) {
    return (
        <>
            <Pagination
                showControls
                siblings={isMobile ? 0 : 3}
                size={isMobile ? "md" : undefined}
                variant="flat"
                total={table.getPageCount()}
                initialPage={1}
                page={table.getState().pagination.pageIndex + 1}
                onChange={(page) => {
                    table.setPageIndex(page - 1);
                }}
            />

            <Dropdown backdrop="blur">
                <DropdownTrigger>
                    <Button title="Показывать записей:">
                        {table.getState().pagination.pageSize} из {total}
                    </Button>
                </DropdownTrigger>
                <PaginationWithSizes table={table} />
            </Dropdown>
        </>
    )
}