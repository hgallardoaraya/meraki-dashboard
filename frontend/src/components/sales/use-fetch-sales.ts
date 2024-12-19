import { useEffect, useState } from "react";
import axios from "axios";
import { Sale, SaleWithTextDate } from "@/types/sales";

interface UseFetchSalesReturn {
  fetchSales: () => Promise<void>;
  loading: boolean;
  error: string | null;
  sales: Sale[];
}

interface AxiosGetSales {
  sales: SaleWithTextDate[]
}

const useFetchSales = (): UseFetchSalesReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);

  const fetchSales = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<AxiosGetSales>("http://localhost:8080/api/fudo/sales/");
      const formattedResponse: Sale[] = response.data.sales.map(s => (
        {
          ...s,
          close_at: new Date(s.close_at),          
        }
      ));
      setSales(formattedResponse || []);
    } catch (err) {
      setError((err as Error).message || "Error al obtener las ventas de fudo");
      setSales([])
    } finally {
      setLoading(false);
    }
  };

  const getSales = async () => {
    await fetchSales();
  }

  useEffect(() => {
    getSales();
  }, [])

  return {
    fetchSales,
    sales,
    loading,
    error,
  };
};

export default useFetchSales;
