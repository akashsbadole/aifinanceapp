import { useEffect, useState } from "react";
import MetricCard from "@/components/dashboard/MetricCard";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import FinancialOverview from "@/components/dashboard/FinancialOverview";
import { Button } from "@/components/ui/button";
import {
  ArrowUp,
  ArrowDown,
  CreditCard,
  FileText,
  BarChart4,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ExpensesList from "@/components/expenses/ExpensesList";
import ExpenseReports from "@/components/expenses/ExpenseReports";
import { expenseService } from "@/services/expenseService";
import { categoryService } from "@/services/categoryService";
import { useToast } from "@/components/ui/use-toast";

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

        const totalExpenses = expenses.expenses.reduce(
          (sum, exp) => sum + exp.amount,
          0
        );
        const pendingExpenses = expenses.expenses.filter(
          (exp) => exp.status === "pending"
        ).length;
        const budgetUsed =
          categories.reduce((sum, cat) => {
            const categoryExpenses = expenses.expenses.filter(
              (exp) => exp.categoryId === cat.id
            );
            const total = categoryExpenses.reduce(
              (s, exp) => s + exp.amount,
              0
            );
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
          title: "Error",
          description: "Failed to fetch dashboard statistics",
          variant: "destructive",
        });
      }
    };

    fetchStats();
  }, [toast]);

  // Mock financial data
  const financialData = [
    { month: "Jan", income: 250000, expenses: 180000 },
    { month: "Feb", income: 320000, expenses: 200000 },
    { month: "Mar", income: 280000, expenses: 190000 },
    { month: "Apr", income: 350000, expenses: 210000 },
    { month: "May", income: 400000, expenses: 230000 },
    { month: "Jun", income: 450000, expenses: 250000 },
  ];

  // Mock transactions
  const transactions = [
    {
      id: "1",
      date: "18 Sept 2023",
      description: "Office Supplies",
      amount: 4500,
      type: "expense" as const,
    },
    {
      id: "2",
      date: "16 Sept 2023",
      description: "Client Payment #INV-1082",
      amount: 45000,
      type: "income" as const,
    },
    {
      id: "3",
      date: "14 Sept 2023",
      description: "Website Hosting",
      amount: 2500,
      type: "expense" as const,
    },
    {
      id: "4",
      date: "10 Sept 2023",
      description: "Client Payment #INV-1081",
      amount: 32000,
      type: "income" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's your business overview.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            size="sm"
            variant="outline"
            className="w-full sm:w-auto bg-white border-gray-200 hover:bg-gray-50"
          >
            <Plus size={14} className="mr-2" />
            New Invoice
          </Button>
          <Button
            size="sm"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            <Plus size={14} className="mr-2" />
            New Expense
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Total Revenue"
          value="₹5,84,000"
          delta={{ value: 12.5, isPositive: true }}
          icon={<ArrowUp size={16} />}
          className="bg-white border border-gray-200 shadow-sm hover:shadow-md"
        />
        <MetricCard
          title="Total Expenses"
          value="₹2,65,000"
          delta={{ value: 5.3, isPositive: false }}
          icon={<ArrowDown size={16} />}
          className="bg-white border border-gray-200 shadow-sm hover:shadow-md"
        />
        <MetricCard
          title="Outstanding Invoices"
          value="₹1,35,000"
          icon={<FileText size={16} />}
          className="bg-white border border-gray-200 shadow-sm hover:shadow-md"
        />
        <MetricCard
          title="GST Payable"
          value="₹32,400"
          icon={<BarChart4 size={16} />}
          className="bg-white border border-gray-200 shadow-sm hover:shadow-md"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <FinancialOverview data={financialData} />
          </div>
        </div>
        <div className="xl:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <RecentTransactions transactions={transactions} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-auto py-6 flex flex-col items-center gap-3 border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all"
          >
            <FileText className="h-6 w-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              Create Invoice
            </span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-6 flex flex-col items-center gap-3 border-gray-200 hover:bg-green-50 hover:border-green-300 transition-all"
          >
            <CreditCard className="h-6 w-6 text-green-600" />
            <span className="text-sm font-medium text-gray-700">
              Record Expense
            </span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-6 flex flex-col items-center gap-3 border-gray-200 hover:bg-purple-50 hover:border-purple-300 transition-all"
          >
            <ShoppingCart className="h-6 w-6 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Create PO</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-6 flex flex-col items-center gap-3 border-gray-200 hover:bg-orange-50 hover:border-orange-300 transition-all"
          >
            <BarChart4 className="h-6 w-6 text-orange-600" />
            <span className="text-sm font-medium text-gray-700">
              View Reports
            </span>
          </Button>
        </div>
      </div>

      {/* Expense Statistics */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                ₹{stats.totalExpenses.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Total expenses this month
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.pendingExpenses}
              </div>
              <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.categories}
              </div>
              <p className="text-xs text-gray-500 mt-1">Active categories</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Budget Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {stats.budgetUsed}%
              </div>
              <p className="text-xs text-gray-500 mt-1">Of monthly budget</p>
            </CardContent>
          </Card>
        </div>

        {/* Expense Details */}
        <div className="grid grid-cols-1 xl:grid-cols-7 gap-6">
          <Card className="xl:col-span-4 bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Recent Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ExpensesList />
            </CardContent>
          </Card>
          <Card className="xl:col-span-3 bg-white border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Expense Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseReports />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
