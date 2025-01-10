import { FudoSale } from "@/types/sales";
import axios from "axios";

const fetchSales = async (limit: number, offset: number): Promise<FudoSale[]> => {
  try {
    const response = await axios.get(`http://localhost:8080/api/sales/rep?limit=${limit}&offset=${offset}`, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    const formattedResponse: FudoSale[] = response.data.sales.map((s:any) => ({
      ...s,
      date: new Date(s.date),
    }));
    return formattedResponse;
  } catch (err) {
    throw err
  }
};


export default fetchSales;
