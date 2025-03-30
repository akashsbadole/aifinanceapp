import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface InventorySummary {
  totalProducts: number;
  totalStock: number;
  lowStockItems: number;
  totalValue: number;
  recentTransactions: {
    id: string;
    type: 'sale' | 'purchase' | 'adjustment';
    product: string;
    quantity: number;
    date: string;
    status: 'completed' | 'pending' | 'cancelled';
  }[];
  stockTrend: {
    date: string;
    stock: number;
    sales: number;
  }[];
}

const InventoryDashboard: React.FC = () => {
  const [summary, setSummary] = useState<InventorySummary>({
    totalProducts: 0,
    totalStock: 0,
    lowStockItems: 0,
    totalValue: 0,
    recentTransactions: [],
    stockTrend: [],
  });
  const { toast } = useToast();

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchSummary = async () => {
      try {
        // Mock data for now
        setSummary({
          totalProducts: 150,
          totalStock: 2500,
          lowStockItems: 12,
          totalValue: 250000,
          recentTransactions: [
            {
              id: '1',
              type: 'sale',
              product: 'Product A',
              quantity: 5,
              date: new Date().toISOString(),
              status: 'completed',
            },
            {
              id: '2',
              type: 'purchase',
              product: 'Product B',
              quantity: 10,
              date: new Date().toISOString(),
              status: 'pending',
            },
          ],
          stockTrend: [
            { date: '2024-01', stock: 100, sales: 20 },
            { date: '2024-02', stock: 120, sales: 25 },
            { date: '2024-03', stock: 90, sales: 30 },
          ],
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch inventory summary',
          variant: 'destructive',
        });
      }
    };

    fetchSummary();
  }, [toast]);

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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Inventory Dashboard</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalStock}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{summary.lowStockItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalValue)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Stock & Sales Trend</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={summary.stockTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="stock" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ fill: '#8884d8' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    dot={{ fill: '#82ca9d' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.recentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{format(new Date(transaction.date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell className="capitalize">{transaction.type}</TableCell>
                    <TableCell>{transaction.product}</TableCell>
                    <TableCell>{transaction.quantity}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryDashboard; 