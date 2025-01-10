import { DataTable } from "../ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { strNumberToCLP } from "@/helpers/format";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { FudoSale } from "@/types/sales";
import fetchSales from "./use-fetch-sales";

const columns: ColumnDef<FudoSale>[] = [
  {
    id: "index",
    header: "N°",
    cell: ({ row }) => {
      return <div className="text-left">{row.index + 1}</div>;
    },
  },
  {
    id: "locale_name",
    accessorKey: "locale_name",
    header: ({ column }) => (
      <Button
        className="!p-0 flex justify-start w-full"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Local
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-left">
        {row.getValue("locale_name")}
      </div>
    ),
  },

  {
    id: "total_amount",
    accessorKey: "total_amount",
    header: ({ column }) => (
      <Button
        className="!p-0 flex justify-end w-full"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Total
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {strNumberToCLP(row.getValue("total_amount"))}
      </div>
    ),
  },
  {
    accessorFn: (s: FudoSale) => `${s.date.toLocaleDateString("en-GB")}`,
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="flex justify-start !p-0 w-full"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Fecha
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    id: "date",
    accessorKey: "date",
  },
  {
    id: "sales_count",
    accessorKey: "sales_count",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="flex justify-start !p-0 w-full"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        N° de ventas
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
];

const SaleListTable = () => {
  const [sales, setSales] = useState<FudoSale[]>([]);  
  
  const fetchSalesWrapper = async (limit: number, offset: number) => {
    try {
      const data = await fetchSales(limit, offset);
      setSales(data);            
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={sales}
        fetchSales={fetchSalesWrapper}
        totalRecords={100}
        enableGlobalSearch={true}
      />
    </div>
  );
};

export default SaleListTable;

