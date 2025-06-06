const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/expenses - Get all expenses with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { search, categoryId, startDate, endDate, page = 1, limit = 10 } = req.query;
    
    const where = {};
    
    if (search) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { vendor: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (categoryId && categoryId !== 'all') {
      where.categoryId = categoryId;
    }
    
    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: { date: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.expense.count({ where }),
    ]);

    res.json({
      expenses,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// GET /api/expenses/export - Export expenses to CSV
router.get('/export', async (req, res) => {
  try {
    const { search, categoryId, startDate, endDate } = req.query;
    
    const where = {};
    
    if (search) {
      where.OR = [
        { description: { contains: search, mode: 'insensitive' } },
        { vendor: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (categoryId && categoryId !== 'all') {
      where.categoryId = categoryId;
    }
    
    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    const expenses = await prisma.expense.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { date: 'desc' },
    });

    res.json(expenses);
  } catch (error) {
    console.error('Error exporting expenses:', error);
    res.status(500).json({ error: 'Failed to export expenses' });
  }
});

// GET /api/expenses/:id - Get single expense
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const expense = await prisma.expense.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    console.error('Error fetching expense:', error);
    res.status(500).json({ error: 'Failed to fetch expense' });
  }
});

// POST /api/expenses - Create new expense
router.post('/', async (req, res) => {
  try {
    const expenseData = req.body;
    
    // Validate required fields
    if (!expenseData.amount || !expenseData.categoryId || !expenseData.date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Convert date string to Date object
    if (expenseData.date) {
      expenseData.date = new Date(expenseData.date);
    }

    const expense = await prisma.expense.create({
      data: expenseData,
      include: {
        category: true,
      },
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

// PUT /api/expenses/:id - Update expense
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const expenseData = req.body;

    // Convert date string to Date object
    if (expenseData.date) {
      expenseData.date = new Date(expenseData.date);
    }

    const expense = await prisma.expense.update({
      where: { id },
      data: expenseData,
      include: {
        category: true,
      },
    });

    res.json(expense);
  } catch (error) {
    console.error('Error updating expense:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Expense not found' });
    } else {
      res.status(500).json({ error: 'Failed to update expense' });
    }
  }
});

// DELETE /api/expenses/:id - Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.expense.delete({
      where: { id },
    });

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Expense not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete expense' });
    }
  }
});

module.exports = router;
