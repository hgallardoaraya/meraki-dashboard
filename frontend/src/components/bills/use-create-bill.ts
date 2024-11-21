import { useState } from "react";
import axios from "axios";
import { Bill, NewBill } from "./types";

interface UseCreateBillReturn {
  createBill: (newBill: NewBill) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const useCreateBill = (): UseCreateBillReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createBill = async (newBill: NewBill): Promise<void> => {
    try {
      setLoading(true);       
      setError(null);             
      const response = await axios.post<Bill>("http://localhost:8080/api/bills/", newBill); // Endpoint para crear gastos
      const data = response.data;
      console.log(data);
    } catch (error: any) {
      const message = error.response?.data?.message || "Error al crear el gasto";
      setError(message); 
    } finally {
      setLoading(false);       
    }
  };

  return { createBill, loading, error };
};

export default useCreateBill;
