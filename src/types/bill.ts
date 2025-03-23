import { Customer } from './customer';
import { Item } from './item';

export interface BillItem {
  id: string;
  name: string;
  price: number;
  gstPercentage: number;
  quantity: number;
  totalPrice: number;
  gstAmount: number;
}

export interface Bill {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerGstin?: string;
  items: BillItem[];
  subtotal: number;
  totalGst: number;
  totalAmount: number;
  date: string;
  createdAt: string;
  updatedAt: string;
} 