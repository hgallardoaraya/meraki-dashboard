import CategoriesMaintainer from "@/components/maintainers/categories-maintainer";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";

const CategoriesMaintainerPage = () => {
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
            <BreadcrumbLink className="text-gray-900 font-normal">Categorías</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* CONTENT */}
      <div className="flex flex-col px-4 py-2 w-full items-start justify-start gap-2 shadow-sm bg-white rounded-md border border-gray-100">
        <h2 className="font-medium text-2xl text-gray-800 mb-2">Categorías</h2>
        <CategoriesMaintainer/>
      </div>
    </div>
  );
};
  
export default CategoriesMaintainerPage;
  