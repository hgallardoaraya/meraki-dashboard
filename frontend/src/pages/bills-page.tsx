import { BillsForm } from "@/components/bills/bills-form";

const BillsPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-medium text-lg text-gray-900">Gastos</h1>
      <div className="flex flex-col px-4 py-2 w-fit items-start justify-start gap-3 bg-white rounded-md border border-gray-100">
        <h2 className="font-medium text-lg text-gray-800">Ingreso de gastos</h2>
        <BillsForm />
      </div>
    </div>
  );
};

export default BillsPage;
  