import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all products for POS
router.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        stockQuantity: {
          gt: 0
        }
      },
      select: {
        id: true,
        name: true,
        sellingPrice: true,
        stockQuantity: true
      }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Create a new sale
router.post('/sale', async (req, res) => {
  const { customerName, totalAmount, paymentMethod, items } = req.body;
  
  try {
    const sale = await prisma.$transaction(async (prisma) => {
      // Create the sale
      const newSale = await prisma.sale.create({
        data: {
          customerName,
          totalAmount,
          paymentMethod,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              total: item.total
            }))
          }
        }
      });

      // Update stock quantities
      for (const item of items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: {
              decrement: item.quantity
            }
          }
        });
      }

      return newSale;
    });

    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create sale' });
  }
});

export default router;
