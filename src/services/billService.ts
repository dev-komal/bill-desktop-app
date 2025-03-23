import axios from 'axios';
import { Bill } from '../types/bill';

const API_URL = 'http://localhost:3001/api';

export const billService = {
  getAll: async (): Promise<Bill[]> => {
    const response = await axios.get(`${API_URL}/bills`);
    return response.data;
  },

  getById: async (id: string): Promise<Bill> => {
    const response = await axios.get(`${API_URL}/bills/${id}`);
    return response.data;
  },

  create: async (bill: Omit<Bill, 'id' | 'createdAt' | 'updatedAt'>): Promise<Bill> => {
    const response = await axios.post(`${API_URL}/bills`, bill);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/bills/${id}`);
  }
}; 