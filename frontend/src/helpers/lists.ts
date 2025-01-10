import { Month, Period } from "@/types/general";

const getMonths = (): Month[] => {
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return months.map((m, i) => ({
    id: i + 1,  // Número del mes (1-12)
    name: m       // Nombre del mes en español
  }));
};

const getYearsByStartYear = (startYear:number): number[] => {
  const currentYear = new Date().getFullYear(); // Obtiene el año actual  
  return Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i).reverse();

};

function getDaysInPeriod(month: number, year: number): number[] {
  // Obtén el número total de días en el mes
  const daysInMonth = new Date(year, month, 0).getDate();
  
  // Genera un arreglo con los números de los días
  return Array.from({ length: daysInMonth }, (_, i) => i + 1);
}

const getMonthsInPeriodRange = (startMonth: number, startYear: number, endMonth: number, endYear: number): Period[] => {
  const periods: Period[] = [];

  // Inicializamos las variables de iteración
  let currentYear = startYear;
  let currentMonth = startMonth;

  // Recorremos el rango hasta llegar al año y mes final
  while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
    periods.push({ year: currentYear, month: currentMonth });

    // Avanzamos al siguiente mes
    currentMonth++;
    if (currentMonth > 12) {
      currentMonth = 1; // Reseteamos a enero
      currentYear++;    // Avanzamos al siguiente año
    }
  }

  return periods;

}


export { getMonths, getYearsByStartYear, getDaysInPeriod,  getMonthsInPeriodRange}