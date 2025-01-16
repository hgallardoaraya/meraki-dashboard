import { BillsSummary } from "@/types/bills";
import { BillAndCategoryDaySummary, BillAndCategoryPeriodSummary, BillAndProviderDaySummary, BillAndProviderPeriodSummary, BillDaySummary, BillMonthSummary, SaleDaySummary, SaleMonthSummary } from "@/types/general";
import { SalesSummary } from "@/types/sales";
import axios from "axios";

const API_URL = "http://localhost:8080"

export const getBillsSummary = async (t1: string, t2: string, localeId: number): Promise<BillsSummary> => {
  try {
    const response = await axios.get(`${API_URL}/api/bills/summary?t1=${t1}&t2=${t2}${localeId !== -1 ? "&localeId=" + localeId : ''}`);
    return response.data.summary || [];
  } catch(error: any) {
    throw error;
  }
}

export const getSalesSummary = async (t1: string, t2: string, localeId: number): Promise<SalesSummary> => {
  try {
    const response = await axios.get(`${API_URL}/api/sales/summary?t1=${t1}&t2=${t2}${localeId !== -1 ? "&localeId=" + localeId : ''}`);
    return response.data.summary || [];
  } catch(error: any) {
    throw error;
  }
}

export const getDailyBillsSummaryByMonthAndYear = async (year: number, month: number, localeId: number): Promise<BillDaySummary[]> => {
  try {
    
    const response = await axios.get(`${API_URL}/api/bills/summary/month?year=${year}&month=${month}${localeId !== -1 ? "&localeId=" + localeId : ''}`);
    return response.data.summary || [];
  } catch(error: any) {
    throw error;
  }
}

export const getDailySalesSummaryByMonthAndYear = async (year: number, month: number, localeId: number): Promise<SaleDaySummary[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/sales/summary/month?year=${year}&month=${month}${localeId !== -1 ? "&localeId=" + localeId : ''}`);
    return response.data.summary || [];
  } catch(error: any) {
    throw error;
  }
}


export const getDailyBillsSummaryByMonthAndYearRange = async (startMonth: number, startYear: number, endMonth: number, endYear: number, localeId: number): Promise<BillMonthSummary[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/bills/summary/monthRange?startYear=${startYear}&startMonth=${startMonth}&endMonth=${endMonth}&endYear=${endYear}${localeId !== -1 ? "&localeId=" + localeId : ''}`);
    return response.data.summary || [];
  } catch(error: any) {
    throw error;
  }
}

export const getDailySalesSummaryByMonthAndYearRange = async (startMonth: number, startYear: number, endMonth: number, endYear: number, localeId: number): Promise<SaleMonthSummary[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/sales/summary/monthRange?startYear=${startYear}&startMonth=${startMonth}&endMonth=${endMonth}&endYear=${endYear}${localeId !== -1 ? "&localeId=" + localeId : ''}`);
    return response.data.summary || [];
  } catch(error: any) {
    throw error;
  }
}

export const getDailyBillsAndProvidersSummaryByMonthAndYear = async (year: number, month: number, localeId: number): Promise<BillAndProviderDaySummary[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/bills/summary/providers/month?year=${year}&month=${month}${localeId !== -1 ? "&localeId=" + localeId : ''}`);
    return response.data.summary || [];
  } catch(error: any) {
    throw error;
  }
}

export const getDailyBillsAndProvidersSummaryByMonthAndYearRange = async (startMonth: number, startYear: number, endMonth: number, endYear: number, localeId: number): Promise<BillAndProviderPeriodSummary[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/bills/summary/providers/monthRange?startYear=${startYear}&startMonth=${startMonth}&endMonth=${endMonth}&endYear=${endYear}${localeId !== -1 ? "&localeId=" + localeId : ''}`);
    return response.data.summary || [];
  } catch(error: any) {
    throw error;
  }
}

export const getDailyBillsAndCategoriesSummaryByMonthAndYear = async (year: number, month: number, localeId: number): Promise<BillAndCategoryDaySummary[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/bills/summary/categories/month?year=${year}&month=${month}${localeId !== -1 ? "&localeId=" + localeId : ''}`);
    return response.data.summary || [];
  } catch(error: any) {
    throw error;
  }
}

export const getDailyBillsAndCategoriesSummaryByMonthAndYearRange = async (startMonth: number, startYear: number, endMonth: number, endYear: number, localeId: number): Promise<BillAndCategoryPeriodSummary[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/bills/summary/categories/monthRange?startYear=${startYear}&startMonth=${startMonth}&endMonth=${endMonth}&endYear=${endYear}${localeId !== -1 ? "&localeId=" + localeId : ''}`);
    return response.data.summary || [];
  } catch(error: any) {
    throw error;
  }
}
