const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/invoices - Get all invoices with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    
    const where = {};
    
    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { clientName: { contains: search, mode: 'insensitive' } },
        { clientEmail: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (status && status !== 'all') {
      where.status = status;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          items: true,
          businessProfile: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.invoice.count({ where }),
    ]);

    // Calculate stats
    const allInvoices = await prisma.invoice.findMany();
    const stats = {
      totalInvoices: allInvoices.length,
      paidAmount: allInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0),
      pendingAmount: allInvoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + inv.total, 0),
      totalAmount: allInvoices.reduce((sum, inv) => sum + inv.total, 0),
    };

    res.json({
      invoices,
      pagination: {
        total,
        pages: Math.ceil(total / limitNum),
        currentPage: pageNum,
        limit: limitNum,
      },
      stats,
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// GET /api/invoices/stats - Get invoice statistics
router.get('/stats', async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany();
    
    const stats = {
      totalInvoices: invoices.length,
      paidAmount: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0),
      pendingAmount: invoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + inv.total, 0),
      overdueAmount: invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0),
      totalAmount: invoices.reduce((sum, inv) => sum + inv.total, 0),
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching invoice stats:', error);
    res.status(500).json({ error: 'Failed to fetch invoice statistics' });
  }
});

// GET /api/invoices/:id - Get single invoice
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        items: true,
        businessProfile: true,
      },
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

// POST /api/invoices - Create new invoice
router.post('/', async (req, res) => {
  try {
    const { items, ...invoiceData } = req.body;
    
    // Validate required fields
    if (!invoiceData.invoiceNumber || !invoiceData.clientName || !invoiceData.clientAddress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Convert date strings to Date objects
    if (invoiceData.dueDate) {
      invoiceData.dueDate = new Date(invoiceData.dueDate);
    }

    const invoice = await prisma.invoice.create({
      data: {
        ...invoiceData,
        items: {
          create: items || [],
        },
      },
      include: {
        items: true,
        businessProfile: true,
      },
    });

    res.status(201).json(invoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Invoice number already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create invoice' });
    }
  }
});

// PUT /api/invoices/:id - Update invoice
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { items, ...invoiceData } = req.body;

    // Convert date strings to Date objects
    if (invoiceData.dueDate) {
      invoiceData.dueDate = new Date(invoiceData.dueDate);
    }

    // Update invoice and replace items
    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        ...invoiceData,
        items: {
          deleteMany: {},
          create: items || [],
        },
      },
      include: {
        items: true,
        businessProfile: true,
      },
    });

    res.json(invoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Invoice not found' });
    } else {
      res.status(500).json({ error: 'Failed to update invoice' });
    }
  }
});

// DELETE /api/invoices/:id - Delete invoice
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.invoice.delete({
      where: { id },
    });

    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Invoice not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete invoice' });
    }
  }
});

// POST /api/invoices/:id/duplicate - Duplicate invoice
router.post('/:id/duplicate', async (req, res) => {
  try {
    const { id } = req.params;
    
    const originalInvoice = await prisma.invoice.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!originalInvoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Generate new invoice number
    const invoiceCount = await prisma.invoice.count();
    const newInvoiceNumber = `INV-${String(invoiceCount + 1).padStart(4, '0')}`;

    const { id: _, createdAt, updatedAt, items, ...invoiceData } = originalInvoice;
    
    const duplicatedInvoice = await prisma.invoice.create({
      data: {
        ...invoiceData,
        invoiceNumber: newInvoiceNumber,
        status: 'draft',
        items: {
          create: items.map(({ id, invoiceId, ...item }) => item),
        },
      },
      include: {
        items: true,
        businessProfile: true,
      },
    });

    res.status(201).json(duplicatedInvoice);
  } catch (error) {
    console.error('Error duplicating invoice:', error);
    res.status(500).json({ error: 'Failed to duplicate invoice' });
  }
});

module.exports = router;
