export function strNumberToCLP(value: string) {
  const amount = parseFloat(value);
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(amount);
}