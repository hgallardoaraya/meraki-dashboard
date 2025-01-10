import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  getFilteredRowModel,
  getSortedRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "./button";
import { useEffect, useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  enableGlobalSearch?: Boolean;
  fetchSales?: Function;
  enableFetchSales?: Boolean;
  totalRecordsProp?: number;
  pageIndexFromParent?: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  enableGlobalSearch = false,
  fetchSales,
  enableFetchSales = false,
  totalRecordsProp = -1,
  pageIndexFromParent,
}: DataTableProps<TData, TValue>) {
  const [pageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(data.length)
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState(""); // Estado para el filtro global
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(pageIndexFromParent || 0); // Estado para la página actual
  const pagesPerBlock = 3;  // Número de páginas que se muestran por bloque
  const totalBlocks = Math.ceil((totalRecords || 0) / pageSize / pagesPerBlock);  // Número total de bloques
  const currentBlock = Math.floor(currentPageIndex / pagesPerBlock);  // Bloque actual

  useEffect(() => {
    if(totalRecordsProp !== -1) {
      setTotalRecords(totalRecordsProp);
    }
  }, [totalRecordsProp])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize, pageIndex: currentPageIndex } },
    state: { sorting, columnFilters, globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _, filterValue) => {
      return row.getVisibleCells().some((cell) => {
        const value = cell.getValue();
        return value?.toString().toLowerCase().includes(filterValue.toLowerCase());
      });
    },
  });

  useEffect(() => {    
    if (fetchSales) {
      fetchSales(pageSize, currentPageIndex * pageSize, currentPageIndex); // Mantener la página actual
    }
  }, [currentPageIndex]); 

  return (
    <div>
      {enableGlobalSearch && (
        <div className="flex items-center py-4">
          <Input
            placeholder="Buscar..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
        </div>
      )}
      <div className="rounded-md border border-solid border-gray-300">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-solid border-gray-300 bg-gray-100 hover:bg-gray-100"
              >
                {headerGroup.headers.map((header, headerIndex) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={`bg-transparent border-t ${headerIndex === 0 && "rounded-tl-md"} ${headerIndex === headerGroup.headers.length - 1 && "rounded-tr-md"}`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-b border-solid border-gray-300">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => setCurrentPageIndex((prev) => Math.max(prev - 1, 0))} disabled={currentPageIndex === 0}>
          Anterior
        </Button>
        {[...Array(totalBlocks)].map((_, blockIndex) => {
          if (blockIndex !== currentBlock) return null;
          return (
            <div key={blockIndex} style={{ display: 'flex', gap: '8px' }}>
              {[...Array(pagesPerBlock)].map((_, offset) => {
                const pageIndex = blockIndex * pagesPerBlock + offset;
                if (pageIndex >= Math.ceil((totalRecords || 0) / pageSize)) return null;
                return (
                  <Button
                    key={pageIndex}
                    variant={currentPageIndex === pageIndex ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPageIndex(pageIndex)}
                  >
                    {pageIndex + 1}
                  </Button>
                );
              })}
            </div>
          );
        })}
        <Button variant="outline" size="sm" onClick={() => setCurrentPageIndex((prev) => prev + 1)} disabled={currentPageIndex === Math.ceil((totalRecords || 0) / pageSize) - 1}>
          Siguiente
        </Button>
      </div>
    </div>
  );
}
