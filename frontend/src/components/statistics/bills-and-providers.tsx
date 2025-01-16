import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import useFetchLocales from "../bills/use-fetch-locales";
import SelectStatsDates from "./select-stats-dates";
import { BillAndProviderDaySummary, BillAndProviderPeriodSummary, BillsAndProvidersByDayLineChartData, BillsAndProvidersByMonthLineChartData, BillsAndProvidersTableData, BillsAndSalesByDayLineChartData, BillsAndSalesByMonthLineChartData, PeriodsRange } from "@/types/general";
import { getDailyBillsSummaryByMonthAndYear, getBillsSummary, getDailyBillsSummaryByMonthAndYearRange, getSalesSummary, getDailySalesSummaryByMonthAndYear, getDailySalesSummaryByMonthAndYearRange, getDailyBillsAndProvidersSummaryByMonthAndYear, getDailyBillsAndProvidersSummaryByMonthAndYearRange } from "./bill-stats-service";
import { BillsSummary } from "@/types/bills";
import { getDaysInPeriod, getMonthsInPeriodRange } from "@/helpers/lists";
import { BillsAndProvidersByDayLineChart } from "./bills-and-providers-by-day-line-chart";
import { BillsAndProvidersByMonthLineChart } from "./bills-and-providers-by-month-line-chart";
import BillsAndProvidersTable from "./bills-and-providers-table";
import { useLocation } from "react-router-dom";

const BillsAndProviders = () => {  
  
  const [selectedPeriods, setSelectedPeriods] = useState<PeriodsRange | undefined>();  
  const [ selectedLocale, setSelectedLocale ] = useState<number>(-1);
  
  const [billsAndProvidersDataByDay, setBillsAndProvidersDataByDay] = useState<BillsAndProvidersByDayLineChartData[]>([]);
  const [billsAndProvidersDataByMonth, setBillsAndProvidersDataByMonth] = useState<BillsAndProvidersByMonthLineChartData[]>([]);
  const [billsAndProvidersTableData, setBillsAndProvidersTableData] = useState<BillsAndProvidersTableData[]>([]);
  const [monthBillsAndProvidersSummary, setMonthBillsAndProvidersSummary] = useState<BillAndProviderDaySummary[]>([]); 
  const [periodBillsAndProvidersSummary, setPeriodBillsAndProvidersSummary] = useState<BillAndProviderPeriodSummary[]>([]); 

  const getDailySummaryByMonthAndYear = async (month: number, year: number, localeId: number) => {
    try {
      const response = await getDailyBillsAndProvidersSummaryByMonthAndYear(year, month, localeId);
      // Obtener el resumen diario
      const billsAndProvidersDataByDay = getDaysInPeriod(month, year).map(day => {
        const data = response.find(m => m.day === day);
        
        // Si hay datos para el día actual, transforma el objeto
        if (data) {
          const dayData: {day: number, [provider_name: string]: number} = { day }; // Iniciar el objeto con el día
          data.providers.forEach(({ provider_name, total_amount }) => {
            dayData[provider_name] = total_amount; // Agregar cada proveedor con su amount
          });

          return dayData
        }
  
        return { day };
      });
  
      setBillsAndProvidersDataByDay(billsAndProvidersDataByDay);
      setMonthBillsAndProvidersSummary(response);
    } catch (error) {
      console.error(error);
    }
  };

  const getMonthlySummaryByMonthAndYearRange = async (startMonth: number, startYear: number, endMonth: number, endYear: number, localeId: number) => {
    try {
      const response = await getDailyBillsAndProvidersSummaryByMonthAndYearRange(startMonth, startYear, endMonth, endYear, localeId);
    
      // Obtener el resumen diario
      const billsAndProvidersDataByMonth = getMonthsInPeriodRange(startMonth, startYear, endMonth, endYear).map(period => {
        const data = response.find(m => m.month === period.month && m.year === period.year);
  
        // Si hay datos para el día actual, transforma el objeto
        if (data) {
          const providerAmounts = data.providers.reduce((acc, provider) => {
            acc[provider.provider_name] = provider.total_amount; 
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
  
      setBillsAndProvidersDataByMonth(billsAndProvidersDataByMonth);
      setPeriodBillsAndProvidersSummary(response);
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
    const providerTotals = monthBillsAndProvidersSummary.reduce((acc, { providers }) => {
      providers.forEach(({ provider_name, total_amount }) => {
        if (!acc[provider_name]) {
          acc[provider_name] = 0; // Inicializar si no existe
        }
        acc[provider_name] += total_amount; // Sumar los valores
      });
      return acc;
    }, {} as Record<string, number>);
    
    // Convertir el objeto acumulado en un arreglo de objetos
    const objs = Object.entries(providerTotals).map(([provider_name, total_amount]) => ({
      name: provider_name,
      total_amount,
    }))
    setBillsAndProvidersTableData(objs);

  }, [monthBillsAndProvidersSummary])

  useEffect(() => {
    const providerTotals = periodBillsAndProvidersSummary.reduce((acc, { providers }) => {
      providers.forEach(({ provider_name, total_amount }) => {
        if (!acc[provider_name]) {
          acc[provider_name] = 0; // Inicializar si no existe
        }
        acc[provider_name] += total_amount; // Sumar los valores
      });
      return acc;
    }, {} as Record<string, number>);
    
    // Convertir el objeto acumulado en un arreglo de objetos
    const objs = Object.entries(providerTotals).map(([provider_name, total_amount]) => ({
      name: provider_name,
      total_amount,
    }))
    setBillsAndProvidersTableData(objs);

  }, [periodBillsAndProvidersSummary])
  
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
        <h2 className="font-medium text-2xl text-gray-800">Resumen general - Gastos por proveedor</h2>
        <div className="flex items-end gap-6">
          <SelectStatsDates keyPrefix="billsAndProviders" handleChange={handleStatsDatesChange}/>
        </div>
      </div>      
      {
        selectedPeriods && (selectedPeriods.endPeriod.month == -1 || selectedPeriods.endPeriod.year == -1) ? 
        (        
          <div className="bg-white w-full rounded-md border border-gray-100 p-2 h-fit shadow-sm flex flex-row gap-6">
            {
              billsAndProvidersDataByDay.length > 0 ? 
              <BillsAndProvidersByDayLineChart data={billsAndProvidersDataByDay}/>
              :
              <p>Loading</p>
            }            
            <BillsAndProvidersTable data={billsAndProvidersTableData}/>
          </div>                    
        )
        :
        (        
          <div className="bg-white w-full rounded-md border border-gray-100 p-2 h-fit shadow-sm flex flex-row gap-6">
            <BillsAndProvidersByMonthLineChart data={billsAndProvidersDataByMonth}/>
            <BillsAndProvidersTable data={billsAndProvidersTableData}/>
          </div>             
        )
      }
    </div>
  )
}

export default BillsAndProviders;