import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, FileText, Plus, Search, Trash2, UserPlus } from 'lucide-react';
import { Item, ItemFormData } from '@/types';
import { BillItem } from '@/types/bill';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemsApi, billsApi } from '@/services/api';
import { customerService } from '@/services/customerService';
import { Customer } from '@/types/customer';

const Billing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isManualItemDialogOpen, setIsManualItemDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [manualItemForm, setManualItemForm] = useState<ItemFormData>({
    name: '',
    description: '',
    category: 'Hardware',
    price: 0,
    gstPercentage: 18,
    stock: 1
  });
  const [isNewCustomerDialogOpen, setIsNewCustomerDialogOpen] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    gstin: ''
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: items = [] } = useQuery({
    queryKey: ['items'],
    queryFn: itemsApi.getItems,
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: customerService.getAll,
  });
  
  const createBillMutation = useMutation({
    mutationFn: (bill: any) => billsApi.createBill(bill),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
      toast({
        title: "Bill Created",
        description: "Invoice generated successfully",
      });
      setBillItems([]);
      setSelectedCustomer(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to generate invoice: " + error.message,
        variant: "destructive",
      });
    }
  });
  
  const addItemMutation = useMutation({
    mutationFn: (newItem: ItemFormData) => itemsApi.createItem(newItem),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast({
        title: "Item Added",
        description: "New item added to inventory",
      });
      setIsManualItemDialogOpen(false);
      handleAddToBill(newItem, 1);
      resetManualItemForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to add item: " + error.message,
        variant: "destructive",
      });
    }
  });
  
  const resetManualItemForm = () => {
    setManualItemForm({
      name: '',
      description: '',
      category: 'Hardware',
      price: 0,
      gstPercentage: 18,
      stock: 1
    });
  };
  
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    try {
      const results = await itemsApi.searchItems(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search Error",
        description: "Failed to search items",
        variant: "destructive",
      });
      setSearchResults([]);
    }
  };
  
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
    } else {
      handleSearch();
    }
  };
  
  const handleAddToBill = (item: Item, quantity: number) => {
    const existingItemIndex = billItems.findIndex(i => i.id === item.id);
    
    // Ensure price is a number and id is a string
    const price = Number(item.price);
    const gstPercentage = Number(item.gstPercentage);
    const id = String(item.id);
    
    if (existingItemIndex !== -1) {
      const updatedItems = [...billItems];
      const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: newQuantity,
        totalPrice: price * newQuantity,
        gstAmount: (price * gstPercentage / 100) * newQuantity
      };
      setBillItems(updatedItems);
    } else {
      const newBillItem: BillItem = {
        id,
        name: item.name,
        price,
        gstPercentage,
        quantity,
        totalPrice: price * quantity,
        gstAmount: (price * gstPercentage / 100) * quantity
      };
      setBillItems([...billItems, newBillItem]);
    }
    
    setSearchTerm('');
    setSearchResults([]);
    setIsSearching(false);
    
    toast({
      title: "Item Added",
      description: `${item.name} added to bill`,
    });
  };
  
  const handleManualItemInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setManualItemForm(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'gstPercentage' || name === 'stock' 
        ? parseFloat(value) || 0
        : value
    }));
  };
  
  const handleManualItemSelectChange = (name: string, value: string) => {
    setManualItemForm(prev => ({
      ...prev,
      [name]: name === 'gstPercentage' ? parseInt(value, 10) : value
    }));
  };
  
  const handleAddManualItem = (e: React.FormEvent) => {
    e.preventDefault();
    addItemMutation.mutate(manualItemForm);
  };
  
  const handleRemoveFromBill = (index: number) => {
    setBillItems(billItems.filter((_, i) => i !== index));
  };
  
  const handleUpdateQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;
    
    const updatedItems = [...billItems];
    const item = updatedItems[index];
    updatedItems[index] = {
      ...item,
      quantity,
      totalPrice: item.price * quantity,
      gstAmount: (item.price * item.gstPercentage / 100) * quantity
    };
    setBillItems(updatedItems);
  };
  
  const handleGenerateInvoice = () => {
    if (!selectedCustomer) {
      toast({
        title: "Error",
        description: "Please select a customer",
        variant: "destructive",
      });
      return;
    }
    
    if (billItems.length === 0) {
      toast({
        title: "Error",
        description: "Please add items to the bill",
        variant: "destructive",
      });
      return;
    }
    
    const totalAmount = billItems.reduce((total, item) => total + item.totalPrice + item.gstAmount, 0);
    const totalGst = billItems.reduce((total, item) => total + item.gstAmount, 0);
    
    const bill = {
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerEmail: selectedCustomer.email,
      customerPhone: selectedCustomer.phone,
      customerAddress: selectedCustomer.address,
      customerGstin: selectedCustomer.gstin,
      items: billItems,
      totalAmount,
      totalGst,
      date: new Date().toISOString(),
    };
    
    createBillMutation.mutate(bill);
  };
  
  const subtotal = billItems.reduce((total, item) => total + item.totalPrice, 0);
  const totalGst = billItems.reduce((total, item) => total + item.gstAmount, 0);
  const totalAmount = subtotal + totalGst;
  
  const addCustomerMutation = useMutation({
    mutationFn: (newCustomer: typeof newCustomerForm) => customerService.create(newCustomer),
    onSuccess: (newCustomer) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setSelectedCustomer(newCustomer);
      setIsNewCustomerDialogOpen(false);
      toast({
        title: "Customer Added",
        description: "New customer added successfully",
      });
      setNewCustomerForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        gstin: ''
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to add customer: " + error.message,
        variant: "destructive",
      });
    }
  });

  const handleNewCustomerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustomerForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddNewCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomerMutation.mutate(newCustomerForm);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Billing System</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setBillItems([])}>
            Clear Bill
          </Button>
          <Button onClick={handleGenerateInvoice} disabled={createBillMutation.isPending}>
            <FileText className="mr-2 h-4 w-4" />
            {createBillMutation.isPending ? 'Generating...' : 'Generate Invoice'}
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Item Search</CardTitle>
              <CardDescription>
                Search for items to add to the bill or add a new item
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search items..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Dialog open={isManualItemDialogOpen} onOpenChange={setIsManualItemDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Manual Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Item</DialogTitle>
                      <DialogDescription>
                        Add a new item that isn't in your inventory
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddManualItem}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="manual-name" className="text-right">
                            Name
                          </Label>
                          <Input
                            id="manual-name"
                            name="name"
                            value={manualItemForm.name}
                            onChange={handleManualItemInputChange}
                            className="col-span-3"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="manual-price" className="text-right">
                            Price (₹)
                          </Label>
                          <Input
                            id="manual-price"
                            name="price"
                            type="number"
                            value={manualItemForm.price}
                            onChange={handleManualItemInputChange}
                            className="col-span-3"
                            min={0}
                            step={0.01}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="manual-gstPercentage" className="text-right">
                            GST %
                          </Label>
                          <Select
                            value={manualItemForm.gstPercentage.toString()}
                            onValueChange={(value) => handleManualItemSelectChange('gstPercentage', value)}
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select GST %" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">0%</SelectItem>
                              <SelectItem value="5">5%</SelectItem>
                              <SelectItem value="12">12%</SelectItem>
                              <SelectItem value="18">18%</SelectItem>
                              <SelectItem value="28">28%</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={addItemMutation.isPending}>
                          {addItemMutation.isPending ? 'Adding...' : 'Add Item'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              {isSearching && (
                <div className="border rounded-md">
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-center">
                      <p className="text-muted-foreground">No items found. Add a manual item?</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price (₹)</TableHead>
                          <TableHead>GST %</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {searchResults.map(item => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>₹{Number(item.price).toFixed(2)}</TableCell>
                            <TableCell>{item.gstPercentage}%</TableCell>
                            <TableCell className="text-right">
                              <Button size="sm" variant="outline" onClick={() => handleAddToBill(item, 1)}>
                                Add to Bill
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Current Bill</CardTitle>
              <CardDescription>
                Items added to the current invoice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Price (₹)</TableHead>
                      <TableHead>GST %</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>GST (₹)</TableHead>
                      <TableHead>Total (₹)</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {billItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          No items added to bill yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      billItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>₹{item.price.toFixed(2)}</TableCell>
                          <TableCell>{item.gstPercentage}%</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-7 w-7"
                                onClick={() => handleUpdateQuantity(index, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                -
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-7 w-7"
                                onClick={() => handleUpdateQuantity(index, item.quantity + 1)}
                              >
                                +
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>₹{item.gstAmount.toFixed(2)}</TableCell>
                          <TableCell>₹{(item.totalPrice + item.gstAmount).toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleRemoveFromBill(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Invoice Summary</CardTitle>
              <CardDescription>
                Customer and billing information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Customer</Label>
                  <div className="flex space-x-2">
                    <Select
                      value={selectedCustomer?.id || ''}
                      onValueChange={(value) => {
                        const customer = customers.find(c => c.id === value);
                        setSelectedCustomer(customer || null);
                      }}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map(customer => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Dialog open={isNewCustomerDialogOpen} onOpenChange={setIsNewCustomerDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Add New Customer</DialogTitle>
                          <DialogDescription>
                            Add a new customer to your database
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddNewCustomer}>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="customer-name" className="text-right">
                                Name
                              </Label>
                              <Input
                                id="customer-name"
                                name="name"
                                value={newCustomerForm.name}
                                onChange={handleNewCustomerInputChange}
                                className="col-span-3"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="customer-email" className="text-right">
                                Email
                              </Label>
                              <Input
                                id="customer-email"
                                name="email"
                                type="email"
                                value={newCustomerForm.email}
                                onChange={handleNewCustomerInputChange}
                                className="col-span-3"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="customer-phone" className="text-right">
                                Phone
                              </Label>
                              <Input
                                id="customer-phone"
                                name="phone"
                                value={newCustomerForm.phone}
                                onChange={handleNewCustomerInputChange}
                                className="col-span-3"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="customer-address" className="text-right">
                                Address
                              </Label>
                              <Input
                                id="customer-address"
                                name="address"
                                value={newCustomerForm.address}
                                onChange={handleNewCustomerInputChange}
                                className="col-span-3"
                                required
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="customer-gstin" className="text-right">
                                GSTIN
                              </Label>
                              <Input
                                id="customer-gstin"
                                name="gstin"
                                value={newCustomerForm.gstin}
                                onChange={handleNewCustomerInputChange}
                                className="col-span-3"
                                placeholder="Optional"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit" disabled={addCustomerMutation.isPending}>
                              {addCustomerMutation.isPending ? 'Adding...' : 'Add Customer'}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  {selectedCustomer && (
                    <div className="text-sm text-muted-foreground">
                      <p>{selectedCustomer.email}</p>
                      <p>{selectedCustomer.phone}</p>
                      <p>{selectedCustomer.address}</p>
                      {selectedCustomer.gstin && <p>GSTIN: {selectedCustomer.gstin}</p>}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Date</Label>
                  <div className="text-sm font-medium">
                    {new Date().toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-sm">Subtotal:</span>
                    <span className="text-sm font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">GST:</span>
                    <span className="text-sm font-medium">₹{totalGst.toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold">₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Button 
                className="w-full" 
                onClick={handleGenerateInvoice}
                disabled={createBillMutation.isPending || billItems.length === 0 || !selectedCustomer}
              >
                {createBillMutation.isPending ? 'Generating...' : 'Generate Invoice'}
              </Button>
              <Button className="w-full" variant="outline" disabled>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Billing;
