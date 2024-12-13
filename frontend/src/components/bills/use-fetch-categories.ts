import { useEffect, useState } from "react";
import axios from "axios";
import { Category } from "@/types/bills";

interface UseFetchCategoriesReturn {
  fetchCategories: () => Promise<void>;
  loading: boolean;
  error: string | null;
  categories: Category[];
}

interface AxiosGetCategories {
  billCategories: Category[]
}

const useFetchCategories = (): UseFetchCategoriesReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<AxiosGetCategories>("http://localhost:8080/api/bill_categories/");       
      setCategories(response.data.billCategories || []);
    } catch (err) {
      setError((err as Error).message || "Error al obtener las categorías de gastos");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategories = async () => {
    await fetchCategories();
  }

  useEffect(() => {
    getCategories();
  }, [])

  return {
    fetchCategories,
    categories,
    loading,
    error,
  };
};

export default useFetchCategories;
