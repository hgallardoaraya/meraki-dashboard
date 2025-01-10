type Month = {
  id: number,
  name: string,
}

type Period = {
  year: number,
  month: number,
}

type PeriodsRange = {
  startPeriod: Period,
  endPeriod: Period,
}

type BillDaySummary = {
  day: number,
  total_amount: number,
}

type SaleDaySummary = {
  day: number,
  total_amount: number,
}


type BillMonthSummary = {
  month: number,
  year: number,
  total_amount: number,
}

type SaleMonthSummary = {
  month: number,
  year: number,
  total_amount: number,
}

type BillAndProvider = {
  provider_id: number,
  provider_name: string,
  total_amount: number
}

type BillAndCategory = {
  category_id: number,
  category_name: string,
  total_amount: number
}

type BillAndProviderDaySummary = {
  day: number,
  providers: BillAndProvider[]
}


type BillAndCategoryDaySummary = {
  day: number,
  categories: BillAndCategory[]
}

type BillAndProviderPeriodSummary = {
  month: number,
  year: number,
  providers: BillAndProvider[]
}

type BillAndCategoryPeriodSummary = {
  month: number,
  year: number,
  categories: BillAndCategory[]
}


type BillsAndSalesByDayLineChartData = {
  day: number,
  sale_amount: number
  bill_amount: number
}

type BillsAndProvidersByDayLineChartData = {
  day: number,
  [providerName: string]: number,  
}

type BillsAndCategoriesByDayLineChartData = {
  day: number,
  [categoryName: string]: number,  
}


type BillsAndSalesByMonthLineChartData = {
  month: number,
  year: number,
  sale_amount: number
  bill_amount: number
}

type BillsAndProvidersByMonthLineChartData = {
  month: number,
  year: number,  
  [providerName: string]: number,  
}

type BillsAndCategoriesByMonthLineChartData = {
  month: number,
  year: number,  
  [categoryName: string]: number,  
}

type BillsAndProvidersTableData = {
  id?: number,
  name: string,
  total_amount: number
}

type BillsAndCategoriesTableData = {
  id?: number,
  name: string,
  total_amount: number
}

export type {
  Month, 
  Period, 
  PeriodsRange, 
  BillsAndSalesByDayLineChartData, 
  BillDaySummary, 
  BillsAndSalesByMonthLineChartData, 
  BillMonthSummary,
  SaleMonthSummary, 
  SaleDaySummary,
  BillAndProviderDaySummary,
  BillAndProviderPeriodSummary,
  BillsAndProvidersByDayLineChartData,
  BillsAndProvidersByMonthLineChartData,
  BillsAndProvidersTableData,
  BillsAndCategoriesByDayLineChartData,
  BillsAndCategoriesByMonthLineChartData,
  BillsAndCategoriesTableData,
  BillAndCategoryDaySummary,
  BillAndCategoryPeriodSummary
}