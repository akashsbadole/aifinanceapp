import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Plus, ShoppingCart, CreditCard, Receipt } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const saleSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  customerPhone: z.string().optional(),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  items: z.array(z.object({
    productId: z.string().min(1, 'Product is required'),
    quantity: z.number().min(1, 'Quantity must be positive'),
    price: z.number().min(0, 'Price must be positive'),
    total: z.number().min(0, 'Total must be positive'),
  })).min(1, 'At least one item is required'),
});

interface Sale {
  id: string;
  customerName: string;
  customerPhone?: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  saleDate: string;
  items: {
    id: string;
    product: {
      name: string;
      sku: string;
    };
    quantity: number;
    price: number;
    total: number;
  }[];
}

interface Product {
  id: string;
  name: string;
  sku: string;
  sellingPrice: number;
  stockQuantity: number;
}

const SalesTransactions: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<{
    productId: string;
    quantity: number;
    price: number;
    total: number;
  }[]>([]);

  const form = useForm<z.infer<typeof saleSchema>>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      paymentMethod: '',
      items: [],
    },
  });

  useEffect(() => {
    fetchSales();
    fetchProducts();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/inventory/sales');
      const data = await response.json();
      setSales(data);
    } catch (error) {
      toast.error('Failed to fetch sales');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/inventory/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to fetch products');
    }
  };

  const addItem = () => {
    setSelectedItems([...selectedItems, {
      productId: '',
      quantity: 1,
      price: 0,
      total: 0,
    }]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...selectedItems];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };

    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index].price = product.sellingPrice;
        newItems[index].total = product.sellingPrice * newItems[index].quantity;
      }
    } else if (field === 'quantity') {
      const product = products.find(p => p.id === newItems[index].productId);
      if (product) {
        newItems[index].total = product.sellingPrice * value;
      }
    }

    setSelectedItems(newItems);
  };

  const removeItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => sum + item.total, 0);
  };

  const onSubmit = async (values: z.infer<typeof saleSchema>) => {
    try {
      const saleData = {
        ...values,
        totalAmount: calculateTotal(),
        items: selectedItems,
      };

      await fetch('http://localhost:3001/api/inventory/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData),
      });

      toast.success('Sale completed successfully');
      setIsDialogOpen(false);
      form.reset();
      setSelectedItems([]);
      fetchSales();
    } catch (error) {
      toast.error('Failed to complete sale');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sales Transactions</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Sale
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>New Sale</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="">Select payment method</option>
                          <option value="cash">Cash</option>
                          <option value="card">Card</option>
                          <option value="upi">UPI</option>
                          <option value="netbanking">Net Banking</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">Items</h3>
                    <Button type="button" variant="outline" onClick={addItem}>
                      Add Item
                    </Button>
                  </div>

                  {selectedItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-5 gap-4 items-end">
                      <FormItem>
                        <FormLabel>Product</FormLabel>
                        <FormControl>
                          <select
                            value={item.productId}
                            onChange={(e) => updateItem(index, 'productId', e.target.value)}
                            className="w-full p-2 border rounded-md"
                          >
                            <option value="">Select product</option>
                            {products.map((product) => (
                              <option key={product.id} value={product.id}>
                                {product.name} (SKU: {product.sku}) - Stock: {product.stockQuantity}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                      </FormItem>

                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>

                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={item.price}
                            onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>

                      <FormItem>
                        <FormLabel>Total</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={item.total}
                            readOnly
                          />
                        </FormControl>
                      </FormItem>

                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => removeItem(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="text-right">
                  <p className="text-lg font-semibold">
                    Total Amount: ₹{calculateTotal().toFixed(2)}
                  </p>
                </div>

                <Button type="submit" className="w-full">
                  Complete Sale
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell>
                {new Date(sale.saleDate).toLocaleString()}
              </TableCell>
              <TableCell>
                {sale.customerName}
                {sale.customerPhone && (
                  <p className="text-sm text-gray-500">{sale.customerPhone}</p>
                )}
              </TableCell>
              <TableCell>
                <ul className="list-disc list-inside">
                  {sale.items.map((item) => (
                    <li key={item.id}>
                      {item.product.name} x {item.quantity} - ₹{item.total.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </TableCell>
              <TableCell>₹{sale.totalAmount.toFixed(2)}</TableCell>
              <TableCell>{sale.paymentMethod}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  sale.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : sale.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SalesTransactions; 