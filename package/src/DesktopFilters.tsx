import React from "react";
import { Icon } from "@iconify/react";
import {
    Button,
    Input,
} from "@nextui-org/react";
import { MIN_INPUT_LENGTH } from "./constants";

function FilterInput({ column, inputDefaultValue, register, mode, setMode, getValues, isCreateOrEditMode }) {


    return (
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
            isInvalid={getValues(column.accessorKey) !== undefined && getValues(column.accessorKey)?.length < MIN_INPUT_LENGTH}
            color={getValues(column.accessorKey)?.length >= MIN_INPUT_LENGTH ? "success" : "default"}
            errorMessage={getValues(column.accessorKey)?.length < MIN_INPUT_LENGTH && `Введите не менее ${MIN_INPUT_LENGTH} символов`}
        />
    )
}


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
                                        <FilterInput column={column} getValues={getValues} mode={mode} setMode={setMode} register={register} isCreateOrEditMode={isCreateOrEditMode} inputDefaultValue={inputDefaultValue} />
                                    )}
                            </div>
                        </div>
                    )
                ))}

            </form>
            <div className="flex gap-2">
                <Button
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