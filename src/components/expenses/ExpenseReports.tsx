import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { expenseService } from '@/services/expenseService';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

interface ExpenseSummary {
  total: number;
  byCategory: { categoryId: string; total: number }[];
  byPaymentMethod: { method: string; total: number }[];
}

const ExpenseReports: React.FC = () => {
  const [summary, setSummary] = useState<ExpenseSummary>({
    total: 0,
    byCategory: [],
    byPaymentMethod: [],
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('month');
  const { toast } = useToast();

  useEffect(() => {
    fetchSummary();
  }, [dateRange]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const data = await expenseService.getExpenseSummary({
        startDate: getStartDate(),
        endDate: format(new Date(), 'yyyy-MM-dd'),
      });
      setSummary(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch expense summary',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStartDate = () => {
    const now = new Date();
    switch (dateRange) {
      case 'week':
        return format(new Date(now.setDate(now.getDate() - 7)), 'yyyy-MM-dd');
      case 'month':
        return format(new Date(now.setMonth(now.getMonth() - 1)), 'yyyy-MM-dd');
      case 'year':
        return format(new Date(now.setFullYear(now.getFullYear() - 1)), 'yyyy-MM-dd');
      default:
        return format(new Date(now.setMonth(now.getMonth() - 1)), 'yyyy-MM-dd');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const totalExpenses = summary.total || 0;
  const highestCategory = summary.byCategory.reduce((max, category) => 
    category.total > (max.total || 0) ? category : max, 
    { categoryId: '', total: 0 }
  );

  const lowestCategory = summary.byCategory.reduce((min, category) => 
    category.total < (min.total || 0) ? category : min, 
    { categoryId: '', total: Infinity }
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Total Expenses</h3>
        <div className="text-2xl font-bold">₹{totalExpenses.toLocaleString()}</div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Highest Category: {highestCategory.categoryId}</span>
            <span>₹{highestCategory.total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>Lowest Category: {lowestCategory.categoryId}</span>
            <span>₹{lowestCategory.total.toLocaleString()}</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Category Breakdown</h4>
          <div className="space-y-2">
            {summary.byCategory.map((category) => (
              <div key={category.categoryId} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{category.categoryId}</span>
                  <span>₹{category.total.toLocaleString()}</span>
                </div>
                <Progress 
                  value={((category.total / totalExpenses) * 100) || 0} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Payment Method Breakdown</h4>
          <div className="space-y-2">
            {summary.byPaymentMethod.map((method) => (
              <div key={method.method} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{method.method}</span>
                  <span>₹{method.total.toLocaleString()}</span>
                </div>
                <Progress 
                  value={((method.total / totalExpenses) * 100) || 0} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseReports; 