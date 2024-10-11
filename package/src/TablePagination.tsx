import React from "react";
import {
    Button,
    Pagination,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from "@nextui-org/react";
import { PAGE_PAGINATION_SIZES } from "./constants";

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
                    <Button variant="flat" className="">
                        {table.getState().pagination.pageSize} из {total}
                    </Button>
                </DropdownTrigger>
                <DropdownMenu
                    aria-label="pageSize"
                    variant="solid"
                    color="primary"
                    disallowEmptySelection
                    selectionMode="single"
                    selectedKeys={[table.getState().pagination.pageSize]}
                >
                    {PAGE_PAGINATION_SIZES.map((pageSize) => {
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
            </Dropdown>
        </>
    )
}