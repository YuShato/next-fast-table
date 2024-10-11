import React from "react";
import {
  cn,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableColumn,
  Spinner,
  Button,
} from "@nextui-org/react";
import { flexRender } from "@tanstack/react-table";
import { Icon } from "@iconify/react";

export function MyTableBody({
  table,
  getQuery,
  setMode,
  reset,
  onOpen,
  hideDelete,
  hideEdit,
}) {
  const iconClasses =
    "text-xl text-default-500 pointer-events-none flex-shrink-0";

  return (
    <Table
      color="primary"
      // эта строка убирает чекбоксы слева, по которым можно удалять/изменять конкретные строки
      // selectionMode="multiple"
      isStriped
      isHeaderSticky
      isVirtualized
      onSelectionChange={(value) => {
        if (value === "all") return table.toggleAllRowsSelected();
        table.setRowSelection(
          Array.from(value).reduce((acc, cur) => ({ ...acc, [+cur]: true }), {})
        );
      }}
      aria-label="data-table"
      selectedKeys={table.getSelectedRowModel().rows.map((row) => row.id)}
      sortDescriptor={{
        column: table.getState().sorting[0]?.id,
        direction: table.getState().sorting[0]?.desc
          ? "descending"
          : "ascending",
      }}
      onSortChange={({ column, direction }) => {
        table.getColumn(column as string)?.toggleSorting();
      }}
    >


      <TableHeader>
        {table.getHeaderGroups()[0].headers.map((header) => (
          <TableColumn
            key={header.id}
            allowsSorting={header.column.getCanSort()}
            allowsResizing={header.column.getCanResize()}
          >
            {header.isPlaceholder
              ? null
              : flexRender(header.column.columnDef.header, header.getContext())}
          </TableColumn>
        ))}
        <TableColumn key="actions">
          <div>Детали</div>
        </TableColumn>
      </TableHeader>
      <TableBody
        emptyContent={"Нет данных для отображения. Измените параметры поиска."}
        isLoading={getQuery.isPending}
        loadingContent={<Spinner />}
        items={table.getRowModel().rows}
      >
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
            <TableCell id="actions-cell">

              <Button variant="flat" color="primary"
                onClick={() => {
                  setMode("view");
                  reset(row.original as any);
                  onOpen();
                }}>

                <Icon icon="solar:eye-bold" className={iconClasses} />
                Подробнее
              </Button>

            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
