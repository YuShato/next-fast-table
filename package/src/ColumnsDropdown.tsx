import React from "react";

import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { typedIcon } from "./helper";

// компонент, который может изменять отображение столбцов, убирать лишние. Пока не используется, но функционал рабочий

export default function ColumnsDropdownBtn({ isMobile, table, visibleColumnIds }) {
    return (
        <Dropdown backdrop="blur">
            <DropdownTrigger>
                <Button
                    variant="solid"
                    isIconOnly={isMobile}
                    color="primary"
                    size={isMobile ? "lg" : undefined}
                    className=" flex-shrink-0"
                    startContent={<Icon icon="material-symbols:view-column" />}
                >
                    {isMobile ? undefined : "Columns"}
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                aria-label="Multiple selection"
                variant="flat"
                color="primary"
                disallowEmptySelection
                closeOnSelect={false}
                selectionMode="multiple"
                selectedKeys={visibleColumnIds}
            >
                {table
                    .getAllColumns()
                    .filter(
                        (column) =>
                            typeof column.accessorFn !== "undefined" &&
                            column.getCanHide()
                    )
                    .map((column: any) => {
                        return (
                            <DropdownItem
                                onClick={() => column.toggleVisibility()}
                                key={column.id}
                            >
                                <div className=" flex space-x-2 items-center">
                                    {typedIcon(column.columnDef.meta?.type)}
                                    <div className=" flex items-center gap-2">
                                        {column.columnDef.header}
                                    </div>
                                </div>
                            </DropdownItem>
                        );
                    })}
            </DropdownMenu>
        </Dropdown>
    )
}