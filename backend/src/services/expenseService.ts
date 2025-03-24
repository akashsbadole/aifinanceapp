import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ExpenseFilters {
  startDate?: Date;
  endDate?: Date;
  categoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface ExpenseSummary {
  total: number;
  byCategory: { categoryId: string; total: number }[];
  byPaymentMethod: { method: string; total: number }[];
}

export const expenseService = {
  async getAllExpenses(filters: ExpenseFilters = {}) {
    const {
      startDate,
      endDate,
      categoryId,
      search,
      page = 1,
      limit = 10
    } = filters;

    const where = {
      AND: [
        startDate ? { date: { gte: startDate } } : {},
        endDate ? { date: { lte: endDate } } : {},
        categoryId ? { categoryId } : {},
        search ? {
          OR: [
            { description: { contains: search, mode: 'insensitive' } },
            { vendor: { contains: search, mode: 'insensitive' } },
            { category: { name: { contains: search, mode: 'insensitive' } } }
          ]
        } : {}
      ]
    };

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        include: {
          category: true
        },
        orderBy: { date: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.expense.count({ where })
    ]);

    return {
      expenses,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  },

  async createExpense(data: {
    amount: number;
    categoryId: string;
    date: Date;
    vendor?: string;
    description?: string;
    paymentMethod?: string;
    hasReceipt?: boolean;
    status?: string;
  }) {
    return prisma.expense.create({
      data,
      include: {
        category: true
      }
    });
  },

  async updateExpense(id: string, data: {
    amount?: number;
    categoryId?: string;
    date?: Date;
    vendor?: string;
    description?: string;
    paymentMethod?: string;
    hasReceipt?: boolean;
    status?: string;
  }) {
    return prisma.expense.update({
      where: { id },
      data,
      include: {
        category: true
      }
    });
  },

  async deleteExpense(id: string) {
    return prisma.expense.delete({
      where: { id }
    });
  },

  async getExpenseSummary(filters: ExpenseFilters = {}): Promise<ExpenseSummary> {
    const { startDate, endDate, categoryId } = filters;
    const where = {
      AND: [
        startDate ? { date: { gte: startDate } } : {},
        endDate ? { date: { lte: endDate } } : {},
        categoryId ? { categoryId } : {}
      ]
    };

    const expenses = await prisma.expense.findMany({
      where,
      select: {
        amount: true,
        categoryId: true,
        paymentMethod: true
      }
    });

    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const byCategory = expenses.reduce((acc, expense) => {
      const existing = acc.find(item => item.categoryId === expense.categoryId);
      if (existing) {
        existing.total += expense.amount;
      } else {
        acc.push({ categoryId: expense.categoryId, total: expense.amount });
      }
      return acc;
    }, [] as { categoryId: string; total: number }[]);

    const byPaymentMethod = expenses.reduce((acc, expense) => {
      if (!expense.paymentMethod) return acc;
      const existing = acc.find(item => item.method === expense.paymentMethod);
      if (existing) {
        existing.total += expense.amount;
      } else {
        acc.push({ method: expense.paymentMethod, total: expense.amount });
      }
      return acc;
    }, [] as { method: string; total: number }[]);

    return {
      total,
      byCategory,
      byPaymentMethod
    };
  },

  async exportExpenses(filters: ExpenseFilters = {}) {
    const { startDate, endDate, categoryId } = filters;
    const where = {
      AND: [
        startDate ? { date: { gte: startDate } } : {},
        endDate ? { date: { lte: endDate } } : {},
        categoryId ? { categoryId } : {}
      ]
    };

    return prisma.expense.findMany({
      where,
      include: {
        category: true
      },
      orderBy: { date: 'desc' }
    });
  }
}; 