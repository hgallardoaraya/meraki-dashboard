import { useEffect, useState } from "react";
import StatsCard from "./stats-card";
import { getSalesSummary } from "./fudo-service";
import { FudoSalesSummary } from "@/types/fudo";
import { numberToCLP } from "@/helpers/format";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import useFetchLocales from "../bills/use-fetch-locales";
import { getBillsSummary } from "./bill-stats-service";
import { BillsSummary } from "@/types/bills";

const getCurrentDate = () => {
  const currentDate = new Date();
  const dd = String(currentDate.getDate()).padStart(2, "0");
  const mm = String(currentDate.getMonth() + 1).padStart(2, "0");
  const yyyy = currentDate.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const DayStats = () => {
  const currentDate = getCurrentDate();
  const [salesSummary, setSalesSummary] = useState<FudoSalesSummary | undefined>();
  const [billsSummary, setBillsSummary] = useState<BillsSummary | undefined>();
  const [ selectedLocale, setSelectedLocale ] = useState<number>();
  const { locales } = useFetchLocales();

  const getDayStatsWrapper = async () => {
    try {
      const now = new Date();
      const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0)).toISOString();    
      const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999)).toISOString();
      
      const salesSummaryData = await getSalesSummary(startOfDay, endOfDay, selectedLocale || -1);      
      setSalesSummary(salesSummaryData);
      const billsSummaryData = await getBillsSummary(startOfDay, endOfDay, selectedLocale || -1);
      setBillsSummary(billsSummaryData);
    } catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getDayStatsWrapper();
  }, [])  

  useEffect(() => {
    if(selectedLocale) {
      getDayStatsWrapper();
    }
  }, [selectedLocale])  

  return (
    <div className="flex flex-col">       
      <div className="flex justify-between items-end mb-2">
        <h2 className="font-medium text-2xl text-gray-800">Resumen general del día - <span>{currentDate}</span></h2>
        <Select value={selectedLocale?.toString() || ''} onValueChange={(value) => setSelectedLocale(parseInt(value))}>
          <SelectTrigger className="w-fit">
            <SelectValue placeholder="Seleccionar local" />
          </SelectTrigger>
          <SelectContent>
          <SelectItem value="-1">TODOS</SelectItem>
            {locales.map(l => (
              <SelectItem key={"dayStatsLocale"+l.id} value={l.id.toString()}>{l.name}</SelectItem>
            ))}                        
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-wrap gap-6">
        <StatsCard title={`${numberToCLP(salesSummary?.totals.reduce((sum, item) => sum + parseFloat(item.amount), 0) || 0)} CLP`} subtitle={"Total de ingresos del día"} cardClassName="border-l-green-700 flex-1 basis-[200px]" />
        <StatsCard title={`${numberToCLP(billsSummary?.total_amount || 0)} CLP`} subtitle={"Total de gastos del día"} cardClassName="border-l-red-700 flex-1 basis-[200px] " />
        <StatsCard title={`${salesSummary?.salesCount || 0}`} subtitle={"Cantidad de ventas del día"} cardClassName="border-l-green-700 flex-1 basis-[200px] " />
        <StatsCard title={`${billsSummary?.total_bills || 0}`} subtitle={"Cantidad de gastos del día"} cardClassName="border-l-red-700 flex-1 basis-[200px] " />
      </div>
    </div>
  )
}

export default DayStats;