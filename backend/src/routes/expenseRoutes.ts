import { Router } from 'express';
import { expenseController } from '../controllers/expenseController';

const router = Router();

// Get all expenses with filters
router.get('/', expenseController.getAllExpenses);

// Create new expense
router.post('/', expenseController.createExpense);

// Update expense
router.put('/:id', expenseController.updateExpense);

// Delete expense
router.delete('/:id', expenseController.deleteExpense);

// Get expense summary
router.get('/summary', expenseController.getExpenseSummary);

// Export expenses
router.get('/export', expenseController.exportExpenses);

export default router; 