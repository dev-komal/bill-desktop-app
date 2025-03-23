
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowRight, ArrowUpRight, BarChart3, Package, Receipt, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '@/services/mockData';
import { useQuery } from '@tanstack/react-query';

const Dashboard = () => {
  const { data: items = [] } = useQuery({
    queryKey: ['items'],
    queryFn: api.getItems,
  });

  const { data: bills = [] } = useQuery({
    queryKey: ['bills'],
    queryFn: api.getBills,
  });

  const totalSales = bills.reduce((total, bill) => total + bill.totalAmount, 0);
  const totalGst = bills.reduce((total, bill) => total + bill.totalGst, 0);
  const lowStockItems = items.filter(item => item.stock < 20);
  
  // Prepare chart data
  const categorySales = items.reduce((acc: Record<string, number>, item) => {
    if (!acc[item.category]) {
      acc[item.category] = 0;
    }
    const itemsInBills = bills.flatMap(bill => 
      bill.items.filter(billItem => billItem.id === item.id)
    );
    const sales = itemsInBills.reduce((total, billItem) => total + billItem.totalPrice, 0);
    acc[item.category] += sales;
    return acc;
  }, {});

  const chartData = Object.entries(categorySales).map(([category, sales]) => ({
    category,
    sales
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Last 7 Days</Button>
          <Button variant="outline" size="sm">Last 30 Days</Button>
          <Button variant="outline" size="sm">All Time</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total GST Collected</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalGst.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+18.7% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invoices Generated</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bills.length}</div>
            <p className="text-xs text-muted-foreground">+12.3% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">+3 since last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>
              Category-wise sales distribution for the current period
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 5,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your recent bills and inventory changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {bills.slice(0, 5).map(bill => (
                <div key={bill.id} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Invoice #{bill.id} - {bill.customerName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(bill.createdAt).toLocaleDateString()} - ₹{bill.totalAmount.toFixed(2)}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    {bill.items.length} items
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-center">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/billing">
                  View all invoices
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alert</CardTitle>
            <CardDescription>
              Items that need to be restocked soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.slice(0, 5).map(item => (
                <div key={item.id} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.category} - ₹{item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-red-500">
                    Stock: {item.stock}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-center">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/inventory">
                  Manage inventory
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
