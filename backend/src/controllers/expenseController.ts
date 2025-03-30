import { Request, Response } from 'express';
import { expenseService } from '../services/expenseService';

export const expenseController = {
  async getAllExpenses(req: Request, res: Response) {
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
  },

  async createExpense(req: Request, res: Response) {
    try {
      const expense = await expenseService.createExpense({
        ...req.body,
        date: new Date(req.body.date),
      });
      res.status(201).json(expense);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create expense' });
    }
  },

  async updateExpense(req: Request, res: Response) {
    try {
      const expense = await expenseService.updateExpense(req.params.id, {
        ...req.body,
        date: req.body.date ? new Date(req.body.date) : undefined,
      });
      res.json(expense);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update expense' });
    }
  },

  async deleteExpense(req: Request, res: Response) {
    try {
      await expenseService.deleteExpense(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete expense' });
    }
  },

  async getExpenseSummary(req: Request, res: Response) {
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
  },

  async exportExpenses(req: Request, res: Response) {
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
  },
}; 