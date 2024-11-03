import React, { useEffect } from "react";
import { Icon } from "@iconify/react";
import {
  Button,
  Input,
} from "@nextui-org/react";
import { MIN_INPUT_LENGTH } from "./constants";

import { useDebouncedCallback } from "use-debounce";
import { useTheme } from "next-themes";

const INPUT_COLORS = {
  success: "#037c38",
  success__light: "#9be5bb",
  default: "#3B3937",
}

function FilterInput({ column, inputDefaultValue, register, mode, setMode, getValues, isCreateOrEditMode, onSubmit, isFilterDirty }) {
  const { resolvedTheme = "light" } = useTheme()

  const [inputColor, setInputColor] = React.useState("default");
  const [textColor, setTextColor] = React.useState(INPUT_COLORS.default);

  useEffect(() => {
    if (!isFilterDirty) {
      setInputColor("default");
      setTextColor(INPUT_COLORS.default);
    }
  }, [isFilterDirty]);

  const handleBackspace = useDebouncedCallback((e) => {
    const inputValue = e.target.value;
    if (inputValue === "") {
      setMode("filter");
      setInputColor("default");
      setTextColor(INPUT_COLORS.default);
      const values = getValues();
      values[column.accessorKey] = undefined;
      onSubmit(values);
    }
  }, 200); // задержка в 200 мс

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      handleBackspace(e);
    }
  };
  return (
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
      onInput={(e) => {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement;
        setMode("filter");

        if (target.value?.length >= MIN_INPUT_LENGTH) {
          setInputColor("success");
          setTextColor(() => resolvedTheme === "dark" ? INPUT_COLORS.success__light : INPUT_COLORS.success);
          const values = getValues();
          values[column.accessorKey] = target.value;
          onSubmit({ ...values, [column.accessorKey]: target.value });
        }
      }}
      onKeyDown={handleKeyDown}
      onClick={() => {
        navigator.clipboard.writeText(
          getValues(column.accessorKey)
        );
      }}
      className={column.enableColumnFilter ? "filter-input" : "hidden"}
      label={column.header}
      isReadOnly={mode === "view"}
      isDisabled={
        column.meta?.input?.disabled && isCreateOrEditMode
      }
      isClearable={true}
      onClear={() => {
        setMode("filter");
        setInputColor("default")
        setTextColor(INPUT_COLORS.default)
        const values = getValues();
        values[column.accessorKey] = undefined;
        onSubmit(values);
      }}
      isInvalid={getValues(column.accessorKey) !== undefined && getValues(column.accessorKey)?.length < MIN_INPUT_LENGTH}
      color={inputColor}
      style={{
        color: textColor,
        fontWeight: 700,
      }}
      size="sm"
      errorMessage={<span 
        className="filter-input__error"
        >{getValues(column.accessorKey)?.length < MIN_INPUT_LENGTH && `Введите не менее ${MIN_INPUT_LENGTH} символов`}</span>}
    />
  );
}

const DesktopFilters = ({ columns, handleSubmit, onSubmit, inputDefaultValue, register, mode, setMode, isCreateOrEditMode, table, getValues, reset, updateMutation, deleteMutation, isFilterDirty, createMutation }) => {

  return (
    <div className="w-full flex flex-row flex-wrap gap-2 items-center pt-1 pb-1">
      <form id="addDataForm" onSubmit={handleSubmit(onSubmit)} className="filter-form  flex row gap-2 md:flex-wrap">
        {columns.map((column) => (
          column.accessorKey !== 'userLink' && (
            <div key={column.accessorKey} className="mb-2">
              <div>
                {["string", "number", "longtext"].includes(
                  column.meta?.type
                ) && (
                    <FilterInput column={column} getValues={getValues} mode={mode} setMode={setMode} register={register} isCreateOrEditMode={isCreateOrEditMode} inputDefaultValue={inputDefaultValue} onSubmit={onSubmit} isFilterDirty={isFilterDirty} />
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
          className="standart-btn flex-shrink-0"
          size={"lg"}
          disabled={!isFilterDirty}
          radius="none"
        >
          Сбросить фильтры
        </Button>



        {/* временно не используется, функционал рабочий */}
        {/* <Button
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
                </Button> */}
      </div>
    </div>
  )
}

export default DesktopFilters