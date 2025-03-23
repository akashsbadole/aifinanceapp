
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import InvoiceList from '@/components/invoices/InvoiceList';
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

const Invoices = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock invoices data
  const invoices = [
    { 
      id: '1', 
      invoiceNumber: 'INV-1086', 
      client: 'Tech Solutions Pvt Ltd', 
      amount: 45000, 
      date: '18 Sept 2023', 
      dueDate: '18 Oct 2023', 
      status: 'paid' as const 
    },
    { 
      id: '2', 
      invoiceNumber: 'INV-1085', 
      client: 'Global Innovations', 
      amount: 32000, 
      date: '15 Sept 2023', 
      dueDate: '15 Oct 2023', 
      status: 'pending' as const 
    },
    { 
      id: '3', 
      invoiceNumber: 'INV-1084', 
      client: 'Creative Designs Inc', 
      amount: 28500, 
      date: '10 Sept 2023', 
      dueDate: '10 Oct 2023', 
      status: 'overdue' as const 
    },
    { 
      id: '4', 
      invoiceNumber: 'INV-1083', 
      client: 'Retail Solutions', 
      amount: 54000, 
      date: '05 Sept 2023', 
      dueDate: '05 Oct 2023', 
      status: 'draft' as const 
    },
    { 
      id: '5', 
      invoiceNumber: 'INV-1082', 
      client: 'Marketing Masters', 
      amount: 38000, 
      date: '01 Sept 2023', 
      dueDate: '01 Oct 2023', 
      status: 'paid' as const 
    },
  ];

  // Filter invoices based on search query and status
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      
      <main className="ml-64 pt-16 min-h-screen">
        <div className="p-6 max-w-6xl mx-auto animate-on-mount">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h1 className="text-2xl font-bold">Invoices</h1>
            <Button className="rounded-full">
              <Plus size={16} className="mr-2" />
              Create Invoice
            </Button>
          </div>
          
          <div className="glass-card p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="glass-effect">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <InvoiceList invoices={filteredInvoices} />
          </div>
          
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Invoice Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Paid</p>
                <p className="text-2xl font-bold text-green-600">₹83,000</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">₹32,000</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-red-600">₹28,500</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Invoices;
