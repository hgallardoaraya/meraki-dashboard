export type Sale = {
  id: number,
  total: number,
  close_at: Date
}

export type FudoSale = {
  id: number,
  locale_id: number,
  locale_name: string,
  total_amount: number,
  date: Date,
  sales_count: number,
}

export type FudoSaleWithTextDates = Omit<FudoSale, 'date'> & {
  date: string;
}


export type SaleWithTextDate = Omit<Sale, 'close_at'> & {
  close_at: string;
};


export type SalesSummary = {
  total_sales: number, 
  total_amount: number, 
}