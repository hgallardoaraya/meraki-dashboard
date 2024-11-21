import { useState } from "react";
import axios from "axios";
import { Bill, NewBill } from "@/types/bills";

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
      await axios.post<Bill>("http://localhost:8080/api/bills/", newBill);      
    } catch (error: any) {
      const message = error.response?.data?.message || "error al crear el gasto";
      setError(message); 
    } finally {
      setLoading(false);       
    }
  };

  return { createBill, loading, error };
};

export default useCreateBill;
