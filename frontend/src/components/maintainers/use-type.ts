import { useState } from "react";
import axios from "axios";
import { NewLocale, NewType } from "@/types/bills";

interface UseTypeReturn {
  createType: (newLocale: NewLocale) => Promise<void>;
  deleteType: (id: number) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const useType = (): UseTypeReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createType = async (newType: NewType): Promise<void> => {
    try {
      setLoading(true);       
      setError(null);             
      await axios.post("http://localhost:8080/api/bill_types/", newType);      
    } catch (error: any) {
      const message = error.response?.data?.message || "error al crear el tipo de gasto";
      setError(message); 
    } finally {
      setLoading(false);       
    }
  };

  const deleteType = async (id: number): Promise<void> => {
    try {
      setLoading(true);       
      setError(null);             
      await axios.delete("http://localhost:8080/api/bill_types/"+id);      
    } catch (error: any) {
      const message = error.response?.data?.message || "error al eliminar el tipo de gasto";
      setError(message); 
    } finally {
      setLoading(false);       
    }
  };

  return { createType, deleteType, loading, error };
};

export default useType;
