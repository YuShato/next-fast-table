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
} from "@nextui-org/react";
import { USER_MESSAGES } from "./constants";
import TablePagination from "./TablePagination";
import DataTableModal from "./DataTableModal";

type DataWithID<T = Record<string, any>> = {
  id: number | string;
} & Partial<T>;

type DataOnlyId<T = number | string> = {
  id: T;
};

export type FetchParams = {
  pagination: PaginationState;
  columnFilters: ColumnFiltersState;
  sorting: SortingState;
};

export type DeleteParams<T> = DataOnlyId<T> | DataOnlyId<T>[];

export type UpdateParams<T = Record<string, any>> = DataWithID<T>;

export type CreateParams<T = Record<string, any>> = DataWithID<T>;

/**
 * Table configuration options.
 */
export interface TableConfig {
  /**
   * The name of the table, used to generate the key for tanstack-query. Defaults to 'next-table'.
   */
  name?: string;

  /**
   * The columns configuration for the table.
   */
  columns: any;

  /**
   * Function to fetch data for the table.
   * @param args - The fetch arguments including pagination, column filters, and sorting state.
   * @returns A promise that resolves with the total number of items and the list of data with ID.
   * @example
   * async function fetchData({ pagination, sorting, columnFilters }) {
   *   const data = await fetchDataFromAPI({
   *     pagination,
   *     sorting,
   *     columnFilters,
   *   });
   *   const total = await fetchTotalCount();
   *   return {
   *     list: data,
   *     total,
   *   };
   * }
   */
  onFetch: (
    args: FetchParams
  ) => Promise<{ total: number; list: DataWithID[] }>;

  /**
   * Function to delete data.
   * @param data - The data to be deleted, either a single ID or an array of IDs.
   * @returns A promise that resolves when the deletion is complete.
   * @example
   * async function deleteData(data) {
   *   await deleteDataFromAPI(data);
   * }
   */
  onDelete?: (data: any) => Promise<void>;

  /**
   * Function to create new data.
   * @param data - The data to be created.
   * @returns A promise that resolves when the creation is complete.
   * @example
   * async function createData(data) {
   *   const newData = await createDataInAPI(data);
   *   return newData;
   * }
   */
  onCreate?: (data: any) => Promise<void>;

