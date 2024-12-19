export type Sale = {
  id: number,
  total: number,
  close_at: Date
}

export type SaleWithTextDate = Omit<Sale, 'close_at'> & {
  close_at: string;
};