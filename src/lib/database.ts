import { PrismaClient } from "@prisma/client";

// Global instance to prevent multiple connections in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Database service functions
export class DatabaseService {
  // Business Profile operations
  static async createBusinessProfile(data: {
    companyName: string;
    companyAddress: string;
    phone?: string;
    email?: string;
    website?: string;
    gstin?: string;
    logo?: string;
    isDefault?: boolean;
  }) {
    return await prisma.businessProfile.create({
      data,
    });
  }

  static async getBusinessProfiles() {
    return await prisma.businessProfile.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateBusinessProfile(
    id: string,
    data: Partial<{
      companyName: string;
      companyAddress: string;
      phone: string;
      email: string;
      website: string;
      gstin: string;
      logo: string;
      isDefault: boolean;
    }>
  ) {
    return await prisma.businessProfile.update({
      where: { id },
      data,
    });
  }

  static async deleteBusinessProfile(id: string) {
    return await prisma.businessProfile.delete({
      where: { id },
    });
  }

  // Category operations
  static async createCategory(data: {
    name: string;
    description?: string;
    budget?: number;
  }) {
    return await prisma.category.create({
      data,
    });
  }

  static async getCategories() {
    return await prisma.category.findMany({
      include: {
        _count: {
          select: { expenses: true },
        },
      },
      orderBy: { name: "asc" },
    });
  }

  static async updateCategory(
    id: string,
    data: Partial<{
      name: string;
      description: string;
      budget: number;
    }>
  ) {
    return await prisma.category.update({
      where: { id },
      data,
    });
  }

  static async deleteCategory(id: string) {
    return await prisma.category.delete({
      where: { id },
    });
  }

  // Expense operations
  static async createExpense(data: {
    amount: number;
    description?: string;
    vendor?: string;
    date: Date;
    paymentMethod?: string;
    status?: string;
    hasReceipt?: boolean;
    receiptUrl?: string;
    categoryId: string;
  }) {
    return await prisma.expense.create({
      data,
      include: {
        category: true,
      },
    });
  }

  static async getExpenses(filters?: {
    search?: string;
    categoryId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) {
    const where: any = {};

    if (filters?.search) {
      where.OR = [
        { description: { contains: filters.search, mode: "insensitive" } },
        { vendor: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters?.startDate || filters?.endDate) {
      where.date = {};
      if (filters.startDate) {
        where.date.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.date.lte = new Date(filters.endDate);
      }
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: { date: "desc" },
        skip,
        take: limit,
      }),
      prisma.expense.count({ where }),
    ]);

    return {
      expenses,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  static async updateExpense(
    id: string,
    data: Partial<{
      amount: number;
      description: string;
      vendor: string;
      date: Date;
      paymentMethod: string;
      status: string;
      hasReceipt: boolean;
      receiptUrl: string;
      categoryId: string;
    }>
  ) {
    return await prisma.expense.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  }

  static async deleteExpense(id: string) {
    return await prisma.expense.delete({
      where: { id },
    });
  }

  // Invoice operations
  static async createInvoice(data: {
    invoiceNumber: string;
    clientName: string;
    clientEmail?: string;
    clientAddress: string;
    dueDate: Date;
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    discount: number;
    total: number;
    status?: string;
    notes?: string;
    terms?: string;
    businessProfileId?: string;
    items: Array<{
      description: string;
      quantity: number;
      rate: number;
      amount: number;
      unit?: string;
    }>;
  }) {
    const { items, ...invoiceData } = data;

    return await prisma.invoice.create({
      data: {
        ...invoiceData,
        items: {
          create: items,
        },
      },
      include: {
        items: true,
        businessProfile: true,
      },
    });
  }

  static async getInvoices(filters?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const where: any = {};

    if (filters?.search) {
      where.OR = [
        { invoiceNumber: { contains: filters.search, mode: "insensitive" } },
        { clientName: { contains: filters.search, mode: "insensitive" } },
        { clientEmail: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          items: true,
          businessProfile: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.invoice.count({ where }),
    ]);

    return {
      invoices,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  static async updateInvoice(
    id: string,
    data: Partial<{
      invoiceNumber: string;
      clientName: string;
      clientEmail: string;
      clientAddress: string;
      dueDate: Date;
      subtotal: number;
      taxRate: number;
      taxAmount: number;
      discount: number;
      total: number;
      status: string;
      notes: string;
      terms: string;
      businessProfileId: string;
    }>
  ) {
    return await prisma.invoice.update({
      where: { id },
      data,
      include: {
        items: true,
        businessProfile: true,
      },
    });
  }

  static async deleteInvoice(id: string) {
    return await prisma.invoice.delete({
      where: { id },
    });
  }

  // Settings operations
  static async getSetting(key: string) {
    return await prisma.settings.findUnique({
      where: { key },
    });
  }

  static async setSetting(key: string, value: string, description?: string) {
    return await prisma.settings.upsert({
      where: { key },
      update: { value, description },
      create: { key, value, description },
    });
  }

  // QR Code operations
  static async createQRCode(data: {
    name: string;
    content: string;
    type: string;
    qrCodeData: string;
  }) {
    return await prisma.qRCode.create({
      data,
    });
  }

  static async getQRCodes() {
    return await prisma.qRCode.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async deleteQRCode(id: string) {
    return await prisma.qRCode.delete({
      where: { id },
    });
  }

  // Product operations
  static async createProduct(data: {
    name: string;
    sku: string;
    description?: string;
    categoryId?: string;
    purchasePrice: number;
    sellingPrice: number;
    stockQuantity?: number;
    minimumStock?: number;
    location?: string;
  }) {
    return await prisma.product.create({
      data,
    });
  }

  static async getProducts() {
    return await prisma.product.findMany({
      orderBy: { name: "asc" },
    });
  }

  static async updateProduct(
    id: string,
    data: Partial<{
      name: string;
      sku: string;
      description: string;
      categoryId: string;
      purchasePrice: number;
      sellingPrice: number;
      stockQuantity: number;
      minimumStock: number;
      location: string;
    }>
  ) {
    return await prisma.product.update({
      where: { id },
      data,
    });
  }

  static async deleteProduct(id: string) {
    return await prisma.product.delete({
      where: { id },
    });
  }
}
