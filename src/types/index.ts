
export interface Item {
  id: string | number;
  name: string;
  description: string;
  category: string;
  price: number;
  gstPercentage: number;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BillItem extends Item {
  quantity: number;
  totalPrice: number;
  gstAmount: number;
}

export interface Bill {
  id: string | number;
  customerName: string;
  items: BillItem[];
  totalAmount: number;
  totalGst: number;
  createdAt: string;
}

export interface Customer {
  id: string | number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export type ItemFormData = Omit<Item, 'id' | 'createdAt' | 'updatedAt'>;
export type CustomerFormData = Omit<Customer, 'id'>;

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status?: number;
}
