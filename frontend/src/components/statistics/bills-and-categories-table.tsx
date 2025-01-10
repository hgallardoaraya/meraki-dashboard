import { DataTable } from "../ui/data-table";
import { ColumnDef } from "@tanstack/react-table"
import { strNumberToCLP } from "@/helpers/format";
import { ArrowUpDown } from "lucide-react"
import { Button } from "../ui/button";
import { BillsAndCategoriesTableData } from "@/types/general";

const columns: ColumnDef<BillsAndCategoriesTableData>[] = [
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
          Categoría
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

type BillsAndCategoriesTableProps = {
  data: BillsAndCategoriesTableData[]
}

const BillsAndCategoriesTable: React.FC<BillsAndCategoriesTableProps> = ({data}) => {
  return (
    <div className="w-full">      
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default BillsAndCategoriesTable;
  