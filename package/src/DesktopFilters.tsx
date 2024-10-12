import React, { useEffect, useMemo, useState } from "react";
import type {
    ColumnFiltersState,
    ColumnOrderState,
    ColumnPinningState,
    PaginationState,
    RowSelectionState,
    SortingState,
    VisibilityState,
} from "@tanstack/react-table";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { useMedia } from "react-use";
import { useForm } from "react-hook-form";
import { MyTableBody } from "./TableBody";
import {
    useDisclosure,
    Button,
    Input,
} from "@nextui-org/react";
import { USER_MESSAGES } from "./constants";
import TablePagination from "./TablePagination";
import DataTableModal from "./DataTableModal";


const DesktopFilters = ({ columns, handleSubmit, onSubmit, inputDefaultValue, register, mode, setMode, isCreateOrEditMode, table, getValues, reset, updateMutation, deleteMutation, isFilterDirty, createMutation }) => {
    return (
        <div className="w-full flex flex-row flex-wrap gap-2 items-center">
            <form id="addDataForm" onSubmit={handleSubmit(onSubmit)} className="flex row gap-2 mt-2 md:flex-wrap">
                {columns.map((column) => (
                    column.accessorKey !== 'userLink' && (
                        <div key={column.accessorKey} className="mb-2">
                            <div>
                                {["string", "number", "longtext"].includes(
                                    column.meta?.type
                                ) && (
                                        <Input
                                            {...register(column.accessorKey, {
                                                setValueAs(value) {
                                                    const type = column.meta?.type;
                                                    if (
                                                        typeof value === "string" &&
                                                        value?.trim() === ""
                                                    ) {
                                                        return undefined;
                                                    }
                                                    if (type === "number") return Number(value);
                                                    if (type === "string" || type === "longtext")
                                                        return String(value);
                                                },
                                            })}
                                            defaultValue={inputDefaultValue(column.accessorKey)}
                                            type={
                                                column.meta?.type === "longtext" ? "textarea" : "text"
                                            }
                                            onInput={() => {
                                                setMode("filter");
                                            }}
                                            onClick={() => {
                                                navigator.clipboard.writeText(
                                                    getValues(column.accessorKey)
                                                );
                                            }}
                                            className={column.enableColumnFilter ? "" : "hidden"}
                                            label={column.header}
                                            isReadOnly={mode === "view"}
                                            isDisabled={
                                                column.meta?.input?.disabled && isCreateOrEditMode
                                            }
                                            isClearable={true}
                                        />
                                    )}
                            </div>
                        </div>
                    )
                ))}

            </form>
            <div className="flex gap-2">
                <Button
                    variant="ghost"
                    onPress={() => {
                        table.resetColumnFilters();
                        reset();
                    }}
                    isDisabled={!isFilterDirty}
                    startContent={<Icon icon="solar:cup-paper-bold" />}
                    className="flex-shrink-0"
                    size={"lg"}
                >
                    Сбросить фильтры
                </Button>

                <Button
                    form="addDataForm"
                    type="submit"
                    isLoading={
                        updateMutation.isPending ||
                        createMutation.isPending ||
                        deleteMutation.isPending
                    }
                    color={mode === "delete" ? "danger" : "primary"}
                    size={"lg"}
                    // size={isMobile ? "lg" : undefined}
                    // isIconOnly={isMobile}
                    startContent={<Icon icon="material-symbols:filter-alt" />}
                    onPress={() => {
                        setMode("filter");
                    }}
                    isDisabled={mode !== "filter"}
                    className="flex-shrink-0"
                >
                    <p className="first-letter:uppercase">
                        Искать инфо
                    </p>
                </Button>
            </div>
        </div>
    )
}

export default DesktopFilters