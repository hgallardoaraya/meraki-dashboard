import { useState } from "react";
import axios from "axios";
import { Locale, NewLocale } from "@/types/bills";

interface UseLocalReturn {
  createLocale: (newLocale: NewLocale) => Promise<void>;
  deleteLocale: (id: number) => Promise<void>;
  updateLocale: (newLocale: Locale) => Promise<void>;
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
      const message = error.response?.data?.message || "error al crear local";
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
      const message = error.response?.data?.message || "error al eliminar local";
      setError(message); 
    } finally {
      setLoading(false);       
    }
  };

  const updateLocale = async (locale: Locale): Promise<void> => {
    try {
      setLoading(true);       
      setError(null);             
      console.log("update locale ", locale)      
      await axios.put("http://localhost:8080/api/locales/"+locale.id, locale);      
    } catch (error: any) {
      const message = error.response?.data?.message || "error al actualizar local";
      setError(message); 
    } finally {
      setLoading(false);       
    }
  };

  return { createLocale, deleteLocale, updateLocale, loading, error };
};

export default useLocale;
