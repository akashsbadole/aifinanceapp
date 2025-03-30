import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { expenseService } from '@/services/expenseService';
import { categoryService } from '@/services/categoryService';
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
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

interface ExpenseSummary {
  totalAmount: number;
  byCategory: { categoryId: string; total: number }[];
  byPaymentMethod: { method: string; total: number }[];
  monthlyTrend: { month: string; total: number }[];
}

const ExpenseReports: React.FC = () => {
  const [dateRange, setDateRange] = useState('30');
  const [summary, setSummary] = useState<ExpenseSummary>({
    totalAmount: 0,
    byCategory: [],
    byPaymentMethod: [],
    monthlyTrend: [],
  });
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const startDate = getStartDate();
        const { expenses } = await expenseService.getAllExpenses({
          startDate,
          endDate: new Date().toISOString(),
        });
        const categories = await categoryService.getAllCategories();
        setCategories(categories);

        // Calculate monthly trend
        const monthlyData = expenses.reduce((acc: { [key: string]: number }, expense) => {
          const month = format(new Date(expense.date), 'MMM yyyy');
          acc[month] = (acc[month] || 0) + Number(expense.amount);
          return acc;
        }, {});

        const monthlyTrend = Object.entries(monthlyData)
          .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
          .map(([month, total]) => ({
            month,
            total: Number(total),
          }));

        // Calculate category breakdown
        const categoryData = expenses.reduce((acc: { [key: string]: number }, expense) => {
          acc[expense.categoryId] = (acc[expense.categoryId] || 0) + Number(expense.amount);
          return acc;
        }, {});

        const byCategory = Object.entries(categoryData).map(([categoryId, total]) => ({
          categoryId,
          total: Number(total),
        }));

        // Calculate payment method breakdown
        const paymentData = expenses.reduce((acc: { [key: string]: number }, expense) => {
          const method = expense.paymentMethod || 'Other';
          acc[method] = (acc[method] || 0) + Number(expense.amount);
          return acc;
        }, {});

        const byPaymentMethod = Object.entries(paymentData).map(([method, total]) => ({
          method,
          total: Number(total),
        }));

        const totalAmount = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

        setSummary({
          totalAmount,
          byCategory,
          byPaymentMethod,
          monthlyTrend,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch expense summary',
          variant: 'destructive',
        });
      }
    };

    fetchSummary();
  }, [dateRange, toast]);

  const getStartDate = () => {
    const date = new Date();
    date.setDate(date.getDate() - parseInt(dateRange));
    return date.toISOString();
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Expense Reports</h2>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalAmount)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Daily</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.totalAmount / parseInt(dateRange))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.byCategory.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.byPaymentMethod.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Monthly Expense Trend</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={summary.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ fill: '#8884d8' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={summary.byCategory.map(item => ({
                      name: getCategoryName(item.categoryId),
                      value: item.total,
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {summary.byCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses by Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.byPaymentMethod}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="method" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar 
                    dataKey="total" 
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpenseReports; 