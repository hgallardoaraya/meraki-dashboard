import { LineChart } from "@/components/common/line-chart"
import { numberToCLP } from "@/helpers/format"
import { BillsAndProvidersByDayLineChartData } from "@/types/general"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

type BillsAndProvidersLineChartProps = {
  data: BillsAndProvidersByDayLineChartData[]
}

export const BillsAndProvidersByDayLineChart: React.FC<BillsAndProvidersLineChartProps> = ({ data }) => { 
  const [uniqueKeys, setUniqueKeys] = useState<string[]>([]);  

  useEffect(() => {    
    const uk = [
      ...new Set(data.flatMap(obj => Object.keys(obj)))
    ];
    setUniqueKeys(uk);    
  }, [data]); // Incluye el cambio de ruta como dependencia


  return (
      <LineChart
        className="h-80"
        data={data}
        index="day"
        categories={uniqueKeys.filter(key => key !== "day")}
        valueFormatter={(number: number) => `${numberToCLP(number)} CLP`}
        xAxisLabel="Días"
        yAxisLabel="CLP"
      />
  )
}
