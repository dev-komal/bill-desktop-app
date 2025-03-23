export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gstin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  gstin?: string;
} 