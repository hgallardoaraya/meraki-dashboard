import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import useFetchLocales from "../bills/use-fetch-locales";
import SelectStatsDates from "./select-stats-dates";
import { BillAndCategoryDaySummary, BillAndCategoryPeriodSummary, BillsAndCategoriesByDayLineChartData, BillsAndCategoriesTableData, BillsAndProvidersByMonthLineChartData, PeriodsRange } from "@/types/general";
import { getDailyBillsAndCategoriesSummaryByMonthAndYear, getDailyBillsAndCategoriesSummaryByMonthAndYearRange } from "./bill-stats-service";
import { getDaysInPeriod, getMonthsInPeriodRange } from "@/helpers/lists";
import { BillsAndCategoriesByDayLineChart } from "./bills-and-categories-by-day-line-chart";
import BillsAndCategoriesTable from "./bills-and-categories-table";
import { BillsAndCategoriesByMonthLineChart } from "./bills-and-categories-by-month-line-chart";

const BillsAndCategories = () => {  
  
  const [selectedPeriods, setSelectedPeriods] = useState<PeriodsRange | undefined>();  
  const [ selectedLocale, setSelectedLocale ] = useState<number>(-1);
  const { locales } = useFetchLocales();
  const [billsAndCategoriesDataByDay, setBillsAndCategoriesDataByDay] = useState<BillsAndCategoriesByDayLineChartData[]>([]);
  const [billsAndCategoriesDataByMonth, setBillsAndCategoriesDataByMonth] = useState<BillsAndProvidersByMonthLineChartData[]>([]);
  const [billsAndCategoriesTableData, setBillsAndCategoriesTableData] = useState<BillsAndCategoriesTableData[]>([]);
  const [monthBillsAndCategoriesSummary, setMonthBillsAndCategoriesSummary] = useState<BillAndCategoryDaySummary[]>([]); 
  const [periodBillsAndCategoriesSummary, setPeriodBillsAndCategoriesSummary] = useState<BillAndCategoryPeriodSummary[]>([]); 

  const getDailySummaryByMonthAndYear = async (month: number, year: number, localeId: number) => {
    try {
      const response = await getDailyBillsAndCategoriesSummaryByMonthAndYear(year, month, localeId);

      // Obtener el resumen diario
      const billsAndCategoriesDataByDay = getDaysInPeriod(month, year).map(day => {
        const data = response.find(m => m.day === day);
        
        // Si hay datos para el día actual, transforma el objeto
        if (data) {
          const dayData: {day: number, [category_name: string]: number} = { day }; // Iniciar el objeto con el día
          data.categories.forEach(({ category_name, total_amount }) => {
            dayData[category_name] = total_amount; // Agregar cada proveedor con su amount
          });

          return dayData
        }
  
        return { day };
      });
  
      setBillsAndCategoriesDataByDay(billsAndCategoriesDataByDay);
      setMonthBillsAndCategoriesSummary(response);
    } catch (error) {
      console.error(error);
    }
  };

  const getMonthlySummaryByMonthAndYearRange = async (startMonth: number, startYear: number, endMonth: number, endYear: number, localeId: number) => {
    try {
      const response = await getDailyBillsAndCategoriesSummaryByMonthAndYearRange(startMonth, startYear, endMonth, endYear, localeId);

      // Obtener el resumen diario
      const billsAndCategoriesDataByMonth = getMonthsInPeriodRange(startMonth, startYear, endMonth, endYear).map(period => {
        const data = response.find(m => m.month === period.month && m.year === period.year);
  
        // Si hay datos para el día actual, transforma el objeto
        if (data) {
          const providerAmounts = data.categories.reduce((acc, provider) => {
            acc[provider.category_name] = provider.total_amount; 
            return acc;
          }, {} as Record<string, number>);
  
          return {
            year: period.year,
            month: period.month,
            ...providerAmounts, 
          };
        }
  
        return { year: period.year, month: period.month };
      });
  
      setBillsAndCategoriesDataByMonth(billsAndCategoriesDataByMonth);
      setPeriodBillsAndCategoriesSummary(response);
    } catch (error) {
      console.error(error);
    }
  }

  const handleStatsDatesChange = (periodsRange: PeriodsRange) => {
    setSelectedPeriods(periodsRange);
  }

  const getDailySummaryByMonthAndYearWrapper = async (month: number, year: number, localeId: number) => {
    await getDailySummaryByMonthAndYear(month, year, localeId);
  }

  const getMonthlySummaryByMonthAndYearRangeWrapper = async (startMonth: number, startYear: number, endMonth: number, endYear: number, localeId: number) => {
    await getMonthlySummaryByMonthAndYearRange(startMonth, startYear, endMonth, endYear, localeId);
  }
  
  useEffect(() => {
    const providerTotals = monthBillsAndCategoriesSummary.reduce((acc, { categories }) => {
      categories.forEach(({ category_name, total_amount }) => {
        if (!acc[category_name]) {
          acc[category_name] = 0; // Inicializar si no existe
        }
        acc[category_name] += total_amount; // Sumar los valores
      });
      return acc;
    }, {} as Record<string, number>);
    
    // Convertir el objeto acumulado en un arreglo de objetos
    const objs = Object.entries(providerTotals).map(([category_name, total_amount]) => ({
      name: category_name,
      total_amount,
    }))
    setBillsAndCategoriesTableData(objs);

  }, [monthBillsAndCategoriesSummary])

  useEffect(() => {
    const providerTotals = periodBillsAndCategoriesSummary.reduce((acc, { categories }) => {
      categories.forEach(({ category_name, total_amount }) => {
        if (!acc[category_name]) {
          acc[category_name] = 0; // Inicializar si no existe
        }
        acc[category_name] += total_amount; // Sumar los valores
      });
      return acc;
    }, {} as Record<string, number>);
    
    // Convertir el objeto acumulado en un arreglo de objetos
    const objs = Object.entries(providerTotals).map(([category_name, total_amount]) => ({
      name: category_name,
      total_amount,
    }))
    setBillsAndCategoriesTableData(objs);

  }, [periodBillsAndCategoriesSummary])

  useEffect(() => {        
    if(selectedPeriods !== undefined) {
      if(selectedPeriods.endPeriod.month == -1 || selectedPeriods.endPeriod.year == -1) {
        getDailySummaryByMonthAndYearWrapper(selectedPeriods?.startPeriod.month, selectedPeriods?.startPeriod.year, selectedLocale || -1);
      } else {
        getMonthlySummaryByMonthAndYearRangeWrapper(selectedPeriods?.startPeriod.month, selectedPeriods?.startPeriod.year, selectedPeriods?.endPeriod.month, selectedPeriods?.endPeriod.year, selectedLocale || -1)
      }
    }
  }, [selectedPeriods]); 

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-end mb-2">
        <h2 className="font-medium text-2xl text-gray-800">Resumen general - Gastos por categoria</h2>
        <div className="flex items-end gap-6">
          <SelectStatsDates keyPrefix="billsAndCategories" handleChange={handleStatsDatesChange}/>          
        </div>
      </div>      
      {
        selectedPeriods && (selectedPeriods.endPeriod.month == -1 || selectedPeriods.endPeriod.year == -1) ? 
        (        
          <div className="bg-white w-full rounded-md border border-gray-100 p-2 h-fit shadow-sm flex flex-row gap-6">
              {
                billsAndCategoriesDataByDay.length > 0 ? 
                <BillsAndCategoriesByDayLineChart data={billsAndCategoriesDataByDay}/>
                :
                <p>Loading</p>
              }                        
            <BillsAndCategoriesTable data={billsAndCategoriesTableData}/>
          </div>                    
        )
        :
        (        
          <div className="bg-white w-full rounded-md border border-gray-100 p-2 h-fit shadow-sm flex flex-row gap-6">
            <BillsAndCategoriesByMonthLineChart data={billsAndCategoriesDataByMonth}/>
            <BillsAndCategoriesTable data={billsAndCategoriesTableData}/>
          </div>             
        )
      }
    </div>
  )
}

export default BillsAndCategories;