import { useEffect, useState } from "react";
import axios from "axios";
import { Locale } from "@/types/bills";

interface UseFetchLocalesReturn {
  fetchLocales: () => Promise<void>;
  loading: boolean;
  error: string | null;
  locales: Locale[];
}

interface AxiosGetLocales {
  locales: Locale[]
}

const useFetchLocales = (): UseFetchLocalesReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [locales, setLocales] = useState<Locale[]>([]);

  const fetchLocales = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<AxiosGetLocales>("http://localhost:8080/api/locales/");      
      setLocales(response.data.locales);
    } catch (err) {
      setError((err as Error).message || "Error al obtener los locales");
      setLocales([])
    } finally {
      setLoading(false);
    }
  };

  const getLocales = async () => {
    await fetchLocales();    
  }

  useEffect(() => {
    getLocales();
  }, [])

  return {
    fetchLocales,
    locales,
    loading,
    error,
  };
};

export default useFetchLocales;
