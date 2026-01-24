import React from "react";
import {
    cn,
    DropdownMenu,
    DropdownItem,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";

// полностью рабочий компонент, пока не используется, но функционал рабочий

function DropDownViewCell(hideEdit: any, iconClasses: string, setMode: any, reset: any, row: any, onOpen: any, hideDelete: any) {
    return <DropdownMenu
        variant="faded"
        aria-label="Dropdown menu with icons"
    >
        {!hideEdit &&
            ((
                <DropdownItem
                    key="edit"
                    color="primary"
                    variant="flat"
                    startContent={<Icon
                        icon="material-symbols:edit-square"
                        className={iconClasses} />}
                    onPress={() => {
                        setMode("edit");
                        reset(row.original);
                        onOpen();
                    }}
                >
                    Edit
                </DropdownItem>
            ) as any)}
        <DropdownItem
            key="view"
            color="primary"
            variant="flat"
            startContent={<Icon icon="solar:eye-bold" className={iconClasses} />}
            onPress={() => {
                setMode("view");
                reset(row.original);
                onOpen();
            }}
        >
            View
        </DropdownItem>
        {!hideDelete && (
            <DropdownItem
                key="delete"
                className="text-danger"
                variant="flat"
                color="danger"
                startContent={<Icon
                    icon="carbon:delete"
                    className={cn(iconClasses, "text-danger")} />}
                onPress={() => {
                    setMode("delete");
                    reset(row.original);
                    onOpen();
                }}
            >
                Delete
            </DropdownItem>
        )}
    </DropdownMenu>;
}

export default DropDownViewCell;

