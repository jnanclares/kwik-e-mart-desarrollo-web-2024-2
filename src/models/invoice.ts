export interface InvoiceData {
  date: string;
  items: any[];
  shipping: number;
  tax: number;
  total: number;
  pay_method: string;
  customer?: string;
}
