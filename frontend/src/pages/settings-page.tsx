import BillListTable from "@/components/bills/bill-list-table";
import SaleListTable from "@/components/sales/sale-list-table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";
import logoFudo from "@/assets/fudo-logo.png" // ruta relativa al archivo
import { LinkFudoAccount } from "@/components/settings/link-fudo-account";


const SettingsPage = () => {
  return (
    <div className="flex flex-col gap-6">      
      {/* BREADCRUMB */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink className="font-semibold text-blue-700">Configuraciones</BreadcrumbLink>
          </BreadcrumbItem>          
        </BreadcrumbList>
      </Breadcrumb>

      {/* CONTENT */}
      <div className="flex flex-col px-4 py-2 w-full items-start justify-start gap-2 shadow-sm bg-white rounded-md border border-gray-100">
        <div className="flex gap-4">
          <img src={logoFudo} alt="Logo Meraki Bowl" width={"40px"} height={"40px"} />          
          <h2 className="font-medium text-2xl text-gray-800 mb-2">Vincular cuenta Fudo</h2>        
        </div>
        <p className="text-gray-500 font-semibold text-sm">Vincule su cuenta de Fudo para que el sistema pueda acceder a las estadísticas de ventas</p>
        <LinkFudoAccount></LinkFudoAccount>
      </div>
    </div>
  );
};
  
export default SettingsPage;
  