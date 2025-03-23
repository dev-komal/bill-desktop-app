
import { Item, Bill, Customer } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Mock Categories
export const categories = [
  'Tools',
  'Fasteners',
  'Electrical',
  'Plumbing',
  'Paints',
  'Hardware',
  'Building Materials'
];

// Mock Items
export const items: Item[] = [
  {
    id: '1',
    name: 'Hammer',
    description: 'Claw hammer with wooden handle',
    category: 'Tools',
    price: 299,
    gstPercentage: 18,
    stock: 25,
    createdAt: new Date(2023, 0, 15).toISOString(),
    updatedAt: new Date(2023, 0, 15).toISOString(),
  },
  {
    id: '2',
    name: 'Screwdriver Set',
    description: 'Set of 10 screwdrivers with various heads',
    category: 'Tools',
    price: 599,
    gstPercentage: 18,
    stock: 15,
    createdAt: new Date(2023, 1, 20).toISOString(),
    updatedAt: new Date(2023, 1, 20).toISOString(),
  },
  {
    id: '3',
    name: 'PVC Pipe (10ft)',
    description: '1 inch diameter PVC pipe',
    category: 'Plumbing',
    price: 120,
    gstPercentage: 12,
    stock: 50,
    createdAt: new Date(2023, 2, 10).toISOString(),
    updatedAt: new Date(2023, 2, 10).toISOString(),
  },
  {
    id: '4',
    name: 'Wire (10m)',
    description: '2.5mm electrical copper wire',
    category: 'Electrical',
    price: 350,
    gstPercentage: 18,
    stock: 30,
    createdAt: new Date(2023, 3, 5).toISOString(),
    updatedAt: new Date(2023, 3, 5).toISOString(),
  },
  {
    id: '5',
    name: 'Wall Paint (4L)',
    description: 'Interior wall paint, white color',
    category: 'Paints',
    price: 899,
    gstPercentage: 28,
    stock: 20,
    createdAt: new Date(2023, 4, 12).toISOString(),
    updatedAt: new Date(2023, 4, 12).toISOString(),
  },
  {
    id: '6',
    name: 'Door Handle',
    description: 'Stainless steel door handle with lock',
    category: 'Hardware',
    price: 499,
    gstPercentage: 18,
    stock: 35,
    createdAt: new Date(2023, 5, 18).toISOString(),
    updatedAt: new Date(2023, 5, 18).toISOString(),
  },
  {
    id: '7',
    name: 'Cement (50kg)',
    description: 'Portland cement bag',
    category: 'Building Materials',
    price: 380,
    gstPercentage: 28,
    stock: 100,
    createdAt: new Date(2023, 6, 25).toISOString(),
    updatedAt: new Date(2023, 6, 25).toISOString(),
  }
];

// Mock Customers
export const customers: Customer[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone: '9876543210',
    address: '123, Main Street, Delhi'
  },
  {
    id: '2',
    name: 'Priya Patel',
    email: 'priya@example.com',
    phone: '8765432109',
    address: '456, Park Avenue, Mumbai'
  },
  {
    id: '3',
    name: 'Amit Kumar',
    email: 'amit@example.com',
    phone: '7654321098',
    address: '789, Lake Road, Bangalore'
  }
];

// Mock Bills
export const bills: Bill[] = [
  {
    id: '1',
    customerName: 'Rahul Sharma',
    items: [
      {
        ...items[0],
        quantity: 2,
        totalPrice: items[0].price * 2,
        gstAmount: (items[0].price * items[0].gstPercentage / 100) * 2
      },
      {
        ...items[1],
        quantity: 1,
        totalPrice: items[1].price,
        gstAmount: items[1].price * items[1].gstPercentage / 100
      }
    ],
    totalAmount: (items[0].price * 2) + items[1].price + ((items[0].price * items[0].gstPercentage / 100) * 2) + (items[1].price * items[1].gstPercentage / 100),
    totalGst: ((items[0].price * items[0].gstPercentage / 100) * 2) + (items[1].price * items[1].gstPercentage / 100),
    createdAt: new Date(2023, 7, 10).toISOString()
  },
  {
    id: '2',
    customerName: 'Priya Patel',
    items: [
      {
        ...items[3],
        quantity: 3,
        totalPrice: items[3].price * 3,
        gstAmount: (items[3].price * items[3].gstPercentage / 100) * 3
      }
    ],
    totalAmount: (items[3].price * 3) + ((items[3].price * items[3].gstPercentage / 100) * 3),
    totalGst: (items[3].price * items[3].gstPercentage / 100) * 3,
    createdAt: new Date(2023, 7, 15).toISOString()
  }
];

// Helper functions to simulate API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Item APIs
  getItems: async (): Promise<Item[]> => {
    await delay(500);
    return [...items];
  },
  
  getItem: async (id: string): Promise<Item | undefined> => {
    await delay(300);
    return items.find(item => item.id === id);
  },
  
  createItem: async (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Promise<Item> => {
    await delay(700);
    const newItem: Item = {
      ...item,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    items.push(newItem);
    return newItem;
  },
  
  updateItem: async (id: string, item: Partial<Item>): Promise<Item> => {
    await delay(600);
    const index = items.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Item not found');
    
    const updatedItem = {
      ...items[index],
      ...item,
      updatedAt: new Date().toISOString()
    };
    items[index] = updatedItem;
    return updatedItem;
  },
  
  deleteItem: async (id: string): Promise<void> => {
    await delay(400);
    const index = items.findIndex(i => i.id === id);
    if (index === -1) throw new Error('Item not found');
    items.splice(index, 1);
  },
  
  // Bill APIs
  getBills: async (): Promise<Bill[]> => {
    await delay(500);
    return [...bills];
  },
  
  getBill: async (id: string): Promise<Bill | undefined> => {
    await delay(300);
    return bills.find(bill => bill.id === id);
  },
  
  createBill: async (bill: Omit<Bill, 'id' | 'createdAt'>): Promise<Bill> => {
    await delay(800);
    const newBill: Bill = {
      ...bill,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    bills.push(newBill);
    return newBill;
  },
  
  // Customer APIs
  getCustomers: async (): Promise<Customer[]> => {
    await delay(400);
    return [...customers];
  },
  
  createCustomer: async (customer: Omit<Customer, 'id'>): Promise<Customer> => {
    await delay(600);
    const newCustomer: Customer = {
      ...customer,
      id: uuidv4()
    };
    customers.push(newCustomer);
    return newCustomer;
  }
};
