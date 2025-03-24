import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const categoryService = {
  async getAllCategories() {
    return prisma.category.findMany({
      include: {
        _count: {
          select: { expenses: true }
        }
      }
    });
  },

  async createCategory(data: { name: string; description?: string; budget?: number }) {
    return prisma.category.create({
      data
    });
  },

  async updateCategory(id: string, data: { name?: string; description?: string; budget?: number }) {
    return prisma.category.update({
      where: { id },
      data
    });
  },

  async deleteCategory(id: string) {
    return prisma.category.delete({
      where: { id }
    });
  },

  async getCategoryWithExpenses(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        expenses: {
          orderBy: { date: 'desc' }
        }
      }
    });
  }
}; 