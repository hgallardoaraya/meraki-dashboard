import { useEffect, useState } from "react";
import axios from "axios";
import { Type } from "@/types/bills";

interface UseFetchTypesReturn {
  fetchTypes: () => Promise<void>;
  loading: boolean;
  error: string | null;
  types: Type[];
}

interface AxiosGetTypes {
  billTypes: Type[]
}

const useFetchTypes = (): UseFetchTypesReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [types, setTypes] = useState<Type[]>([]);

  const fetchTypes = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<AxiosGetTypes>("http://localhost:8080/api/bill_types/");       
      setTypes(response.data.billTypes || []);
    } catch (err) {
      setError((err as Error).message || "Error al obtener los tipos de gastos");
      setTypes([]);
    } finally {
      setLoading(false);
    }
  };

  const getTypes = async () => {
    await fetchTypes();
  }

  useEffect(() => {
    getTypes();
  }, [])

  return {
    fetchTypes,
    types,
    loading,
    error,
  };
};

export default useFetchTypes;
