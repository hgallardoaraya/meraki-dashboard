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
  documents: FileList | undefined,
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


export type NewBill = Omit<Bill, "id" | "creation_date" | "contable_date"> & {
  creation_date: string;
  contable_date: string;
};

export type Locale = {
  id: number;
  name: string;
  address?: string; 
}
export type NewLocale = Omit<Locale, "id">

export type Provider = {
  id: number;
  name: string;
  description: string;
}
export type NewProvider = Omit<Provider, "id">


export type Category = {
  id: number;
  name: string;
}
export type NewCategory = Omit<Category, "id">

export type Type = {
  id: number;
  name: string;
}
export type NewType = Omit<Category, "id">

export interface ErrorState {
  globalError: string | null;
  createError: string | null;
}

export type BillsSummary = {
  total_bills: number, 
  total_amount: number, 
}
