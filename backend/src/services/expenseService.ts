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

interface CategoryBreakdown {
  categoryId: string;
  _sum: { amount: number | null };
  _count: number;
}

interface MonthlyTrend {
  date: Date;
  _sum: { amount: number | null };
  _count: number;
}

interface ExpenseSummary {
  total: number;
  byCategory: { categoryId: string; total: number }[];
  byPaymentMethod: { method: string; total: number }[];
}

export const expenseService = {
  async getAllExpenses(filters: ExpenseFilters) {
    const {
      startDate,
      endDate,
      categoryId,
      search,
      page = 1,
      limit = 10,
    } = filters;

    const where = {
      AND: [
        startDate ? { date: { gte: startDate } } : {},
        endDate ? { date: { lte: endDate } } : {},
        categoryId ? { categoryId } : {},
        search
          ? {
              OR: [
                { description: { contains: search, mode: 'insensitive' } },
                { vendor: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
      ],
    };

    const [total, expenses] = await Promise.all([
      prisma.expense.count({ where }),
      prisma.expense.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: { date: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return {
      expenses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
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
    return await prisma.expense.create({
      data,
      include: {
        category: true,
      },
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
    return await prisma.expense.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  },

  async deleteExpense(id: string) {
    return await prisma.expense.delete({
      where: { id },
    });
  },

  async getExpenseSummary(filters: {
    startDate?: Date;
    endDate?: Date;
    categoryId?: string;
  }) {
    const { startDate, endDate, categoryId } = filters;

    const where = {
      AND: [
        startDate ? { date: { gte: startDate } } : {},
        endDate ? { date: { lte: endDate } } : {},
        categoryId ? { categoryId } : {},
      ],
    };

    const [totalAmount, categoryBreakdown, monthlyTrend] = await Promise.all([
      // Total amount
      prisma.expense.aggregate({
        where,
        _sum: { amount: true },
      }),

      // Category breakdown
      prisma.expense.groupBy({
        by: ['categoryId'],
        where,
        _sum: { amount: true },
        _count: true,
      }),

      // Monthly trend
      prisma.expense.groupBy({
        by: ['date'],
        where,
        _sum: { amount: true },
        _count: true,
        orderBy: { date: 'asc' },
      }),
    ]);

    // Get category names for the breakdown
    const categoryIds = categoryBreakdown.map((cb: CategoryBreakdown) => cb.categoryId);
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
    });

    const categoryBreakdownWithNames = categoryBreakdown.map((cb: CategoryBreakdown) => ({
      ...cb,
      categoryName: categories.find((c: { id: string; name: string }) => c.id === cb.categoryId)?.name || 'Unknown',
    }));

    return {
      totalAmount: totalAmount._sum.amount || 0,
      categoryBreakdown: categoryBreakdownWithNames,
      monthlyTrend,
    };
  },

  async exportExpenses(filters: {
    startDate?: Date;
    endDate?: Date;
    categoryId?: string;
  }) {
    const { startDate, endDate, categoryId } = filters;

    const where = {
      AND: [
        startDate ? { date: { gte: startDate } } : {},
        endDate ? { date: { lte: endDate } } : {},
        categoryId ? { categoryId } : {},
      ],
    };

    return await prisma.expense.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { date: 'desc' },
    });
  },
}; 