import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const electronics = await prisma.category.create({
    data: { name: 'Electronics', description: 'Electronic gadgets and devices' },
  });
  const groceries = await prisma.category.create({
    data: { name: 'Groceries', description: 'Daily grocery items' },
  });

  // Create products
  const product1 = await prisma.product.create({
    data: {
      name: 'Smartphone',
      sku: 'ELEC001',
      description: 'Latest model smartphone',
      categoryId: electronics.id,
      purchasePrice: 500,
      sellingPrice: 700,
      stockQuantity: 50,
      minimumStock: 10,
      location: 'Aisle 1',
    },
  });
  const product2 = await prisma.product.create({
    data: {
      name: 'Rice Bag',
      sku: 'GROC001',
      description: '5kg rice bag',
      categoryId: groceries.id,
      purchasePrice: 10,
      sellingPrice: 15,
      stockQuantity: 100,
      minimumStock: 20,
      location: 'Aisle 5',
    },
  });

  // Create stock transactions
  await prisma.stockTransaction.create({
    data: {
      productId: product1.id,
      type: 'addition',
      quantity: 50,
      reason: 'Initial stock',
    },
  });
  await prisma.stockTransaction.create({
    data: {
      productId: product2.id,
      type: 'addition',
      quantity: 100,
      reason: 'Initial stock',
    },
  });

  // Create sales
  await prisma.sale.create({
    data: {
      customerName: 'John Doe',
      customerPhone: '1234567890',
      totalAmount: 715,
      paymentMethod: 'Credit Card',
      status: 'completed',
      items: {
        create: [
          {
            productId: product1.id,
            quantity: 1,
            price: 700,
            total: 700,
          },
          {
            productId: product2.id,
            quantity: 1,
            price: 15,
            total: 15,
          },
        ],
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
