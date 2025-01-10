import { DataTable } from "../ui/data-table";
import { ColumnDef } from "@tanstack/react-table"
import { strNumberToCLP } from "@/helpers/format";
import { ArrowUpDown } from "lucide-react"
import { Button } from "../ui/button";
import { BillsAndProvidersTableData } from "@/types/general";

const columns: ColumnDef<BillsAndProvidersTableData>[] = [
  {
    id: "index",
    header: "N°",
    cell: ({ row }) => {
      return <div className="text-left">{row.index + 1}</div>;
    },
  },
  {
    id: "name",
    accessorKey: "name",
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
    accessorKey: "total_amount",
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
      return <div className="text-right font-medium">{strNumberToCLP(row.getValue("total_amount"))}</div>;
    },   
  },
 
]




type BillsAndProvidersTableProps = {
  data: BillsAndProvidersTableData[]
}

const BillsAndProvidersTable: React.FC<BillsAndProvidersTableProps> = ({data}) => {


  return (
    <div className="w-full">      
      <DataTable columns={columns} data={data}/>
    </div>
  );
};

export default BillsAndProvidersTable;
  