  /**
   * Function to update existing data.
   * @param data - The data to be updated. Only the ID and fields to be updated will be sent.
   * @returns A promise that resolves when the update is complete.
   * @example
   * async function updateData(data) {
   *   const updatedData = await updateDataInAPI(data);
   *   return updatedData;
   * }
   */
  onUpdate?: (data: any) => Promise<void>;
}
export function DataTable({
  name = "next-table",
  columns,
  onFetch,
  onDelete,
  onCreate,
  onUpdate,
}: TableConfig) {
  const initalHiddenColumns = columns
    .filter((col) => col?.meta?.list?.hidden)
    .map((item) => item.accessorKey)
    .reduce((acc, cur) => ({ ...acc, [cur]: false }), {});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(initalHiddenColumns);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: 20,
    pageIndex: 0,
  });
  const [data, setData] = useState<DataWithID[]>([]);
  const [pageCount, setPageCount] = useState(1);
  const [total, setTotal] = useState(0);

  const table = useReactTable({
    pageCount,
    data,
    columns,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
      columnOrder,
      columnPinning,
    },
  });

  const isMobile = useMedia("(max-width: 768px)", true);

  const getQuery = useQuery({
    queryKey: [name, { sorting, columnFilters, pagination }],
    queryFn: () => onFetch({ pagination, columnFilters, sorting }),
  });

  const deleteMutation = useMutation({
    mutationFn: onDelete,
    onSuccess: (data, variables) => {
      toast.success("Row deleted successfully");
      getQuery.refetch();

      onClose();
    },
    onError: (err, variables) => {
      toast.error("Failed to delete rows", { description: err.message });
    },
  });

  const updateMutation = useMutation({
    mutationFn: onUpdate,
    onSuccess: () => {
      toast.success("Row updated successfully");
      getQuery.refetch();
      onClose();
    },
    onError: (e) => {
      toast.error("Failed to update row", { description: e.message });
    },
  });

  const createMutation = useMutation({
    mutationFn: onCreate,
    onSuccess: (data, variables) => {
      toast.success("Row created successfully");
      getQuery.refetch();
      onClose();
    },
    onError: (e) => {
      toast.error("Failed to create row", { description: e.message });
    },
  });

  useEffect(() => {
    if (getQuery.isSuccess) {
      setPageCount(Math.ceil(getQuery.data.total / pagination.pageSize) ?? 1);
      setData((getQuery.data?.list as any) ?? []);
      setTotal(getQuery.data?.total ?? 0);
    }
  }, [getQuery.isSuccess, getQuery.data, pagination.pageSize]);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure({
    onClose() {
      setMode(undefined);
      reset({});
    },
  });
  // const [targetRow, setTargetRow] = useState<any>({});
  const [mode, setMode] = useState<
    "create" | "edit" | "filter" | "view" | "delete" | undefined
  >(undefined);
  const {
    control,
    handleSubmit,
    formState: { dirtyFields, isDirty, defaultValues },
    register,
    reset,
    getValues,
    setValue,
    watch,
  } = useForm({});
  // it will slow down the input
  const [formData, setFormData] = useState<any>({});
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const formData = watch();
      setFormData(formData);
    }
  }, []);

  const onSubmit = (data: any) => {
    const dirtyData = Object.keys(dirtyFields).reduce((acc, cur) => {
      return { ...acc, [cur]: data[cur] };
    }, {});

    const dirtyDataWithPrimaryKey = {
      ...dirtyData,
      [primaryKey]: data[primaryKey],
    };

    console.log({ dirtyDataWithPrimaryKey, dirtyData, data, primaryKey });

    if (mode === "create") {
      createMutation.mutate(dirtyData as any);
    } else if (mode === "edit") {
      updateMutation.mutate(dirtyDataWithPrimaryKey as any);
    } else if (mode === "filter") {
      const arr = Object.entries(dirtyData)
        .filter(([key, value]) => value !== undefined && value !== "")
        .map(([key, value]) => ({ id: key, value }));

      setColumnFilters(arr);
      onClose();
    } else if (mode === "view") {
      navigator.clipboard.writeText(JSON.stringify(data));
      toast.success(USER_MESSAGES["copy"]);
      onClose();
    } else if (mode === "delete") {
      deleteMutation.mutate({ [primaryKey]: data[primaryKey] });
    } else {
      console.log("No mode selected");
      toast.error("No mode selected");
    }
  };

  const visibleColumnIds = table
    .getVisibleFlatColumns()
    .map((column) => column.id);
  const isFilterDirty =
    table
      .getState()
      .columnFilters.filter(
        (item) => item.id && item.value !== undefined && item.value !== ""
      ).length > 0;

  const onCreateButtonClick = () => {
    setMode("create");
    reset({});
    onOpen();
  };

  const onResetButtonClick = () => {
    table.resetColumnFilters();
    onClose();
  };

  const onDeleteButtonClick = () => {
    const rows = table.getSelectedRowModel().rows;
    const items = rows.map((row) => ({
      id: row.original.id,
    }));
    table.resetRowSelection();
    deleteMutation.mutate(items as any);
  };

  const isCreateOrEditMode = mode === "create" || mode === "edit";

  const primaryKey = "id";

  const inputDefaultValue = (key: string): any | undefined => {
    if (mode === "edit" || mode === "view") {
      // return targetRow[key];
      return getValues(key);
    } else if (mode === "create") {
      return undefined;
    } else if (mode === "filter") {
      const filter = table
        .getState()
        .columnFilters.find((item) => item.id === key);
      if (filter !== undefined) {
        return filter.value;
      }
    }
    return undefined;
  };

  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  const memoizedTable = useMemo(
    () => (
      <MyTableBody
        table={table}
        getQuery={getQuery}
        onOpen={onOpen}
        reset={reset}
        setMode={setMode}
        hideEdit={onUpdate === undefined}
        hideDelete={onDelete === undefined}
      />
    ),
    [table, isMobile, getQuery]
  );

  return (
    <div id="container" className="space-y-2 p-2 flex flex-col h-full gap-2">
      {/* модалка с поиском даннх или просмотром детали записи */}
      <DataTableModal {...{ isOpen, onOpenChange, onSubmit, columns, mode, onClose, register, handleSubmit, getValues, watch, control, isCreateOrEditMode, inputDefaultValue, updateMutation, createMutation, deleteMutation, onResetButtonClick, isDirty }} />

      <header
        id="controls"
        className="flex gap-2 flex-wrap flex-shrink-0 w-full  "
      >
        <Button
          color="primary"
          variant="solid"
          className=" flex-shrink-0"
          size={isMobile ? "lg" : undefined}
          isIconOnly={isMobile}
          isDisabled={getQuery.isRefetching}
          onClick={() => getQuery.refetch()}
          startContent={<Icon icon="material-symbols:refresh-rounded" />}
        >
          {isMobile ? undefined : "Обновить"}
        </Button>

        {/* закомментировала, временно не используется, но функционал рабочий */}
        {/* <ColumnsDropdownBtn isMobile={isMobile} table={table} visibleColumnIds={visibleColumnIds} /> */}

        <Button
          onClick={() => {
            setMode("filter");
            // setTargetRow({});
            reset({});
            onOpen();
          }}
          size={isMobile ? "lg" : undefined}
          isIconOnly={isMobile}
          className=" flex-shrink-0 mr-auto"
          color="primary"
          variant={isFilterDirty ? "ghost" : "solid"}
          startContent={<Icon icon="material-symbols:filter-alt" />}
        >
          {isMobile ? undefined : "Поиск данных"}
        </Button>

        {/* закомментировала, временно не используется, но функционал рабочий */}
        {/* <ActionHeaderButtons onDelete={onDelete} onCreate={onCreate} isMobile={isMobile} onDeleteButtonClick={onDeleteButtonClick} onCreateButtonClick={onCreateButtonClick} table={table} deleteMutation={deleteMutation} /> */}

      </header>

      <div
        id="pagination"
        className=" flex justify-between w-full items-center mt-2"
      >
        <TablePagination isMobile={isMobile} table={table} total={total} />
      </div>

      {/* test start */}

      {/* test end */}

      <main id="table" className=" overflow-scroll scrollbar-hide j ">
        {memoizedTable}
      </main>

      <footer
        id="pagination"
        className=" flex justify-between w-full items-center"
      >
        <TablePagination isMobile={isMobile} table={table} total={total} />
      </footer>
    </div>
  );
}
