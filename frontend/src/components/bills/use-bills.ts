import { useEffect, useState } from "react";
import useCreateBill from "./use-create-bill";
import { BillWithDetails, NewBill } from "./types";
import useFetchBills from "./use-fetch-bills";

interface UseBillsReturn {
  bills: BillWithDetails[];
  loading: boolean;
  error: string | null;
  fetchBills: () => Promise<void>;
  createBill: (newBill: NewBill) => Promise<void>;
  createLoading: boolean;
  createError: string | null;
}

const useBills = (): UseBillsReturn => {
  const [bills, setBills] = useState<BillWithDetails[]>([]);
  
  // Estados para listar
  const {
    fetchBills: fetchBillsFromHook,
    loading: fetchLoading,
    error: fetchError,
  } = useFetchBills();

  // Estados para crear
  const { 
    createBill, 
    loading: createLoading, 
    error: createError 
  } = useCreateBill();

  const fetchBills = async () => {
    const data = await fetchBillsFromHook();
    setBills(data);
  };

  useEffect(() => {
    fetchBills();
  }, []);

  return {
    bills,
    loading: fetchLoading, // Opcional: devolver como loading general para list
    error: fetchError,      // Opcional: devolver como error general para list
    fetchBills,
    createBill,
    createLoading,
    createError,
  };
};

export default useBills;
