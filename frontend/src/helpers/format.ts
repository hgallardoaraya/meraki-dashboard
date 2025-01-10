export function strNumberToCLP(value: string) {
  const amount = parseFloat(value);
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(amount);
}

export function numberToCLP(value: number) {
  const formatCLP = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0
  });
  return formatCLP.format(value);
}

export function getISODate(day:number, month:number, year:number) {
  // Validar los parámetros
  if (month < 1 || month > 12) {
    throw new Error("El mes debe estar entre 1 y 12");
  }
  if (day < 1 || day > 31) {
    throw new Error("El día debe estar entre 1 y 31");
  }

  // Crear la fecha específica
  const selectedDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0)); // Día inicial
  return selectedDate.toISOString();
}

