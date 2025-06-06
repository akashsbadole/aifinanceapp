const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create default business profile
  const businessProfile = await prisma.businessProfile.create({
    data: {
      companyName: 'Your Company Name',
      companyAddress: '123 Business Street, City, State 12345',
      phone: '+91 98765 43210',
      email: 'contact@yourcompany.com',
      website: 'https://www.yourcompany.com',
      gstin: '22AAAAA0000A1Z5',
      isDefault: true,
    },
  });
  console.log('✅ Created default business profile');

  // Create default categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Office Supplies',
        description: 'Stationery, equipment, and office materials',
        budget: 10000,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Travel',
        description: 'Business travel and transportation expenses',
        budget: 25000,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Utilities',
        description: 'Electricity, water, internet, and other utilities',
        budget: 15000,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Marketing',
        description: 'Advertising, promotions, and marketing materials',
        budget: 20000,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Meals & Entertainment',
        description: 'Business meals and client entertainment',
        budget: 8000,
      },
    }),
  ]);
  console.log('✅ Created default categories');

  // Create sample expenses
  const expenses = await Promise.all([
    prisma.expense.create({
      data: {
        amount: 2500,
        description: 'Office printer and supplies',
        vendor: 'Office Depot',
        date: new Date('2024-01-15'),
        paymentMethod: 'Credit Card',
        status: 'approved',
        hasReceipt: true,
        categoryId: categories[0].id,
      },
    }),
    prisma.expense.create({
      data: {
        amount: 8500,
        description: 'Flight tickets for business trip',
        vendor: 'Airlines Inc',
        date: new Date('2024-01-20'),
        paymentMethod: 'Company Card',
        status: 'approved',
        hasReceipt: true,
        categoryId: categories[1].id,
      },
    }),
    prisma.expense.create({
      data: {
        amount: 3200,
        description: 'Monthly internet and phone bill',
        vendor: 'Telecom Provider',
        date: new Date('2024-01-25'),
        paymentMethod: 'Bank Transfer',
        status: 'approved',
        hasReceipt: true,
        categoryId: categories[2].id,
      },
    }),
    prisma.expense.create({
      data: {
        amount: 15000,
        description: 'Google Ads campaign',
        vendor: 'Google',
        date: new Date('2024-01-28'),
        paymentMethod: 'Credit Card',
        status: 'pending',
        hasReceipt: false,
        categoryId: categories[3].id,
      },
    }),
  ]);
  console.log('✅ Created sample expenses');

  // Create sample invoices
  const invoices = await Promise.all([
    prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-0001',
        clientName: 'ABC Corporation',
        clientEmail: 'accounts@abccorp.com',
        clientAddress: '456 Client Street, Business District, City 54321',
        dueDate: new Date('2024-02-15'),
        subtotal: 50000,
        taxRate: 18,
        taxAmount: 9000,
        discount: 0,
        total: 59000,
        status: 'sent',
        notes: 'Thank you for your business!',
        terms: 'Payment due within 30 days',
        businessProfileId: businessProfile.id,
        items: {
          create: [
            {
              description: 'Web Development Services',
              quantity: 1,
              rate: 30000,
              amount: 30000,
              unit: 'Project',
            },
            {
              description: 'SEO Optimization',
              quantity: 1,
              rate: 20000,
              amount: 20000,
              unit: 'Service',
            },
          ],
        },
      },
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-0002',
        clientName: 'XYZ Enterprises',
        clientEmail: 'billing@xyzent.com',
        clientAddress: '789 Enterprise Ave, Commercial Zone, City 67890',
        dueDate: new Date('2024-02-20'),
        subtotal: 25000,
        taxRate: 18,
        taxAmount: 4500,
        discount: 1000,
        total: 28500,
        status: 'paid',
        notes: 'Pleasure working with you!',
        terms: 'Payment due within 15 days',
        businessProfileId: businessProfile.id,
        items: {
          create: [
            {
              description: 'Mobile App Development',
              quantity: 1,
              rate: 25000,
              amount: 25000,
              unit: 'Project',
            },
          ],
        },
      },
    }),
  ]);
  console.log('✅ Created sample invoices');

  // Create default settings
  const settings = await Promise.all([
    prisma.settings.create({
      data: {
        key: 'currency',
        value: 'INR',
        description: 'Default currency for the application',
      },
    }),
    prisma.settings.create({
      data: {
        key: 'taxRate',
        value: '18',
        description: 'Default tax rate percentage',
      },
    }),
    prisma.settings.create({
      data: {
        key: 'companyName',
        value: 'Your Company Name',
        description: 'Default company name',
      },
    }),
    prisma.settings.create({
      data: {
        key: 'theme',
        value: 'light',
        description: 'Application theme',
      },
    }),
    prisma.settings.create({
      data: {
        key: 'language',
        value: 'en',
        description: 'Application language',
      },
    }),
  ]);
  console.log('✅ Created default settings');

  console.log('🎉 Database seeding completed successfully!');
  console.log(`📊 Created:`);
  console.log(`   - 1 business profile`);
  console.log(`   - ${categories.length} categories`);
  console.log(`   - ${expenses.length} expenses`);
  console.log(`   - ${invoices.length} invoices`);
  console.log(`   - ${settings.length} settings`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
