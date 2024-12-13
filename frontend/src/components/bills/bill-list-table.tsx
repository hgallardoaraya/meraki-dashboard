import { format } from "date-fns";
import { DataTable } from "../ui/data-table";
import { ColumnDef } from "@tanstack/react-table"
import es from "date-fns/locale/es";
import { strNumberToCLP } from "@/helpers/format";
import useFetchBills from "./use-fetch-bills";
import { BillWithDetails } from "@/types/bills";
import { ArrowUpDown } from "lucide-react"
import { Button } from "../ui/button";

const columns: ColumnDef<BillWithDetails>[] = [
  {
    accessorKey: "provider_name",
    header: ({ column }) => {
      return (
        <Button
        variant="ghost"
        className="flex justify-start !p-0 w-full"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
          Proveedor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },

  },
  {
    accessorFn: (b:BillWithDetails) => `${b.user_name} ${b.user_last_name}`,
    header: "Usuario",
  },
  {
    accessorKey: "locale_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="flex justify-start !p-0 w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Local
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "category_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="flex justify-start !p-0 w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Categoría
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "type_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="flex justify-start !p-0 w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tipo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorFn: (b:BillWithDetails) => `${b.creation_date.toLocaleDateString("en-GB")}`,        
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="flex justify-start !p-0 w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha creación
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    id: "creation_date"
  },
  {
    accessorFn: (b:BillWithDetails) => `${b.contable_date.toLocaleDateString("en-GB")}`,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="flex justify-start !p-0 w-full"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha contable
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    id: "contable_date"
  },
  {
    accessorKey: "total_neto",
    header: ({ column }) => {
      return (        
          <Button
            className="!p-0 flex justify-end w-full"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Neto
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>        
      )
    },
    cell: ({ row }) => {
      return <div className="text-right font-medium">{strNumberToCLP(row.getValue("total_neto"))}</div>;
    },
  },
  {
    accessorKey: "total_iva",
    header: ({ column }) => {
      return (        
          <Button
            className="!p-0 text-right flex justify-end w-full"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            IVA
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>        
      )
    },    cell: ({ row }) => {
      return <div className="text-right font-medium">{strNumberToCLP(row.getValue("total_iva"))}</div>;
    },
  },
  {
    accessorKey: "total_amount",
    header: ({ column }) => {
      return (        
          <Button
            className="!p-0 text-right flex justify-end w-full"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>        
      )
    },    cell: ({ row }) => {
      return <div className="text-right font-medium">{strNumberToCLP(row.getValue("total_amount"))}</div>;
    },
  }
]


const BillListTable = () => {
  const { bills } = useFetchBills();

  return (
    <div className="w-full">      
      <DataTable columns={columns} data={bills}/>
    </div>
  );
};

export default BillListTable;
  