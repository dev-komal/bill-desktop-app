import axios from 'axios';
import { Item, BillItem, Bill, Customer, ItemFormData, CustomerFormData } from '@/types';

const API_URL = 'http://localhost:4000/api'; // Update this with your backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const itemsApi = {
  getItems: async (): Promise<Item[]> => {
    const response = await api.get('/items');
    return response.data;
  },
  
  getItem: async (id: string): Promise<Item> => {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },
  
  searchItems: async (searchTerm: string): Promise<Item[]> => {
    const response = await api.get(`/items/search?search=${searchTerm}`);
    return response.data;
  },
  
  createItem: async (item: ItemFormData): Promise<Item> => {
    const response = await api.post('/items', item);
    return response.data;
  },
  
  updateItem: async (id: string, item: Partial<Item>): Promise<Item> => {
    const response = await api.put(`/items/${id}`, item);
    return response.data;
  },
  
  deleteItem: async (id: string): Promise<void> => {
    await api.delete(`/items/${id}`);
  }
};

export const customersApi = {
  getCustomers: async (): Promise<Customer[]> => {
    const response = await api.get('/customers');
    return response.data;
  },
  
  createCustomer: async (customer: CustomerFormData): Promise<Customer> => {
    const response = await api.post('/customers', customer);
    return response.data;
  }
};

export const billsApi = {
  getBills: async (): Promise<Bill[]> => {
    const response = await api.get('/bills');
    return response.data;
  },
  
  getBill: async (id: string): Promise<Bill> => {
    const response = await api.get(`/bills/${id}`);
    return response.data;
  },
  
  createBill: async (bill: Omit<Bill, 'id' | 'createdAt'>): Promise<Bill> => {
    const response = await api.post('/bills', bill);
    return response.data;
  }
};

export default {
  items: itemsApi,
  customers: customersApi,
  bills: billsApi
};
