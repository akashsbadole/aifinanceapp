import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Expense, expenseService } from '@/services/expenseService';
import { Category, categoryService } from '@/services/categoryService';
import { useToast } from '@/components/ui/use-toast';
import { Plus } from 'lucide-react';

const formSchema = z.object({
  amount: z.string().min(1, 'Amount is required'),
  categoryId: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  vendor: z.string().optional(),
  description: z.string().optional(),
  paymentMethod: z.string().optional(),
  hasReceipt: z.boolean(),
  status: z.enum(['approved', 'pending', 'rejected']),
});

interface ExpenseFormProps {
  expense?: Expense;
  onSuccess: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ expense, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: expense?.amount.toString() || '',
      categoryId: expense?.categoryId || '',
      date: expense ? new Date(expense.date).toISOString().split('T')[0] : '',
      vendor: expense?.vendor || '',
      description: expense?.description || '',
      paymentMethod: expense?.paymentMethod || '',
      hasReceipt: expense?.hasReceipt || false,
      status: expense?.status || 'pending',
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch categories',
          variant: 'destructive',
        });
      }
    };
    fetchCategories();
  }, [toast]);

  useEffect(() => {
    if (expense) {
      form.reset({
        amount: expense.amount.toString(),
        categoryId: expense.categoryId,
        date: new Date(expense.date).toISOString().split('T')[0],
        vendor: expense.vendor || '',
        description: expense.description || '',
        paymentMethod: expense.paymentMethod || '',
        hasReceipt: expense.hasReceipt,
        status: expense.status,
      });
      setOpen(true);
    }
  }, [expense, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const expenseData = {
        amount: parseFloat(values.amount),
        categoryId: values.categoryId,
        date: values.date,
        vendor: values.vendor || '',
        description: values.description || '',
        paymentMethod: values.paymentMethod || '',
        hasReceipt: values.hasReceipt,
        status: values.status,
      };

      if (expense) {
        await expenseService.updateExpense(expense.id, expenseData);
        toast({
          title: 'Success',
          description: 'Expense updated successfully',
        });
      } else {
        await expenseService.createExpense(expenseData);
        toast({
          title: 'Success',
          description: 'Expense created successfully',
        });
      }
      setOpen(false);
      onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${expense ? 'update' : 'create'} expense`,
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {expense ? 'Edit Expense' : 'Add Expense'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{expense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter amount" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vendor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor/Payee</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter vendor/payee name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="credit">Credit Card</SelectItem>
                      <SelectItem value="debit">Debit Card</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hasReceipt"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Has Receipt</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {expense ? 'Update Expense' : 'Add Expense'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseForm; 