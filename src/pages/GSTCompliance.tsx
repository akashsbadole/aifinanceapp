
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Calendar, Check, File, FileText } from 'lucide-react';

const GSTCompliance = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      
      <main className="ml-2 pt-2 min-h-screen">
        <div className="p-6 max-w-6xl mx-auto animate-on-mount">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">GST Compliance</h1>
            <Button className="rounded-full">
              File GST Return
            </Button>
          </div>
          
          <div className="glass-card p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Current Filing Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass-card hover-float">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Calendar size={16} className="mr-2" />
                    Current Period
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">September 2023</div>
                  <p className="text-sm text-muted-foreground">Due on 20th October 2023</p>
                </CardContent>
              </Card>
              
              <Card className="glass-card hover-float">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">GST Payable</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">₹32,400</div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">Completion</span>
                    <span className="text-xs font-medium">65%</span>
                  </div>
                  <Progress value={65} className="h-1 mt-1" />
                </CardContent>
              </Card>
              
              <Card className="glass-card hover-float">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Filing Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="h-4 w-4 rounded-full bg-yellow-400 mr-2"></div>
                    <div className="text-xl font-bold">Pending</div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Records being processed</p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold mb-4">GST Reports</h2>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <FileText size={16} className="mr-2" />
                  GSTR-1 (Outward Supplies)
                  <ArrowRight size={16} className="ml-auto" />
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText size={16} className="mr-2" />
                  GSTR-3B (Monthly Return)
                  <ArrowRight size={16} className="ml-auto" />
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText size={16} className="mr-2" />
                  GST Input Tax Credit
                  <ArrowRight size={16} className="ml-auto" />
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText size={16} className="mr-2" />
                  HSN Summary Report
                  <ArrowRight size={16} className="ml-auto" />
                </Button>
              </div>
            </div>
            
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold mb-4">Filing Checklist</h2>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 mt-0.5 mr-3 flex-shrink-0">
                    <Check size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">All sales invoices recorded</p>
                    <p className="text-xs text-muted-foreground">15 invoices for September</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 mt-0.5 mr-3 flex-shrink-0">
                    <Check size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">All purchase invoices recorded</p>
                    <p className="text-xs text-muted-foreground">28 purchase entries for September</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 mt-0.5 mr-3 flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-yellow-600"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Reconcile input and output tax</p>
                    <p className="text-xs text-muted-foreground">In progress</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground mt-0.5 mr-3 flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Generate GSTR reports</p>
                    <p className="text-xs text-muted-foreground">Not started</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground mt-0.5 mr-3 flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">File GST return</p>
                    <p className="text-xs text-muted-foreground">Not started</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">GST Calendar</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded bg-yellow-100 text-yellow-600 flex items-center justify-center mr-4">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="font-medium">GSTR-1 for September</p>
                    <p className="text-sm text-muted-foreground">Due on 11th October 2023</p>
                  </div>
                </div>
                <div className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded text-sm">
                  Upcoming
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded bg-yellow-100 text-yellow-600 flex items-center justify-center mr-4">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="font-medium">GSTR-3B for September</p>
                    <p className="text-sm text-muted-foreground">Due on 20th October 2023</p>
                  </div>
                </div>
                <div className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded text-sm">
                  Upcoming
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded bg-green-100 text-green-600 flex items-center justify-center mr-4">
                    <File size={18} />
                  </div>
                  <div>
                    <p className="font-medium">GSTR-1 for August</p>
                    <p className="text-sm text-muted-foreground">Filed on 10th September 2023</p>
                  </div>
                </div>
                <div className="bg-green-100 text-green-600 px-3 py-1 rounded text-sm">
                  Completed
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded bg-green-100 text-green-600 flex items-center justify-center mr-4">
                    <File size={18} />
                  </div>
                  <div>
                    <p className="font-medium">GSTR-3B for August</p>
                    <p className="text-sm text-muted-foreground">Filed on 18th September 2023</p>
                  </div>
                </div>
                <div className="bg-green-100 text-green-600 px-3 py-1 rounded text-sm">
                  Completed
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GSTCompliance;
