import CategoriesMaintainer from "@/components/maintainers/categories-maintainer";
import TypesMaintainer from "@/components/maintainers/types-maintainer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";

const TypesMaintainerPage = () => {
  return (
    <div className="flex flex-col gap-6">      
      {/* BREADCRUMB */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink className="font-semibold text-blue-700">Mantenedores</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink className="text-gray-900 font-normal">Tipos de gasto</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* CONTENT */}
      <div className="flex flex-col px-4 py-2 w-full items-start justify-start gap-2 shadow-sm bg-white rounded-md border border-gray-100">
        <h2 className="font-medium text-2xl text-gray-800 mb-2">Tipos de gasto</h2>
        <TypesMaintainer />
      </div>
    </div>
  );
};
  
export default TypesMaintainerPage;
  