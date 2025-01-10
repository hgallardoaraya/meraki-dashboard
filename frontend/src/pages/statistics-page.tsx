import BillsAndCategories from "@/components/statistics/bills-and-categories";
import BillsAndProviders from "@/components/statistics/bills-and-providers";
import BillsAndSales from "@/components/statistics/bills-and-sales";
import DayStats from "@/components/statistics/day-stats";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";

const StatisticsPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink className="font-semibold text-blue-700">Estadísticas</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <Slash />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink className="text-gray-900 font-normal">Listar</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-6">
        <DayStats/>
        <BillsAndSales/>        
        <BillsAndProviders/>        
        <BillsAndCategories/>
      </div>
    </div>
  );
};
  
export default StatisticsPage;
  