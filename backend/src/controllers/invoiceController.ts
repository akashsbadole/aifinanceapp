import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const invoiceController = {
  // Get all invoices
  async getAllInvoices(req: Request, res: Response) {
    try {
      const { status, search, page = 1, limit = 10 } = req.query;
      
      const where: any = {};
      
      if (status && status !== 'all') {
        where.status = status;
      }
      
      if (search) {
        where.OR = [
          { invoiceNumber: { contains: search as string } },
          { clientName: { contains: search as string } },
          { clientEmail: { contains: search as string } }
        ];
      }

      const skip = (Number(page) - 1) * Number(limit);
      
      const [invoices, total] = await Promise.all([
        prisma.invoice.findMany({
          where,
          include: {
            items: true
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: Number(limit)
        }),
        prisma.invoice.count({ where })
      ]);

      res.json({
        invoices,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching invoices:', error);
      res.status(500).json({ error: 'Failed to fetch invoices' });
    }
  },

  // Get single invoice
  async getInvoiceById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const invoice = await prisma.invoice.findUnique({
        where: { id },
        include: {
          items: true
        }
      });

      if (!invoice) {
        return res.status(404).json({ error: 'Invoice not found' });
      }

      res.json(invoice);
    } catch (error) {
      console.error('Error fetching invoice:', error);
      res.status(500).json({ error: 'Failed to fetch invoice' });
    }
  },

  // Create new invoice
  async createInvoice(req: Request, res: Response) {
    try {
      const {
        invoiceNumber,
        clientName,
        clientEmail,
        clientAddress,
        dueDate,
        items,
        taxRate = 18,
        discount = 0,
        notes,
        terms
      } = req.body;

      // Calculate totals
      const subtotal = items.reduce((sum: number, item: any) => sum + item.amount, 0);
      const discountAmount = (subtotal * discount) / 100;
      const taxableAmount = subtotal - discountAmount;
      const taxAmount = (taxableAmount * taxRate) / 100;
      const total = taxableAmount + taxAmount;

      const invoice = await prisma.invoice.create({
        data: {
          invoiceNumber,
          clientName,
          clientEmail,
          clientAddress,
          dueDate: new Date(dueDate),
          subtotal,
          taxRate,
          taxAmount,
          discount,
          total,
          notes,
          terms,
          items: {
            create: items.map((item: any) => ({
              description: item.description,
              quantity: item.quantity,
              rate: item.rate,
              amount: item.amount
            }))
          }
        },
        include: {
          items: true
        }
      });

      res.status(201).json(invoice);
    } catch (error) {
      console.error('Error creating invoice:', error);
      res.status(500).json({ error: 'Failed to create invoice' });
    }
  },

  // Update invoice
  async updateInvoice(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const {
        clientName,
        clientEmail,
        clientAddress,
        dueDate,
        items,
        taxRate,
        discount,
        notes,
        terms,
        status
      } = req.body;

      // Calculate totals
      const subtotal = items.reduce((sum: number, item: any) => sum + item.amount, 0);
      const discountAmount = (subtotal * discount) / 100;
      const taxableAmount = subtotal - discountAmount;
      const taxAmount = (taxableAmount * taxRate) / 100;
      const total = taxableAmount + taxAmount;

      // Delete existing items and create new ones
      await prisma.invoiceItem.deleteMany({
        where: { invoiceId: id }
      });

      const invoice = await prisma.invoice.update({
        where: { id },
        data: {
          clientName,
          clientEmail,
          clientAddress,
          dueDate: new Date(dueDate),
          subtotal,
          taxRate,
          taxAmount,
          discount,
          total,
          notes,
          terms,
          status,
          items: {
            create: items.map((item: any) => ({
              description: item.description,
              quantity: item.quantity,
              rate: item.rate,
              amount: item.amount
            }))
          }
        },
        include: {
          items: true
        }
      });

      res.json(invoice);
    } catch (error) {
      console.error('Error updating invoice:', error);
      res.status(500).json({ error: 'Failed to update invoice' });
    }
  },

  // Delete invoice
  async deleteInvoice(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.invoice.delete({
        where: { id }
      });

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting invoice:', error);
      res.status(500).json({ error: 'Failed to delete invoice' });
    }
  },

  // Get invoice statistics
  async getInvoiceStats(req: Request, res: Response) {
    try {
      const [
        totalInvoices,
        paidInvoices,
        pendingInvoices,
        overdueInvoices,
        totalAmount,
        paidAmount
      ] = await Promise.all([
        prisma.invoice.count(),
        prisma.invoice.count({ where: { status: 'paid' } }),
        prisma.invoice.count({ where: { status: 'sent' } }),
        prisma.invoice.count({ where: { status: 'overdue' } }),
        prisma.invoice.aggregate({ _sum: { total: true } }),
        prisma.invoice.aggregate({ 
          where: { status: 'paid' },
          _sum: { total: true } 
        })
      ]);

      res.json({
        totalInvoices,
        paidInvoices,
        pendingInvoices,
        overdueInvoices,
        totalAmount: totalAmount._sum.total || 0,
        paidAmount: paidAmount._sum.total || 0,
        pendingAmount: (totalAmount._sum.total || 0) - (paidAmount._sum.total || 0)
      });
    } catch (error) {
      console.error('Error fetching invoice stats:', error);
      res.status(500).json({ error: 'Failed to fetch invoice statistics' });
    }
  },

  // Update invoice status
  async updateInvoiceStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const invoice = await prisma.invoice.update({
        where: { id },
        data: { status },
        include: { items: true }
      });

      res.json(invoice);
    } catch (error) {
      console.error('Error updating invoice status:', error);
      res.status(500).json({ error: 'Failed to update invoice status' });
    }
  }
};
