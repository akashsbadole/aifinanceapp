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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Category, categoryService } from '@/services/categoryService';
import { useToast } from '@/components/ui/use-toast';
import { Plus } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  budget: z.string().optional(),
});

interface CategoryFormProps {
  category?: Category;
  onSuccess: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
      budget: category?.budget?.toString() || '',
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        description: category.description || '',
        budget: category.budget?.toString() || '',
      });
    }
  }, [category, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const categoryData = {
        ...values,
        budget: values.budget ? parseFloat(values.budget) : undefined,
      };

      if (category) {
        await categoryService.updateCategory(category.id, categoryData);
        toast({
          title: 'Success',
          description: 'Category updated successfully',
        });
      } else {
        await categoryService.createCategory(categoryData);
        toast({
          title: 'Success',
          description: 'Category created successfully',
        });
      }
      setOpen(false);
      onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${category ? 'update' : 'create'} category`,
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {category ? 'Edit Category' : 'Add Category'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{category ? 'Edit Category' : 'Add New Category'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category name" {...field} />
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
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter budget amount" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {category ? 'Update Category' : 'Add Category'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryForm; 