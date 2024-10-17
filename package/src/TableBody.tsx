import React from "react";
import {
  cn,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableColumn,
  Link,
  Progress,
} from "@nextui-org/react";
import { flexRender } from "@tanstack/react-table";
import { Icon } from "@iconify/react";
import { useMedia } from "react-use";
import ButtonToTop from "./ButtonToTop";
import FavoriteIcon from "./FavoriteIcon";

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

  const isMobile = useMedia("(max-width: 768px)", true);


  const [progressValue, setProgressValue] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgressValue((v) => (v >= 100 ? 0 : v + 10));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full overflow-y-scroll">
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


        <TableHeader className="mb-10">
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
            <div>В избранное</div>
          </TableColumn>
        </TableHeader>

        <TableBody
          emptyContent={`${getQuery.isPending ? "Поиск данных..." : "Нет данных для отображения. Измените параметры поиска."}`}
          isLoading={getQuery.isPending}
          loadingContent={<Progress
            size="md"
            isIndeterminate
            showValueLabel={true}
            value={progressValue}
            aria-label="Загрузка..."
            label="Загрузка..."
            className="max-w ml-10 z-10"
          />}
          items={table.getRowModel().rows}
          className="relative"
        >
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => {
                return (
                  <TableCell key={cell.id} className="color:red">
                    {cell.column.columnDef.header === 'Ссылка' && cell.getValue() ? (
                      <Link href={cell.getValue()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                        {!isMobile && <Icon icon="solar:link-bold" className={iconClasses} />}

                        {isMobile ? "Ссылка" : "Сведения о деле"}
                      </Link>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </TableCell>
                )
              })}

              {/* лайк, кнопка "в избранное" */}
              <TableCell id="actions-cell">
                <FavoriteIcon favId={row.id} favData={row.original} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* кнопка "наверх" */}
      <ButtonToTop />

    </div>
  );
}
