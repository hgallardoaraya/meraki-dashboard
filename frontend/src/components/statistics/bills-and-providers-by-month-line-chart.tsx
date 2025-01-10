import { useState, useEffect } from "react"
import { LineChart } from "@/components/common/line-chart"
import { numberToCLP } from "@/helpers/format"
import { BillsAndProvidersByMonthLineChartData } from "@/types/general"

type BillsAndProvidersLineChartProps = {
  data: BillsAndProvidersByMonthLineChartData[]
}

export const BillsAndProvidersByMonthLineChart: React.FC<BillsAndProvidersLineChartProps> = ({ data }) => {
  // Definir estados para los datos formateados y las categorías
  const [uniqueKeys, setUniqueKeys] = useState<string[]>([]);
  const [formattedData, setFormattedData] = useState<object[]>([])

  useEffect(() => {
    // Formatear los datos, adaptándolos a las categorías
    if (data.length > 0) {
      const uk = [
        ...new Set(data.flatMap(obj => Object.keys(obj)))
      ];
      setUniqueKeys(uk)
  
      const newFormattedData = data.map((item) => ({
        period: `${item.year}-${item.month}`,
        ...item
      }))
      setFormattedData(newFormattedData)
    }
    
  }, [data])  

  return (
    <LineChart
      className="h-80"
      data={formattedData} 
      index="period"
      categories={uniqueKeys.filter(key => key !== "year" && key !== "month")}  // Usamos las categorías formateadas      
      valueFormatter={(number: number) => `${numberToCLP(number)} CLP`}
      onValueChange={(v) => console.log(v)}
      xAxisLabel="Meses"
      yAxisLabel="CLP"
    />
  )
}
