import { AuthState } from "@/auth/authSlice";
import { store } from "@/store";
import { FudoSales, FudoSalesSummary } from "@/types/fudo";
import { FudoSale } from "@/types/sales";
import axios from "axios"
import { useSelector } from "react-redux";

const FUDO_API_URL = "https://api.fu.do"
// t1 = inico
// t2 = fin
// w = local (2 es rafael riesco)
const getSalesSummary = async (startDate:string, endDate:string, localeId:number = -1): Promise<FudoSalesSummary> => {
  const state = store.getState();
  try {        
    const response = await axios.get(`${FUDO_API_URL}/sales_summary?dc=0&ss=3&t1=${startDate}&t2=${endDate}${localeId !== -1 && "&cr=" + localeId}`, {
      headers: {
        Accept: "application/json, text/plain, */*",
        Authorization: "Bearer " + state.auth.fudoToken
      }
    })
    return response.data;
  } catch (error: any) {
    throw error;
  }
}

const getSales = async (startDate:string, endDate:string, localeId:number = -1, pageNum:number): Promise<FudoSales> => {
  const state = store.getState();
  try {        
    const response = await axios.get(`${FUDO_API_URL}/sales?dc=0&page=${pageNum}&ss=3&t1=${startDate}&t2=${endDate}${localeId !== -1 && "&cr=" + localeId}`, {
      headers: {
        Accept: "application/json, text/plain, */*",
        Authorization: "Bearer " + state.auth.fudoToken
      }
    })
    return response.data;
  } catch (error: any) {
    throw error;
  }
}

const saveSalesToLocal = async (sales: FudoSale[]): Promise<FudoSales> => {
  const state = store.getState();
  try {        
    const response = await axios.post(`http://localhost:8080/api/fudo/sales`, sales)
    return response.data;
  } catch (error: any) {
    throw error;
  }
}

const linkFudoAccount = async (username: string, password: string) => {
  const state = store.getState();
  const response = await axios.post("http://localhost:8080/api/sales/fudo/link", {username, password}, {
    headers: {
      Authorization: state.auth.token
    }
  })  
  console.log("response authentication ", response.data.token);
}

const getJWT = async () => { 
  const state = store.getState();
  try{
    const response = await axios.post("http://localhost:8080/api/sales/proxy/authenticate", null, {
      headers: {
        Authorization: state.auth.token
      }
    })  
    return response.data.token;
  } catch(error: any) {
    throw error
  }
}

export { getSalesSummary, getSales, saveSalesToLocal, getJWT, linkFudoAccount }