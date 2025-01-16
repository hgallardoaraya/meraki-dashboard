import { useState, useEffect } from "react"
import { LineChart } from "@/components/common/line-chart"
import { numberToCLP } from "@/helpers/format"
import { BillsAndSalesByDayLineChartData } from "@/types/general"

type BillsAndSalesLineChartProps = {
  data: BillsAndSalesByDayLineChartData[]
}

export const BillsAndSalesByDayLineChart: React.FC<BillsAndSalesLineChartProps> = ({ data }) => {
  // Definir estados para los datos formateados y las categorías
  const [formattedData, setFormattedData] = useState<object[]>([])
  const [formattedCategories, setFormattedCategories] = useState<string[]>(["Total Venta", "Total Gasto"])

  useEffect(() => {
    // Formatear las categorías
    setFormattedCategories(["Total Venta", "Total Gasto"])

    // Formatear los datos, adaptándolos a las categorías
    if (data.length > 0) {
      const newFormattedData = data.map((item) => ({
        day: item.day,
        "Total Venta": item.sale_amount,  // No cambias los nombres de las claves, solo estructuras los datos
        "Total Gasto": item.bill_amount,
      }))

      setFormattedData(newFormattedData)
    }
  }, [data])  // El efecto se ejecuta cada vez que `data` cambia

  return (
    <LineChart
      className="h-80"
      data={formattedData}  // Usamos `formattedData` en lugar de `data`
      index="day"
      categories={formattedCategories}  // Usamos las categorías formateadas
      valueFormatter={(number: number) => `${numberToCLP(number)} CLP`}      
      xAxisLabel="Días"
      yAxisLabel="CLP"
    />
  )
}
