import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExpensesList from './ExpensesList';
import ExpenseReports from './ExpenseReports';
import CategoriesList from '../categories/CategoriesList';

const ExpenseManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Expense Management</h1>
      </div>
      
      <Tabs defaultValue="expenses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="expenses" className="space-y-4">
          <ExpensesList />
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <ExpenseReports />
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          <CategoriesList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExpenseManagement; 