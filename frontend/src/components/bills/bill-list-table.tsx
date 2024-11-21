import { format } from "date-fns";
import { DataTable } from "../ui/data-table";
import { Bill, BillWithDetails } from "./types";
import useBills from "./use-bills";
import { ColumnDef } from "@tanstack/react-table"
import es from "date-fns/locale/es";
import { strNumberToCLP } from "@/helpers/format";

const columns: ColumnDef<BillWithDetails>[] = [
  {
    accessorKey: "provider_name",
    header: "Proveedor",
  },
  {
    accessorFn: (b:BillWithDetails) => `${b.user_name} ${b.user_last_name}`,
    header: "Usuario",
  },
  {
    accessorKey: "locale_name",
    header: "Local",
  },
  {
    accessorKey: "category_name",
    header: "Categoría",
  },
  {
    accessorKey: "type_name",
    header: "Tipo",
  },
  {
    accessorFn: (b:BillWithDetails) => `${b.creation_date.toLocaleDateString("en-GB")}`,
    header: "Fecha creación",
  },
  {
    accessorFn: (b:BillWithDetails) => `${b.contable_date.toLocaleDateString("en-GB")}`,
    header: "Fecha contable",
  },
  {
    accessorKey: "total_neto",
    header: () => <div className="text-right">Neto</div>, // Alineación derecha en el encabezado
    cell: ({ row }) => {
      return <div className="text-right font-medium">{strNumberToCLP(row.getValue("total_neto"))}</div>;
    },
  },
  {
    accessorKey: "total_iva",
    header: () => <div className="text-right">IVA</div>, // Alineación derecha en el encabezado
    cell: ({ row }) => {
      return <div className="text-right font-medium">{strNumberToCLP(row.getValue("total_iva"))}</div>;
    },
  },
  {
    accessorKey: "total_amount",
    header: () => <div className="text-right">Total</div>, // Alineación derecha en el encabezado
    cell: ({ row }) => {
      return <div className="text-right font-medium">{strNumberToCLP(row.getValue("total_amount"))}</div>;
    },
  }
]


const BillListTable = () => {
  const { bills } = useBills();

  return (
    <div className="w-full">      
      <DataTable columns={columns} data={bills}/>
    </div>
  );
};

export default BillListTable;
  