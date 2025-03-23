
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import ExpensesList from '@/components/expenses/ExpensesList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';

const Expenses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Mock expenses data
  const expenses = [
    { 
      id: '1', 
      description: 'Office Rent', 
      category: 'Rent', 
      amount: 35000, 
      date: '01 Sept 2023', 
      hasReceipt: true, 
      status: 'approved' as const 
    },
    { 
      id: '2', 
      description: 'Internet Bill', 
      category: 'Utilities', 
      amount: 2500, 
      date: '05 Sept 2023', 
      hasReceipt: true, 
      status: 'approved' as const 
    },
    { 
      id: '3', 
      description: 'Office Supplies', 
      category: 'Supplies', 
      amount: 4500, 
      date: '10 Sept 2023', 
      hasReceipt: false, 
      status: 'pending' as const 
    },
    { 
      id: '4', 
      description: 'Team Lunch', 
      category: 'Meals', 
      amount: 3200, 
      date: '15 Sept 2023', 
      hasReceipt: true, 
      status: 'pending' as const 
    },
    { 
      id: '5', 
      description: 'Software Subscription', 
      category: 'Software', 
      amount: 9800, 
      date: '18 Sept 2023', 
      hasReceipt: true, 
      status: 'approved' as const 
    },
  ];

  // Get unique categories for filter
  const categories = ['all', ...new Set(expenses.map(expense => expense.category))];

  // Filter expenses based on search query and category
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = 
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      
      <main className="ml-64 pt-16 min-h-screen">
        <div className="p-6 max-w-6xl mx-auto animate-on-mount">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h1 className="text-2xl font-bold">Expenses</h1>
            <Button className="rounded-full">
              <Plus size={16} className="mr-2" />
              Record Expense
            </Button>
          </div>
          
          <div className="glass-card p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select 
                value={categoryFilter} 
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent className="glass-effect">
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <ExpensesList expenses={filteredExpenses} />
          </div>
          
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Expense Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-primary">₹55,000</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">₹47,300</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">₹7,700</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Expenses;
