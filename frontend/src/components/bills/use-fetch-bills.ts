import { useEffect, useState } from "react";
import axios from "axios";
import { BillWithDetails, BillWithDetailsTextDates } from "@/types/bills";

interface UseFetchBillsReturn {
  fetchBills: () => Promise<void>;
  loading: boolean;
  error: string | null;
  bills: BillWithDetails[];
}

interface AxiosGetBills {
  bills: BillWithDetailsTextDates[]
}

const useFetchBills = (): UseFetchBillsReturn => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [bills, setBills] = useState<BillWithDetails[]>([]);

  const fetchBills = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<AxiosGetBills>("http://localhost:8080/api/bills/");
      const formattedResponse: BillWithDetails[] = response.data.bills.map(b => (
        {
          ...b,
          creation_date: new Date(b.creation_date),
          contable_date: new Date(b.contable_date)
        }
      ));
      setBills(formattedResponse);
    } catch (err) {
      setError((err as Error).message || "Error al obtener los gastos");
      setBills([])
    } finally {
      setLoading(false);
    }
  };

  const getBills = async () => {
    await fetchBills();
  }

  useEffect(() => {
    getBills();
  }, [])

  return {
    fetchBills,
    bills,
    loading,
    error,
  };
};

export default useFetchBills;
