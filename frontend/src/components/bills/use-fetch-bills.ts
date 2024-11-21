import { useState } from "react";
import axios from "axios";
import { BillWithDetails, BillWithDetailsTextDates } from "./types";

interface UseFetchBillsReturn {
  fetchBills: () => Promise<BillWithDetails[]>;
  loading: boolean;
  error: string | null;
}

interface AxiosGetBills {
  bills: BillWithDetailsTextDates[]
}

const useFetchBills = (): UseFetchBillsReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBills = async (): Promise<BillWithDetails[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<AxiosGetBills>("http://localhost:8080/api/bills/");
      const bills: BillWithDetails[] = response.data.bills.map(b => (
        {
          ...b,
          creation_date: new Date(b.creation_date),
          contable_date: new Date(b.contable_date)
        }
      ))
      return bills;
    } catch (err) {
      setError((err as Error).message || "Error al obtener los gastos");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchBills,
    loading,
    error,
  };
};

export default useFetchBills;
