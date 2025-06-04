import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const stockAdjustmentSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  type: z.enum(["addition", "removal", "damage"]),
  quantity: z.number().min(1, "Quantity must be positive"),
  reason: z.string().optional(),
});

interface StockTransaction {
  id: string;
  productId: string;
  product: {
    name: string;
    sku: string;
  };
  type: "addition" | "removal" | "damage";
  quantity: number;
  reason?: string;
  transactionDate: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  stockQuantity: number;
}

export default function StockManagement() {
  const [transactions, setTransactions] = useState<StockTransaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof stockAdjustmentSchema>>({
    resolver: zodResolver(stockAdjustmentSchema),
    defaultValues: {
      productId: "",
      type: "addition",
      quantity: 1,
      reason: "",
    },
  });

  useEffect(() => {
    fetchTransactions();
    fetchProducts();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        "http://localhost:3002/api/inventory/stock-transactions"
      );
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      toast.error("Failed to fetch stock transactions");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:3002/api/inventory/products"
      );
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast.error("Failed to fetch products");
    }
  };

  const onSubmit = async (values: z.infer<typeof stockAdjustmentSchema>) => {
    try {
      await fetch("http://localhost:3002/api/inventory/stock-adjustments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      toast.success("Stock adjusted successfully");
      setIsDialogOpen(false);
      form.reset();
      fetchTransactions();
      fetchProducts();
    } catch (error) {
      toast.error("Failed to adjust stock");
    }
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "addition":
        return "text-green-600";
      case "removal":
        return "text-red-600";
      case "damage":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Stock Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Adjust Stock</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adjust Stock</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="">Select a product</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} (SKU: {product.sku}) - Current
                              Stock: {product.stockQuantity}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adjustment Type</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="addition">Addition</option>
                          <option value="removal">Removal</option>
                          <option value="damage">Damage</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(
                              value === "" ? 1 : parseInt(value) || 1
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Adjust Stock
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {products.map((product) => (
          <div key={product.id} className="p-4 border rounded-lg shadow-sm">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-500">SKU: {product.sku}</p>
            <p
              className={`text-lg font-bold ${
                product.stockQuantity <= product.minimumStock
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              Stock: {product.stockQuantity}
            </p>
            <p className="text-sm text-gray-500">
              Minimum Stock: {product.minimumStock}
            </p>
          </div>
        ))}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Reason</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                {new Date(transaction.transactionDate).toLocaleString()}
              </TableCell>
              <TableCell>
                {transaction.product.name} (SKU: {transaction.product.sku})
              </TableCell>
              <TableCell className={getTransactionTypeColor(transaction.type)}>
                {transaction.type.charAt(0).toUpperCase() +
                  transaction.type.slice(1)}
              </TableCell>
              <TableCell>{transaction.quantity}</TableCell>
              <TableCell>{transaction.reason || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
