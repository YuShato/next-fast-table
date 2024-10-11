import React from "react";
import { Icon } from "@iconify/react";
import {
    Button,
} from "@nextui-org/react";

export default function ActionHeaderButtons({ onDelete, onCreate, isMobile, onDeleteButtonClick, onCreateButtonClick, table, deleteMutation }) {
    return (
        <>
            {onDelete && (
                <Button
                    className=" flex-shrink-0 ml-auto"
                    color="danger"
                    size={isMobile ? "lg" : undefined}
                    isIconOnly={isMobile}
                    isLoading={deleteMutation.isPending}
                    variant="solid"
                    startContent={<Icon icon="material-symbols:delete" />}
                    onClick={onDeleteButtonClick}
                    isDisabled={table.getSelectedRowModel().rows.length === 0 || false}
                >
                    {isMobile ? undefined : "Delete"}
                </Button>
            )}
            {onCreate && (
                <Button
                    color="primary"
                    className=" flex-shrink-0"
                    isIconOnly={isMobile}
                    size={isMobile ? "lg" : undefined}
                    variant="solid"
                    startContent={<Icon icon="material-symbols:add" />}
                    onClick={onCreateButtonClick}
                >
                    {isMobile ? undefined : "Create"}
                </Button>
            )}
        </>)
}