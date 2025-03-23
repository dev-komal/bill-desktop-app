import axios from 'axios';
import { Customer, CustomerFormData } from '../types/customer';

const API_URL = 'http://localhost:4000/api';

export const customerService = {
  getAll: async (): Promise<Customer[]> => {
    const response = await axios.get(`${API_URL}/customers`);
    return response.data;
  },

  getById: async (id: string): Promise<Customer> => {
    const response = await axios.get(`${API_URL}/customers/${id}`);
    return response.data;
  },

  create: async (data: CustomerFormData): Promise<Customer> => {
    const response = await axios.post(`${API_URL}/customers`, data);
    return response.data;
  },

  update: async (id: string, data: CustomerFormData): Promise<Customer> => {
    const response = await axios.put(`${API_URL}/customers/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/customers/${id}`);
  }
}; 