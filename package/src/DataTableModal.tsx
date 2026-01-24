import React from "react";
import { toast } from "sonner";
import { Controller } from "react-hook-form";
import { getLocalTimeZone, fromDate } from "@internationalized/date";
import { typedIcon } from "./helper";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Button,
    Input,
    Textarea,
    Select,
    SelectItem,
    DatePicker,
} from "@nextui-org/react";
import { MODE_NAMES } from "./constants";


const DataTableModal = ({isMobile, isOpen, onOpenChange, onSubmit, columns, mode, onClose, register, handleSubmit, getValues, watch, control, isCreateOrEditMode, inputDefaultValue, updateMutation, createMutation, deleteMutation, onResetButtonPress, isDirty }) => {
    return (
        <Modal
            id="modal"
            isOpen={isOpen}
            placement={isMobile ? "top" : "center"}
            scrollBehavior="inside"
            onOpenChange={onOpenChange}
            onClose={onClose}
            backdrop="blur"
            isDismissable={false}
            className="custom-modal"
            radius="none"
        >
            <ModalContent>
                <ModalHeader>
                    <span>{mode !== undefined ? MODE_NAMES[mode] : "Просмотр"}</span>
                </ModalHeader>
                <ModalBody>
                    <form id="addDataForm" onSubmit={handleSubmit(onSubmit)}>
                        {columns.map((column) => (
                            column.accessorKey !== 'userLink' && (<div key={column.accessorKey} className="mb-2">
                                <div>
                                    {["string", "number", "longtext"].includes(
                                        column.meta?.type
                                    ) && (
                                            <Input
                                                radius="none"
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
                                                onClick={() => {
                                                    if (mode !== "view") return;
                                                    navigator.clipboard.writeText(
                                                        getValues(column.accessorKey)
                                                    );
                                                    toast.success("Copied to clipboard");
                                                }}
                                                className={column.enableColumnFilter ? "" : "hidden"}
                                                // endContent={typedIcon(column.meta?.type)}
                                                label={column.header}
                                                isReadOnly={mode === "view"}
                                                isDisabled={
                                                    column.meta?.input?.disabled && isCreateOrEditMode
                                                }
                                                isRequired={
                                                    column.meta?.input?.required && mode !== "filter"
                                                }
                                                isClearable={true}
                                            />
                                        )}

                                    {column.meta?.type === "boolean" && (
                                        <Controller
                                            name={column.accessorKey}
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    label={column.header}
                                                    isDisabled={mode === "view" || mode === "delete"}
                                                    defaultSelectedKeys={[
                                                        inputDefaultValue(column.accessorKey)?.toString(),
                                                    ]}
                                                    onChange={(
                                                        e: React.ChangeEvent<HTMLSelectElement>
                                                    ) => {
                                                        const select = e.target.value;
                                                        if (select === "true") {
                                                            return field.onChange(true);
                                                        }
                                                        if (select === "false") {
                                                            return field.onChange(false);
                                                        }
                                                        return field.onChange(undefined);
                                                    }}
                                                >
                                                    {["false", "true"].map((str) => (
                                                        <SelectItem key={str} value={str}>
                                                            {str}
                                                        </SelectItem>
                                                    ))}
                                                </Select>
                                            )}
                                        />
                                    )}
                                    {column.meta?.type === "date" && (
                                        <Controller
                                            control={control}
                                            name={column.accessorKey}
                                            render={({ field }) => (
                                                // <DatePicker
                                                //     granularity="second"
                                                //     label={column.header}
                                                //     value={
                                                //         field.value
                                                //             ? fromDate(field.value, getLocalTimeZone())
                                                //             : undefined
                                                //     }
                                                //     onChange={(date) => {
                                                //         field.onChange(date.toDate());
                                                //     }}
                                                //     isDisabled={column.meta?.edit?.disabled}
                                                //     isRequired={
                                                //         column.meta?.edit?.required && isCreateOrEditMode
                                                //     }
                                                // />
                                                 <DatePicker
                                                    granularity="second"
                                                    label={column.header}
                                                    value={
                                                        field.value
                                                            ? fromDate(field.value, getLocalTimeZone())
                                                            : undefined
                                                    }
                                                    onChange={(date) => {
                                                        if (!date) return;
                                                        field.onChange(date.toDate());
                                                    }}
                                                    isDisabled={column.meta?.edit?.disabled}
                                                    isRequired={
                                                        column.meta?.edit?.required && isCreateOrEditMode
                                                    }
                                                />
                                            )}
                                        />
                                            )}
                                    
                                    {column.meta?.type === "enum" && (
                                        <Controller
                                            name={column.accessorKey}
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    label={column.header}
                                                    isDisabled={mode === "view" || mode === "delete"}
                                                    defaultSelectedKeys={[field.value]}
                                                    onChange={(
                                                        e: React.ChangeEvent<HTMLSelectElement>
                                                    ) => field.onChange(e.target.value)}
                                                >
                                                    {column.meta?.enum?.map((value) => (
                                                        <SelectItem key={value} value={value}>
                                                            {value}
                                                        </SelectItem>
                                                    ))}
                                                </Select>
                                            )}
                                        />
                                    )}
                                    {["array", "json"].includes(column.meta?.type) && (
                                        <Controller
                                            name={column.accessorKey}
                                            control={control}
                                            render={({ field }) => (
                                                <Textarea
                                                    radius="none"
                                                    isInvalid={
                                                        typeof field.value !== "object" &&
                                                        !Array.isArray(field.value) &&
                                                        field.value !== undefined
                                                    }
                                                    errorMessage="Invalid JSON or ARRAY"
                                                    endContent={typedIcon(column.meta?.type)}
                                                    defaultValue={JSON.stringify(field.value, null, 2)}
                                                    type="text"
                                                    onChange={(e) => {
                                                        try {
                                                            field.onChange(JSON.parse(e.target.value));
                                                        } catch (error) {
                                                            field.onChange(e.target.value);
                                                        }
                                                    }}
                                                    onClick={() => {
                                                        if (mode !== "view") return;
                                                        navigator.clipboard.writeText(
                                                            JSON.stringify(
                                                                getValues(column.accessorKey),
                                                                null,
                                                                2
                                                            )
                                                        );
                                                        toast.success("Copied to clipboard");
                                                    }}
                                                    className={
                                                        column.enableColumnFilter ? "" : "hidden"
                                                    }
                                                    label={column.header}
                                                    isReadOnly={mode === "view"}
                                                    isDisabled={
                                                        column.meta?.input?.disabled && isCreateOrEditMode
                                                    }
                                                    isRequired={
                                                        column.meta?.input?.required && mode !== "filter"
                                                    }
                                                />
                                            )}
                                        />
                                    )}
                                </div>
                            </div>)
                        ))}
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="ghost"
                        onClick={mode === "filter" ? onResetButtonPress : () => {
                            onClose()
                            onResetButtonPress()
                        }}
                    >
                        {mode === "filter" ? "Сбросить фильтры" : "Выйти"}
                    </Button>
                    <Button
                        form="addDataForm"
                        isDisabled={!isDirty && isCreateOrEditMode}
                        type="submit"
                        isLoading={
                            updateMutation.isPending ||
                            createMutation.isPending ||
                            deleteMutation.isPending
                        }
                        style={{ backgroundColor: "#B14101", borderColor: "#B14101", color: "white" }}
                    // color={mode === "delete" ? "danger" : "primary"}
                    >
                        <p className="first-letter:uppercase">
                            {mode !== undefined ? (mode === "view" ? "Копировать" : MODE_NAMES[mode]) : ""}
                        </p>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default DataTableModal