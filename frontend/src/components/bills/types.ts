export type Bill = {
  id: number,
  provider_id: number,
  locale_id: number,
  dte_id: number,
  user_id: number,
  category_id: number,
  type_id: number,
  total_iva: number,
  total_amount: number,
  total_neto: number,
  notes: string,
  image: string,
  creation_date: Date,
  contable_date: Date
}

export type BillWithDetails = {
  id: number;
  provider_name: string;
  user_name: string;
  user_last_name: string;
  locale_name: string;
  category_name: string;
  type_name: string;
  creation_date: Date;
  contable_date: Date;
  total_neto: number;
  total_iva: number;
  total_amount: number;
  notes: string;
  image: string;
};

export type BillWithDetailsTextDates = Omit<BillWithDetails, 'creation_date' | 'contable_date'> & {
  creation_date: string;
  contable_date: string;
};


export type NewBill = Omit<Bill, "id">;

export interface ErrorState {
  globalError: string | null;
  createError: string | null;
}
