import { useState } from "react";
import axios from "axios";
import { NewLocale } from "@/types/bills";

interface UseLocalReturn {
  createLocale: (newLocale: NewLocale) => Promise<void>;
  deleteLocale: (id: number) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const useLocale = (): UseLocalReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createLocale = async (newLocale: NewLocale): Promise<void> => {
    try {
      setLoading(true);       
      setError(null);             
      await axios.post("http://localhost:8080/api/locales/", newLocale);      
    } catch (error: any) {
      const message = error.response?.data?.message || "error al crear el local";
      setError(message); 
    } finally {
      setLoading(false);       
    }
  };

  const deleteLocale = async (id: number): Promise<void> => {
    try {
      setLoading(true);       
      setError(null);             
      await axios.delete("http://localhost:8080/api/locales/"+id);      
    } catch (error: any) {
      const message = error.response?.data?.message || "error al eliminar el local";
      setError(message); 
    } finally {
      setLoading(false);       
    }
  };

  return { createLocale, deleteLocale, loading, error };
};

export default useLocale;
