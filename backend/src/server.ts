import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { expenseService } from './services/expenseService';
import { categoryService } from './services/categoryService';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Categories routes
app.get('/api/categories', async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.post('/api/categories', async (req: Request, res: Response) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

app.put('/api/categories/:id', async (req: Request, res: Response) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
});

app.delete('/api/categories/:id', async (req: Request, res: Response) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Expenses routes
app.get('/api/expenses', async (req: Request, res: Response) => {
  try {
    const filters = {
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      categoryId: req.query.categoryId as string,
      search: req.query.search as string,
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
    };
    const result = await expenseService.getAllExpenses(filters);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

app.post('/api/expenses', async (req: Request, res: Response) => {
  try {
    const expense = await expenseService.createExpense({
      ...req.body,
      date: new Date(req.body.date),
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

app.put('/api/expenses/:id', async (req: Request, res: Response) => {
  try {
    const expense = await expenseService.updateExpense(req.params.id, {
      ...req.body,
      date: req.body.date ? new Date(req.body.date) : undefined,
    });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

app.delete('/api/expenses/:id', async (req: Request, res: Response) => {
  try {
    await expenseService.deleteExpense(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// Reports routes
app.get('/api/reports/summary', async (req: Request, res: Response) => {
  try {
    const filters = {
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      categoryId: req.query.categoryId as string,
    };
    const summary = await expenseService.getExpenseSummary(filters);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

app.get('/api/reports/export', async (req: Request, res: Response) => {
  try {
    const filters = {
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      categoryId: req.query.categoryId as string,
    };
    const expenses = await expenseService.exportExpenses(filters);
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export expenses' });
  }
});

// Initialize database with default categories
async function initializeDefaultCategories() {
  const defaultCategories = [
    { name: 'Office Supplies', description: 'General office supplies and materials' },
    { name: 'Travel', description: 'Business travel expenses' },
    { name: 'Marketing', description: 'Marketing and advertising expenses' },
    { name: 'Utilities', description: 'Utility bills and services' },
    { name: 'Equipment', description: 'Office equipment and hardware' },
    { name: 'Software', description: 'Software licenses and subscriptions' },
    { name: 'Other', description: 'Miscellaneous expenses' },
  ];

  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    });
  }
}

// Start server
app.listen(port, async () => {
  console.log(`Server running on port ${port}`);
  await initializeDefaultCategories();
}); 