import { DataTable } from "../ui/data-table";
import { ColumnDef } from "@tanstack/react-table"
import { strNumberToCLP } from "@/helpers/format";
import { ArrowUpDown } from "lucide-react"
import { Button } from "../ui/button";
import { Sale } from "@/types/sales";
import useFetchSales from "./use-fetch-sales";

const columns: ColumnDef<Sale>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
        variant="ghost"
        className="flex justify-start !p-0 w-full"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {    
    accessorKey: "total",
    header: ({ column }) => {
      return (        
          <Button
            className="!p-0 flex justify-end w-full"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>        
      )
    },
    cell: ({ row }) => {
      return <div className="text-right font-medium">{strNumberToCLP(row.getValue("total"))}</div>;
    },   
  },
  {
    accessorFn: (s:Sale) => `${s.close_at.toLocaleDateString("en-GB")}`,        
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="flex justify-start !p-0 w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    id: "close_at",
    accessorKey: "close_at",
  },
]


const SaleListTable = () => {
  const { sales } = useFetchSales();

  return (
    <div className="w-full">      
      <DataTable columns={columns} data={sales} />
    </div>
  );
};

export default SaleListTable;
  