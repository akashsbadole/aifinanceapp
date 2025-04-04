
import React, { useState } from 'react';
// import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { BarChart4, Download, FileText, PieChart as PieChartIcon } from 'lucide-react';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('financial');

  // Mock data for financial summary
  const financialData = [
    { month: 'Apr', income: 250000, expenses: 180000, profit: 70000 },
    { month: 'May', income: 320000, expenses: 200000, profit: 120000 },
    { month: 'Jun', income: 280000, expenses: 190000, profit: 90000 },
    { month: 'Jul', income: 350000, expenses: 210000, profit: 140000 },
    { month: 'Aug', income: 400000, expenses: 230000, profit: 170000 },
    { month: 'Sep', income: 450000, expenses: 250000, profit: 200000 },
  ];

  // Mock data for expense breakdown
  const expenseData = [
    { name: 'Rent', value: 35000, color: '#3b82f6' },
    { name: 'Salaries', value: 120000, color: '#8b5cf6' },
    { name: 'Marketing', value: 25000, color: '#ec4899' },
    { name: 'Utilities', value: 18000, color: '#10b981' },
    { name: 'Software', value: 22000, color: '#f59e0b' },
    { name: 'Others', value: 30000, color: '#6b7280' },
  ];

  const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN')}`;

  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar /> */}
      <Sidebar />
      
      <main className="ml-2 pt-2 min-h-screen">
        <div className="p-6 max-w-6xl mx-auto animate-on-mount">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Reports</h1>
            <Button className="rounded-full">
              <Download size={16} className="mr-2" />
              Export Reports
            </Button>
          </div>
          
          <Tabs defaultValue="financial" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="glass-effect grid grid-cols-3 w-[400px]">
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="gst">GST</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
            </TabsList>
            
            {/* Financial Reports */}
            <TabsContent value="financial" className="animate-on-mount">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="glass-card hover-float">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₹20,50,000</div>
                    <p className="text-xs text-green-600 mt-1">↑ 15% from last year</p>
                  </CardContent>
                </Card>
                
                <Card className="glass-card hover-float">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₹12,60,000</div>
                    <p className="text-xs text-red-600 mt-1">↑ 8% from last year</p>
                  </CardContent>
                </Card>
                
                <Card className="glass-card hover-float">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₹7,90,000</div>
                    <p className="text-xs text-green-600 mt-1">↑ 22% from last year</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="glass-card mb-6">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <BarChart4 size={18} className="mr-2" />
                    Financial Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={financialData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" />
                        <YAxis tickFormatter={formatCurrency} />
                        <Tooltip 
                          formatter={(value: number) => [formatCurrency(value)]}
                          contentStyle={{
                            borderRadius: 'var(--radius)',
                            border: '1px solid hsl(var(--border))',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            backgroundColor: 'hsl(var(--card))'
                          }}
                          labelStyle={{
                            fontWeight: 'bold',
                            marginBottom: '4px'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="income" name="Income" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Button variant="outline" className="p-6 h-auto justify-start">
                  <FileText size={20} className="mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Profit & Loss Statement</div>
                    <div className="text-sm text-muted-foreground">Statement for FY 2023-24</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="p-6 h-auto justify-start">
                  <FileText size={20} className="mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Balance Sheet</div>
                    <div className="text-sm text-muted-foreground">Statement as of 30th Sept 2023</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="p-6 h-auto justify-start">
                  <FileText size={20} className="mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Cash Flow Statement</div>
                    <div className="text-sm text-muted-foreground">For current quarter</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="p-6 h-auto justify-start">
                  <FileText size={20} className="mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Accounts Receivable Aging</div>
                    <div className="text-sm text-muted-foreground">As of 30th Sept 2023</div>
                  </div>
                </Button>
              </div>
            </TabsContent>
            
            {/* GST Reports */}
            <TabsContent value="gst" className="animate-on-mount">
              <div className="glass-card p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">GST Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Output GST</p>
                    <p className="text-2xl font-bold text-primary">₹68,400</p>
                  </div>
                  <div className="bg-accent p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Input GST</p>
                    <p className="text-2xl font-bold text-muted-foreground">₹36,000</p>
                  </div>
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Net GST Payable</p>
                    <p className="text-2xl font-bold text-primary">₹32,400</p>
                  </div>
                </div>
              </div>
              
              <Card className="glass-card mb-6">
                <CardHeader>
                  <CardTitle>Monthly GST Filings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="pb-2">Period</th>
                          <th className="pb-2">GSTR-1</th>
                          <th className="pb-2">GSTR-3B</th>
                          <th className="pb-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3">September 2023</td>
                          <td className="py-3">Due on 11th Oct</td>
                          <td className="py-3">Due on 20th Oct</td>
                          <td className="py-3">
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded text-xs">
                              Pending
                            </span>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3">August 2023</td>
                          <td className="py-3">Filed on 10th Sep</td>
                          <td className="py-3">Filed on 18th Sep</td>
                          <td className="py-3">
                            <span className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs">
                              Completed
                            </span>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3">July 2023</td>
                          <td className="py-3">Filed on 11th Aug</td>
                          <td className="py-3">Filed on 19th Aug</td>
                          <td className="py-3">
                            <span className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs">
                              Completed
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3">June 2023</td>
                          <td className="py-3">Filed on 10th Jul</td>
                          <td className="py-3">Filed on 20th Jul</td>
                          <td className="py-3">
                            <span className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs">
                              Completed
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Button variant="outline" className="p-6 h-auto justify-start">
                  <FileText size={20} className="mr-3" />
                  <div className="text-left">
                    <div className="font-medium">HSN Summary Report</div>
                    <div className="text-sm text-muted-foreground">For current quarter</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="p-6 h-auto justify-start">
                  <FileText size={20} className="mr-3" />
                  <div className="text-left">
                    <div className="font-medium">GST Input Tax Credit Report</div>
                    <div className="text-sm text-muted-foreground">For current quarter</div>
                  </div>
                </Button>
              </div>
            </TabsContent>
            
            {/* Expense Reports */}
            <TabsContent value="expenses" className="animate-on-mount">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2">
                  <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-lg flex items-center">
                        <BarChart4 size={18} className="mr-2" />
                        Monthly Expenses
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart 
                            data={financialData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                            <XAxis dataKey="month" />
                            <YAxis tickFormatter={formatCurrency} />
                            <Tooltip 
                              formatter={(value: number) => [formatCurrency(value)]}
                              contentStyle={{
                                borderRadius: 'var(--radius)',
                                border: '1px solid hsl(var(--border))',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                backgroundColor: 'hsl(var(--card))'
                              }}
                              labelStyle={{
                                fontWeight: 'bold',
                                marginBottom: '4px'
                              }}
                            />
                            <Legend />
                            <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="glass-card">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                      <PieChartIcon size={18} className="mr-2" />
                      Expense Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={expenseData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {expenseData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: number) => [formatCurrency(value)]}
                            contentStyle={{
                              borderRadius: 'var(--radius)',
                              border: '1px solid hsl(var(--border))',
                              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                              backgroundColor: 'hsl(var(--card))'
                            }}
                          />
                          <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="glass-card mb-6">
                <CardHeader>
                  <CardTitle>Top Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="pb-2">Category</th>
                          <th className="pb-2">This Month</th>
                          <th className="pb-2">Last Month</th>
                          <th className="pb-2">% Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3">Salaries</td>
                          <td className="py-3">₹1,20,000</td>
                          <td className="py-3">₹1,20,000</td>
                          <td className="py-3">0%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3">Rent</td>
                          <td className="py-3">₹35,000</td>
                          <td className="py-3">₹35,000</td>
                          <td className="py-3">0%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3">Marketing</td>
                          <td className="py-3">₹25,000</td>
                          <td className="py-3">₹20,000</td>
                          <td className="py-3 text-green-600">+25%</td>
                        </tr>
                        <tr>
                          <td className="py-3">Software</td>
                          <td className="py-3">₹22,000</td>
                          <td className="py-3">₹18,000</td>
                          <td className="py-3 text-green-600">+22%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Button variant="outline" className="p-6 h-auto justify-start">
                  <FileText size={20} className="mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Expense Category Report</div>
                    <div className="text-sm text-muted-foreground">Detailed breakdown by category</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="p-6 h-auto justify-start">
                  <FileText size={20} className="mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Expense Trend Analysis</div>
                    <div className="text-sm text-muted-foreground">Month-over-month comparison</div>
                  </div>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Reports;
