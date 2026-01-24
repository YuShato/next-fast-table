
"use client";
import React from "react";
import { Icon } from "@iconify/react";
import {
    Button,
} from "@nextui-org/react";



// кнопки, которые могут  добавлять или удалять какие-то строки. Недоступны для обычного полтьзователя, но функционал рабочий. Пока не используется, но функционал рабочий
export default function ActionHeaderButtons({ onDelete, onCreate, isMobile, onDeleteButtonPress, onCreateButtonPress, table, deleteMutation }) {
    //@ts-ignore
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
                    onPress={onDeleteButtonPress}
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
                    onPress={onCreateButtonPress}
                >
                    {isMobile ? undefined : "Create"}
                </Button>
            )}
        </>)
}