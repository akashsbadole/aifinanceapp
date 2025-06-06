const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/qr-codes - Get all QR codes
router.get('/', async (req, res) => {
  try {
    const qrCodes = await prisma.qRCode.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json(qrCodes);
  } catch (error) {
    console.error('Error fetching QR codes:', error);
    res.status(500).json({ error: 'Failed to fetch QR codes' });
  }
});

// GET /api/qr-codes/:id - Get single QR code
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const qrCode = await prisma.qRCode.findUnique({
      where: { id },
    });

    if (!qrCode) {
      return res.status(404).json({ error: 'QR code not found' });
    }

    res.json(qrCode);
  } catch (error) {
    console.error('Error fetching QR code:', error);
    res.status(500).json({ error: 'Failed to fetch QR code' });
  }
});

// POST /api/qr-codes - Create new QR code
router.post('/', async (req, res) => {
  try {
    const { name, content, type, qrCodeData } = req.body;
    
    // Validate required fields
    if (!name || !content || !type || !qrCodeData) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const qrCode = await prisma.qRCode.create({
      data: {
        name,
        content,
        type,
        qrCodeData,
      },
    });

    res.status(201).json(qrCode);
  } catch (error) {
    console.error('Error creating QR code:', error);
    res.status(500).json({ error: 'Failed to create QR code' });
  }
});

// PUT /api/qr-codes/:id - Update QR code
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, content, type, qrCodeData } = req.body;

    const qrCode = await prisma.qRCode.update({
      where: { id },
      data: {
        name,
        content,
        type,
        qrCodeData,
      },
    });

    res.json(qrCode);
  } catch (error) {
    console.error('Error updating QR code:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'QR code not found' });
    } else {
      res.status(500).json({ error: 'Failed to update QR code' });
    }
  }
});

// DELETE /api/qr-codes/:id - Delete QR code
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.qRCode.delete({
      where: { id },
    });

    res.json({ message: 'QR code deleted successfully' });
  } catch (error) {
    console.error('Error deleting QR code:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'QR code not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete QR code' });
    }
  }
});

module.exports = router;
