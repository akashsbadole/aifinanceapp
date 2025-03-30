import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const inventoryService = {
  // Product operations
  async getAllProducts() {
    return await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getProductById(id: string) {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        stockTransactions: true,
      },
    });
  },

  async createProduct(data: {
    name: string;
    sku: string;
    description?: string;
    categoryId: string;
    purchasePrice: number;
    sellingPrice: number;
    stockQuantity: number;
    minimumStock: number;
    location?: string;
  }) {
    return await prisma.product.create({
      data,
      include: {
        category: true,
      },
    });
  },

  async updateProduct(id: string, data: {
    name?: string;
    sku?: string;
    description?: string;
    categoryId?: string;
    purchasePrice?: number;
    sellingPrice?: number;
    stockQuantity?: number;
    minimumStock?: number;
    location?: string;
  }) {
    return await prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  },

  async deleteProduct(id: string) {
    return await prisma.product.delete({
      where: { id },
    });
  },

  // Stock operations
  async getAllStockTransactions() {
    return await prisma.stockTransaction.findMany({
      include: {
        product: true,
      },
      orderBy: { transactionDate: 'desc' },
    });
  },

  async getProductTransactions(productId: string) {
    return await prisma.stockTransaction.findMany({
      where: { productId },
      include: {
        product: true,
      },
      orderBy: { transactionDate: 'desc' },
    });
  },

  async adjustStock(data: {
    productId: string;
    type: 'addition' | 'removal' | 'damage';
    quantity: number;
    reason?: string;
  }) {
    const { productId, type, quantity, reason } = data;
    // Start a transaction
    return await prisma.$transaction(async (tx: PrismaClient) => {
      // Create stock transaction
      const transaction = await tx.stockTransaction.create({
        data: {
          productId,
          type,
          quantity,
          reason,
        },
        include: {
          product: true,
        },
      });

      // Update product stock quantity
      const product = await tx.product.findUnique({
        where: { id: productId },
      });

      if (product) {
        const newQuantity = type === 'addition'
          ? product.stockQuantity + quantity
          : product.stockQuantity - quantity;

        await tx.product.update({
          where: { id: productId },
          data: { stockQuantity: newQuantity },
        });
      }

      return transaction;
    });
  },

  // Sales operations
  async getAllSales() {
    return await prisma.sale.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { saleDate: 'desc' },
    });
  },

  async getSaleById(id: string) {
    return await prisma.sale.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  },

  async createSale(data: {
    customerName: string;
    customerPhone?: string;
    totalAmount: number;
    paymentMethod: string;
    status?: string;
    items: {
      productId: string;
      quantity: number;
      price: number;
      total: number;
    }[];
  }) {
    return await prisma.$transaction(async (tx: PrismaClient) => {
      // Create sale
      const sale = await tx.sale.create({
        data: {
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          totalAmount: data.totalAmount,
          paymentMethod: data.paymentMethod,
          status: data.status || 'completed',
          items: {
            create: data.items,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // Update product stock quantities
      for (const item of data.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (product) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stockQuantity: product.stockQuantity - item.quantity,
            },
          });
        }
      }

      return sale;
    });
  },

  // Category operations
  async getAllCategories() {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  },

  async createCategory(data: {
    name: string;
    description?: string;
  }) {
    return await prisma.category.create({
      data,
    });
  },

  async updateCategory(id: string, data: {
    name?: string;
    description?: string;
  }) {
    return await prisma.category.update({
      where: { id },
      data,
    });
  },

  async deleteCategory(id: string) {
    return await prisma.category.delete({
      where: { id },
    });
  },
}; 