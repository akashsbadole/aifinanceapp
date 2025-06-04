import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const qrCodeController = {
  // Get all QR codes
  async getAllQRCodes(req: Request, res: Response) {
    try {
      const { type, search, page = 1, limit = 10 } = req.query;
      
      const where: any = {};
      
      if (type && type !== 'all') {
        where.type = type;
      }
      
      if (search) {
        where.OR = [
          { name: { contains: search as string } },
          { data: { contains: search as string } }
        ];
      }

      const skip = (Number(page) - 1) * Number(limit);
      
      const [qrCodes, total] = await Promise.all([
        prisma.qRCode.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take: Number(limit)
        }),
        prisma.qRCode.count({ where })
      ]);

      res.json({
        qrCodes,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      console.error('Error fetching QR codes:', error);
      res.status(500).json({ error: 'Failed to fetch QR codes' });
    }
  },

  // Get single QR code
  async getQRCodeById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const qrCode = await prisma.qRCode.findUnique({
        where: { id }
      });

      if (!qrCode) {
        return res.status(404).json({ error: 'QR code not found' });
      }

      res.json(qrCode);
    } catch (error) {
      console.error('Error fetching QR code:', error);
      res.status(500).json({ error: 'Failed to fetch QR code' });
    }
  },

  // Create new QR code
  async createQRCode(req: Request, res: Response) {
    try {
      const { name, type, data, qrCodeUrl } = req.body;

      const qrCode = await prisma.qRCode.create({
        data: {
          name,
          type,
          data: JSON.stringify(data),
          qrCodeUrl
        }
      });

      res.status(201).json(qrCode);
    } catch (error) {
      console.error('Error creating QR code:', error);
      res.status(500).json({ error: 'Failed to create QR code' });
    }
  },

  // Update QR code
  async updateQRCode(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, type, data, qrCodeUrl } = req.body;

      const qrCode = await prisma.qRCode.update({
        where: { id },
        data: {
          name,
          type,
          data: JSON.stringify(data),
          qrCodeUrl
        }
      });

      res.json(qrCode);
    } catch (error) {
      console.error('Error updating QR code:', error);
      res.status(500).json({ error: 'Failed to update QR code' });
    }
  },

  // Delete QR code
  async deleteQRCode(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.qRCode.delete({
        where: { id }
      });

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting QR code:', error);
      res.status(500).json({ error: 'Failed to delete QR code' });
    }
  },

  // Get QR code statistics
  async getQRCodeStats(req: Request, res: Response) {
    try {
      const [
        totalQRCodes,
        typeStats
      ] = await Promise.all([
        prisma.qRCode.count(),
        prisma.qRCode.groupBy({
          by: ['type'],
          _count: { type: true }
        })
      ]);

      const statsByType = typeStats.reduce((acc: any, stat: any) => {
        acc[stat.type] = stat._count.type;
        return acc;
      }, {});

      res.json({
        totalQRCodes,
        byType: statsByType
      });
    } catch (error) {
      console.error('Error fetching QR code stats:', error);
      res.status(500).json({ error: 'Failed to fetch QR code statistics' });
    }
  }
};
