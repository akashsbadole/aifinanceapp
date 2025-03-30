import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import MetricCard from '@/components/dashboard/MetricCard';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import FinancialOverview from '@/components/dashboard/FinancialOverview';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, CreditCard, FileText, BarChart4, Plus, ShoppingCart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExpensesList from '@/components/expenses/ExpensesList';
import ExpenseReports from '@/components/expenses/ExpenseReports';
import CategoriesList from '@/components/categories/CategoriesList';
import { expenseService } from '@/services/expenseService';
import { categoryService } from '@/services/categoryService';
import { useToast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalExpenses: 0,
    pendingExpenses: 0,
    categories: 0,
    budgetUsed: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [expenses, categories] = await Promise.all([
          expenseService.getAllExpenses({ limit: 100 }),
          categoryService.getAllCategories(),
        ]);

        const totalExpenses = expenses.expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const pendingExpenses = expenses.expenses.filter(exp => exp.status === 'pending').length;
        const budgetUsed = categories.reduce((sum, cat) => {
          const categoryExpenses = expenses.expenses.filter(exp => exp.categoryId === cat.id);
          const total = categoryExpenses.reduce((s, exp) => s + exp.amount, 0);
          return sum + (cat.budget ? (total / cat.budget) * 100 : 0);
        }, 0) / categories.length;

        setStats({
          totalExpenses,
          pendingExpenses,
          categories: categories.length,
          budgetUsed: Math.round(budgetUsed),
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch dashboard statistics',
          variant: 'destructive',
        });
      }
    };

    fetchStats();
  }, [toast]);

  // Mock financial data
  const financialData = [
    { month: 'Jan', income: 250000, expenses: 180000 },
    { month: 'Feb', income: 320000, expenses: 200000 },
    { month: 'Mar', income: 280000, expenses: 190000 },
    { month: 'Apr', income: 350000, expenses: 210000 },
    { month: 'May', income: 400000, expenses: 230000 },
    { month: 'Jun', income: 450000, expenses: 250000 },
  ];

  // Mock transactions
  const transactions = [
    { id: '1', date: '18 Sept 2023', description: 'Office Supplies', amount: 4500, type: 'expense' as const },
    { id: '2', date: '16 Sept 2023', description: 'Client Payment #INV-1082', amount: 45000, type: 'income' as const },
    { id: '3', date: '14 Sept 2023', description: 'Website Hosting', amount: 2500, type: 'expense' as const },
    { id: '4', date: '10 Sept 2023', description: 'Client Payment #INV-1081', amount: 32000, type: 'income' as const },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      
      <main className="ml-2 pt-2 min-h-screen">
        <div className="p-6 max-w-6xl mx-auto animate-on-mount">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="space-x-2">
              <Button size="sm" variant="outline" className="rounded-full">
                <Plus size={14} className="mr-1" />
                New Invoice
              </Button>
              <Button size="sm" className="rounded-full">
                <Plus size={14} className="mr-1" />
                New Expense
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <MetricCard 
              title="Total Revenue" 
              value="₹5,84,000" 
              delta={{ value: 12.5, isPositive: true }}
              icon={<ArrowUp size={18} />}
            />
            <MetricCard 
              title="Total Expenses" 
              value="₹2,65,000" 
              delta={{ value: 5.3, isPositive: false }}
              icon={<ArrowDown size={18} />}
            />
            <MetricCard 
              title="Outstanding Invoices" 
              value="₹1,35,000" 
              icon={<FileText size={18} />}
            />
            <MetricCard 
              title="GST Payable" 
              value="₹32,400" 
              icon={<BarChart4 size={18} />}
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <FinancialOverview data={financialData} />
            </div>
            <div>
              <RecentTransactions transactions={transactions} />
            </div>
          </div>
          
          <div className="glass-card p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto py-6 flex flex-col items-center premium-transition">
                <FileText className="h-6 w-6 mb-2 text-primary" />
                <span>Create Invoice</span>
              </Button>
              <Button variant="outline" className="h-auto py-6 flex flex-col items-center premium-transition">
                <CreditCard className="h-6 w-6 mb-2 text-primary" />
                <span>Record Expense</span>
              </Button>
              <Button variant="outline" className="h-auto py-6 flex flex-col items-center premium-transition">
                <ShoppingCart className="h-6 w-6 mb-2 text-primary" />
                <span>Create PO</span>
              </Button>
              <Button variant="outline" className="h-auto py-6 flex flex-col items-center premium-transition">
                <BarChart4 className="h-6 w-6 mb-2 text-primary" />
                <span>View Reports</span>
              </Button>
            </div>
          </div>

          <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{stats.totalExpenses.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Total expenses this month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingExpenses}</div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting approval
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.categories}</div>
                  <p className="text-xs text-muted-foreground">
                    Active categories
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Budget Used</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.budgetUsed}%</div>
                  <p className="text-xs text-muted-foreground">
                    Of monthly budget
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Recent Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <ExpensesList />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Expense Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <ExpenseReports />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
