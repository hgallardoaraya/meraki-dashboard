import { useEffect, useState } from "react";
import axios from "axios";
import { Provider } from "@/types/bills";

interface UseFetchProvidersReturn {
  fetchProviders: () => Promise<void>;
  loading: boolean;
  error: string | null;
  providers: Provider[];
}

interface AxiosGetProviders {
  providers: Provider[]
}

const useFetchProviders = (): UseFetchProvidersReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);

  const fetchProviders = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<AxiosGetProviders>("http://localhost:8080/api/providers/");      
      setProviders(response.data.providers);
    } catch (err) {
      setError((err as Error).message || "Error al obtener los proveedores");
      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  const getProviders = async () => {
    await fetchProviders();
  }

  useEffect(() => {
    getProviders();
  }, [])

  return {
    fetchProviders,
    providers,
    loading,
    error,
  };
};

export default useFetchProviders;
