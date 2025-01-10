type CanceledAdditions = {
  count: string,
  amount: string,
}

type Room = {
  id: number | string | null,
  amount: string,
}

type Total = {
  amount: string,
  saleTypeId: number,
}

type FudoSalesSummary = {
  canceledAdditions: CanceledAdditions,
  payments: Payment[],
  rooms: Room[],
  salesCount: number,
  totalTipsV1: Float32Array,
  totals: Total[],
  totalTips: Float32Array,
  totalShippingCosts: Float32Array
}

type Addition = {
  id: number;
  canceled: string | null;
  cancellationComment: string | null;
  count: number;
  comboAdditions: any[];
  comment: string | null;
  createdAt: string;
  price: number;
  priceListId: string | null;
  productId: number;
  paid: boolean;
  status: string;
}

type Payment = {
  id?: number;
  paymentTypeId: number;
  amount: number;
  canceled?: string | null;
}

interface FudoSale {
  additions: Addition[];
  cashRegisterId: number;
  closedAt: string;
  comment: string | null;
  createdAt: string;
  deliveryData: object;  
  discounts: any[];  
  serviceCosts: any[];  
  shippingCosts: any[]; 
  guestId: string | null;
  invoicingStatus: string;
  id: number;
  lastReceipt: string | null;
  mobileToken: string;
  payments: Payment[];
  people: any | null;  
  saleIdentifierId: string | null;
  saleReceipts: any[]; 
  saleStateId: number;
  saleTypeId: number;
  tableId: string | null;
  tips: any[];  
  userId: number;
  order: any | null;
}

type FudoSales = {
  [saleId: string]: FudoSale;
}


export type { FudoSalesSummary, Total, Room, Payment, CanceledAdditions, FudoSales, FudoSale }