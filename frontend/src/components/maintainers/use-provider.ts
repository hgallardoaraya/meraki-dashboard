import { useState } from "react";
import axios from "axios";
import { NewProvider } from "@/types/bills";

interface UseProviderReturn {
  createProvider: (newProvider: NewProvider) => Promise<void>;
  deleteProvider: (id: number) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const useProvider = (): UseProviderReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createProvider = async (newProvider: NewProvider): Promise<void> => {
    try {
      setLoading(true);       
      setError(null);             
      await axios.post("http://localhost:8080/api/providers/", newProvider);      
    } catch (error: any) {
      const message = error.response?.data?.message || "error al crear proveedor";
      setError(message); 
    } finally {
      setLoading(false);       
    }
  };

  const deleteProvider = async (id: number): Promise<void> => {
    try {
      setLoading(true);       
      setError(null);             
      await axios.delete("http://localhost:8080/api/providers/"+id);      
    } catch (error: any) {
      const message = error.response?.data?.message || "error al eliminar proveedor";
      setError(message); 
    } finally {
      setLoading(false);       
    }
  };

  return { createProvider, deleteProvider, loading, error };
};

export default useProvider;
