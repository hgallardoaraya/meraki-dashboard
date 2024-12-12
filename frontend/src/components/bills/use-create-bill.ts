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
      const formData = new FormData();
      Object.entries(newBill).forEach(([key, value]) => {
        if (key === "documents" && value instanceof FileList) {
          Array.from(value).forEach((file) => {
            formData.append("files", file); // Agregar archivos al FormData
          });
        } else {         
          formData.append(key, value as string | Blob); // Convertir a string o usar como Blob
        }
      });
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
      await axios.post<Bill>("http://localhost:8080/api/bills/", 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        }
      );      
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
