const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/categories - Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { expenses: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/categories/:id - Get single category
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { expenses: true },
        },
        expenses: {
          orderBy: { date: 'desc' },
          take: 10, // Latest 10 expenses
        },
      },
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// POST /api/categories - Create new category
router.post('/', async (req, res) => {
  try {
    const { name, description, budget } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
        budget: budget ? parseFloat(budget) : null,
      },
      include: {
        _count: {
          select: { expenses: true },
        },
      },
    });

    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Category name already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create category' });
    }
  }
});

// PUT /api/categories/:id - Update category
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, budget } = req.body;

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        description,
        budget: budget ? parseFloat(budget) : null,
      },
      include: {
        _count: {
          select: { expenses: true },
        },
      },
    });

    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Category not found' });
    } else if (error.code === 'P2002') {
      res.status(400).json({ error: 'Category name already exists' });
    } else {
      res.status(500).json({ error: 'Failed to update category' });
    }
  }
});

// DELETE /api/categories/:id - Delete category
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category has expenses
    const expenseCount = await prisma.expense.count({
      where: { categoryId: id },
    });

    if (expenseCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete category with existing expenses',
        expenseCount 
      });
    }

    await prisma.category.delete({
      where: { id },
    });

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Category not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete category' });
    }
  }
});

// GET /api/categories/:id/expenses - Get expenses for a category
router.get('/:id/expenses', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where: { categoryId: id },
        include: {
          category: true,
        },
        orderBy: { date: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.expense.count({
        where: { categoryId: id },
      }),
    ]);

    res.json({
      expenses,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
    });
  } catch (error) {
    console.error('Error fetching category expenses:', error);
    res.status(500).json({ error: 'Failed to fetch category expenses' });
  }
});

module.exports = router;
