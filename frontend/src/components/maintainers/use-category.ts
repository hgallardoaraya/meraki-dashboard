import { useState } from "react";
import axios from "axios";
import { Category, NewCategory, NewLocale } from "@/types/bills";

interface UseCategoryReturn {
  createCategory: (newCategory: NewCategory) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  updateCategory: (newLocale: Category) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const useCategory = (): UseCategoryReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createCategory = async (newCategory: NewCategory): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await axios.post("http://localhost:8080/api/bill_categories/", newCategory);
    } catch (error: any) {
      const message = error.response?.data?.message || "error al crear categoría";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await axios.delete("http://localhost:8080/api/bill_categories/" + id);
    } catch (error: any) {
      const message = error.response?.data?.message || "error al eliminar categoría";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (category: Category): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await axios.put("http://localhost:8080/api/bill_categories/" + category.id, category);
    } catch (error: any) {
      const message = error.response?.data?.message || "error al actualizar categoría";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return { createCategory, deleteCategory, updateCategory, loading, error };
};

export default useCategory;
