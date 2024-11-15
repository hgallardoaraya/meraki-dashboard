import { BillsForm } from "@/components/bills/bills-form";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";

const BillsPage = () => {
  return (
    <div className="flex flex-col gap-4">      
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink className="font-semibold text-blue-700">Gastos</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink className="text-gray-900 font-normal">Ingresar</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-col px-4 py-2 w-fit items-start justify-start gap-2 shadow-sm bg-white rounded-md border border-gray-100">
        <h2 className="font-medium text-2xl text-gray-800 mb-2">Ingreso de gastos</h2>
        <BillsForm />
      </div>
    </div>
  );
};

export default BillsPage;
  