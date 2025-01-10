import { LineChart } from "@/components/common/line-chart"
import { numberToCLP } from "@/helpers/format"
import { BillsAndCategoriesByDayLineChartData } from "@/types/general"
import { useEffect, useState } from "react"

type BillsAndCategoriesLineChartProps = {
  data: BillsAndCategoriesByDayLineChartData[]
}

export const BillsAndCategoriesByDayLineChart: React.FC<BillsAndCategoriesLineChartProps> = ({ data }) => { 
  const [uniqueKeys, setUniqueKeys] = useState<string[]>([]);

  useEffect(() => {
    console.log(data);    
    const uk = [
      ...new Set(data.flatMap(obj => Object.keys(obj)))
    ];
    setUniqueKeys(uk)
  }, [data])

  return (
    <LineChart
      className="h-80"
      data={data}  // Usamos `formattedData` en lugar de `data`
      index="day"
      categories={uniqueKeys.filter(key => key !== "day")}  // Usamos las categorías formateadas
      valueFormatter={(number: number) => `${numberToCLP(number)} CLP`}
      onValueChange={(v) => console.log(v)}
      xAxisLabel="Días"
      yAxisLabel="CLP"
    />
  )
}
