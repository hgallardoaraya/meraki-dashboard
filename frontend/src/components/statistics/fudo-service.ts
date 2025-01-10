import { FudoSales, FudoSalesSummary } from "@/types/fudo";
import { FudoSale } from "@/types/sales";
import axios from "axios"

const FUDO_API_URL = "https://api.fu.do"
const token = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1aSI6MSwidWEiOnRydWUsInVyIjoxLCJ1bCI6ImFkbWluQG1lcmFraWJvd2wiLCJhaSI6Mzc3MTIsInNpYyI6MTM4MywiY2kiOiI3IiwiZXhwIjoxNzM2NTM5OTE0fQ.HPhJ6veUbD4fb40ecjzjtcezKy9-5HZA44hlV1MJhUE"

// t1 = inico
// t2 = fin
// w = local (2 es rafael riesco)
const getSalesSummary = async (startDate:string, endDate:string, localeId:number = -1): Promise<FudoSalesSummary> => {
  try {        
    const response = await axios.get(`${FUDO_API_URL}/sales_summary?dc=0&ss=3&t1=${startDate}&t2=${endDate}${localeId !== -1 && "&cr=" + localeId}`, {
      headers: {
        Accept: "application/json, text/plain, */*",
        Authorization: token
      }
    })
    return response.data;
  } catch (error: any) {
    throw error;
  }
}

const getSales = async (startDate:string, endDate:string, localeId:number = -1, pageNum:number): Promise<FudoSales> => {
  try {        
    const response = await axios.get(`${FUDO_API_URL}/sales?dc=0&page=${pageNum}&ss=3&t1=${startDate}&t2=${endDate}${localeId !== -1 && "&cr=" + localeId}`, {
      headers: {
        Accept: "application/json, text/plain, */*",
        Authorization: token
      }
    })
    return response.data;
  } catch (error: any) {
    throw error;
  }
}

const saveSalesToLocal = async (sales: FudoSale[]): Promise<FudoSales> => {
  try {        
    const response = await axios.post(`http://localhost:8080/api/fudo/sales`, sales)
    return response.data;
  } catch (error: any) {
    throw error;
  }
}


export { getSalesSummary, getSales, saveSalesToLocal}