import { useEffect, useState } from "react";
import StatsCard from "./stats-card";
import { numberToCLP } from "@/helpers/format";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import useFetchLocales from "../bills/use-fetch-locales";
import SelectStatsDates from "./select-stats-dates";
import { BillsAndSalesByDayLineChartData, BillsAndSalesByMonthLineChartData, PeriodsRange } from "@/types/general";
import { getDailyBillsSummaryByMonthAndYear, getBillsSummary, getDailyBillsSummaryByMonthAndYearRange, getSalesSummary, getDailySalesSummaryByMonthAndYear, getDailySalesSummaryByMonthAndYearRange } from "./bill-stats-service";
import { BillsSummary } from "@/types/bills";
import { BillsAndSalesByDayLineChart } from "./bills-and-sales-by-day-line-chart";
import { BillsAndSalesByMonthLineChart } from "./bills-and-sales-by-month-line-chart";
import { SalesSummary } from "@/types/sales";
import { getDaysInPeriod, getMonthsInPeriodRange } from "@/helpers/lists";

const BillsAndSales = () => {
  const [salesSummary, setSalesSummary] = useState<SalesSummary | undefined>();
  const [billsSummary, setBillsSummary] = useState<BillsSummary | undefined>();  
  const [selectedPeriods, setSelectedPeriods] = useState<PeriodsRange | undefined>();  
  const [ selectedLocale, setSelectedLocale ] = useState<number>();
  const { locales } = useFetchLocales();
  const [billsAndSalesDataByDay, setBillsAndSalesDataByDay] = useState<BillsAndSalesByDayLineChartData[]>([]);
  const [billsAndSalesDataByMonth, setBillsAndSalesDataByMonth] = useState<BillsAndSalesByMonthLineChartData[]>([]);

  const getPeriodRangeSalesSummary = async (startMonth: number, startYear: number, endMonth: number, endYear: number, localeId: number) => {
    try {
      const startDate = new Date(startYear, startMonth - 1, 1).toISOString();
      const endDate = new Date(endYear, endMonth, 0).toISOString();
      const resp = await getSalesSummary(startDate, endDate, localeId);
      setSalesSummary(resp);
    } catch(error) {
      console.log(error);
    }
  }

  const getPeriodRangeBillsSummary = async (startMonth: number, startYear: number, endMonth: number, endYear: number, localeId: number) => {
    try{
      const startDate = new Date(startYear, startMonth - 1, 1).toISOString();
      const endDate = new Date(endYear, endMonth, 0).toISOString();
      const resp = await getBillsSummary(startDate, endDate, localeId);
      setBillsSummary(resp);
    } catch (error) {
      console.log(error);
    }
  }

  const getMonthSalesSummary = async (month: number, year: number, localeId: number) => {
    try {
      const firstDay = new Date(year, month - 1, 1).toISOString();
      const lastDay = new Date(year, month, 0).toISOString();
      const resp = await getSalesSummary(firstDay, lastDay, localeId);
      setSalesSummary(resp);
    } catch(error) {
      console.log(error);
    }
  }

  const getMonthBillsSummary = async (month: number, year: number, localeId: number) => {
    try{
      const firstDay = new Date(year, month - 1, 1).toISOString();
      const lastDay = new Date(year, month, 0).toISOString();
      const resp = await getBillsSummary(firstDay, lastDay, localeId)
      setBillsSummary(resp);
    } catch (error) {
      console.log(error);
    }
  }

  const getDailySummaryByMonthAndYear = async (month: number, year: number, localeId: number) => {
    try{
      const monthBillsSummary = await getDailyBillsSummaryByMonthAndYear(year, month, localeId);
      const monthSalesSummary = await getDailySalesSummaryByMonthAndYear(year, month, localeId);
      setBillsAndSalesDataByDay(getDaysInPeriod(month, year).map(day => {
        let billData =  monthBillsSummary.find(m => m.day === day);
        let saleData =  monthSalesSummary.find(m => m.day === day);
        return {
          day,
          sale_amount: saleData?.total_amount || 0,
          bill_amount: billData?.total_amount || 0,
        }
      }))      
    } catch(error) {
      console.log(error);
    }
  }

  const getMonthlySummaryByMonthAndYearRange = async (startMonth: number, startYear: number, endMonth: number, endYear: number, localeId: number) => {
    try {
      if(!selectedPeriods) throw new Error("no se han seleccionado periodos");

      const monthBillsSummary = await getDailyBillsSummaryByMonthAndYearRange(startMonth, startYear, endMonth, endYear, localeId);
      const monthSalesSummary = await getDailySalesSummaryByMonthAndYearRange(startMonth, startYear, endMonth, endYear, localeId);
    
      setBillsAndSalesDataByMonth(getMonthsInPeriodRange(startMonth, startYear, endMonth, endYear).map(o => {
        let billData =  monthBillsSummary.find(m => m.month === o.month && m.year === o.year);
        let saleData =  monthSalesSummary.find(m => m.month === o.month && m.year === o.year);
        return {
          month: o.month, 
          year: o.year,
          sale_amount: saleData?.total_amount || 0,
          bill_amount: billData?.total_amount || 0,
        }
      }))

    } catch(error) {
      console.log(error);
    }
  }

  const handleStatsDatesChange = (periodsRange: PeriodsRange) => {
    setSelectedPeriods(periodsRange);
  }

  const getMonthSummary = async (month: number, year: number, localeId: number) => {
    if (selectedPeriods !== undefined) {
      await getMonthSalesSummary(month, year, localeId);
      await getMonthBillsSummary(month, year, localeId);
    }
  }

  const getMonthRangeSummary = async (startMonth: number, startYear: number, endMonth: number, endYear: number, localeId: number) => {
    if (selectedPeriods !== undefined) {
      await getPeriodRangeSalesSummary(startMonth, startYear, endMonth, endYear, localeId);
      await getPeriodRangeBillsSummary(startMonth, startYear, endMonth, endYear, localeId);
    }
  }

  const getDailySummaryByMonthAndYearWrapper = async (month: number, year: number, localeId: number) => {
    await getDailySummaryByMonthAndYear(month, year, localeId);
  }

  const getMonthlySummaryByMonthAndYearRangeWrapper = async (startMonth: number, startYear: number, endMonth: number, endYear: number, localeId: number) => {
    await getMonthlySummaryByMonthAndYearRange(startMonth, startYear, endMonth, endYear, localeId);
  }

  useEffect(() => {
    if(selectedPeriods !== undefined) {
      getDailySummaryByMonthAndYearWrapper(selectedPeriods?.startPeriod.month, selectedPeriods?.startPeriod.year, selectedLocale || -1);
    }
  }, []);

  useEffect(() => {        
    if(selectedPeriods !== undefined) {
      if(selectedPeriods.endPeriod.month == -1 || selectedPeriods.endPeriod.year == -1) {
        getMonthSummary(selectedPeriods?.startPeriod.month, selectedPeriods?.startPeriod.year, selectedLocale || -1);    
        getDailySummaryByMonthAndYearWrapper(selectedPeriods?.startPeriod.month, selectedPeriods?.startPeriod.year, selectedLocale || -1);
      } else {
        getMonthRangeSummary(selectedPeriods?.startPeriod.month, selectedPeriods?.startPeriod.year, selectedPeriods?.endPeriod.month, selectedPeriods?.endPeriod.year, selectedLocale || -1);    
        getMonthlySummaryByMonthAndYearRangeWrapper(selectedPeriods?.startPeriod.month, selectedPeriods?.startPeriod.year, selectedPeriods?.endPeriod.month, selectedPeriods?.endPeriod.year, selectedLocale || -1)
      }
    }
  }, [selectedPeriods, selectedLocale]);   

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-end mb-2">
        <h2 className="font-medium text-2xl text-gray-800">Resumen general - Ingresos v/s Gastos</h2>
        <div className="flex items-end gap-6">
          <SelectStatsDates keyPrefix="billsAndSales" handleChange={handleStatsDatesChange}/>
          <Select value={selectedLocale?.toString() || ''} onValueChange={(value) => setSelectedLocale(parseInt(value))}>
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Seleccionar local" />
            </SelectTrigger>
            <SelectContent>
            <SelectItem value="-1">TODOS</SelectItem>
              {locales.map(l => (
                <SelectItem key={"billsAndSales"+l.id} value={l.id.toString()}>{l.name}</SelectItem>
              ))}                        
            </SelectContent>
          </Select>
        </div>
      </div>      
      {
        selectedPeriods && (selectedPeriods.endPeriod.month == -1 || selectedPeriods.endPeriod.year == -1) ? 
        (
          <div className="flex flex-col gap-4">      
            <div className="flex flex-wrap gap-6">
              <StatsCard title={`${numberToCLP(salesSummary?.total_amount || 0)} CLP`} subtitle={"Total de ingresos del mes"} cardClassName="border-l-green-700 flex-1 basis-[200px] " />
              <StatsCard title={`${numberToCLP(billsSummary?.total_amount || 0)} CLP`} subtitle={"Total de gastos del mes"} cardClassName="border-l-red-700 flex-1 basis-[200px] " />
            </div>
            <div className="bg-white w-full rounded-md border border-gray-100 p-2 h-fit shadow-sm">
              <BillsAndSalesByDayLineChart data={billsAndSalesDataByDay}/>
            </div>
          </div>
        )
        :
        (
          <div className="flex flex-col gap-4">      
            <div className="flex flex-wrap gap-6">
              <StatsCard title={`${numberToCLP(salesSummary?.total_amount || 0)} CLP`} subtitle={"Total de ingresos del mes"} cardClassName="border-l-green-700 flex-1 basis-[200px] " />
              <StatsCard title={`${numberToCLP(billsSummary?.total_amount || 0)} CLP`} subtitle={"Total de gastos del mes"} cardClassName="border-l-red-700 flex-1 basis-[200px] " />
            </div>
            <div className="bg-white w-full rounded-md border border-gray-100 p-2 h-fit shadow-sm">
              <BillsAndSalesByMonthLineChart data={billsAndSalesDataByMonth}/>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default BillsAndSales;