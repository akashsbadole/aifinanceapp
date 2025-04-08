import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Clear existing data to avoid conflicts
    await prisma.expense.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.stockData.deleteMany({});
    await prisma.company.deleteMany({});

    await prisma.category.upsert({
        where: { name: 'Groceries' },
        update: {},
        create: { id: '1', name: 'Groceries', description: 'Monthly grocery budget', budget: 500.0 },
    });

    await prisma.category.upsert({
        where: { name: 'Utilities' },
        update: {},
        create: { id: '2', name: 'Utilities', description: 'Electricity and water bills', budget: 200.0 },
    });

    await prisma.expense.createMany({
        data: [
            { amount: 50.0, categoryId: '1', date: new Date(), vendor: 'Supermarket', status: 'completed' },
            { amount: 30.0, categoryId: '2', date: new Date(), vendor: 'Electric Company', status: 'pending' },
        ]
    });

    // Create sample companies
    const reliance = await prisma.company.create({
        data: {
            symbol: 'RELIANCE',
            name: 'Reliance Industries Limited',
            sector: 'Oil & Gas',
            industry: 'Integrated Oil & Gas',
            description: 'Indias largest private sector company',
            marketCap: 1750000000000,
        },
    });

    const tcs = await prisma.company.create({
        data: {
            symbol: 'TCS',
            name: 'Tata Consultancy Services',
            sector: 'Technology',
            industry: 'IT Services',
            description: 'Indias largest IT services company',
            marketCap: 1300000000000,
        },
    });

    // Add sample stock data
    const today = new Date();
    for (const company of [reliance, tcs]) {
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const basePrice = company.symbol === 'RELIANCE' ? 2500 : 3500;
            const variation = (Math.random() - 0.5) * 50;
            
            await prisma.stockData.create({
                data: {
                    companyId: company.id,
                    date,
                    open: basePrice + variation,
                    high: basePrice + variation + Math.random() * 20,
                    low: basePrice + variation - Math.random() * 20,
                    close: basePrice + variation + (Math.random() - 0.5) * 10,
                    volume: Math.floor(Math.random() * 1000000) + 500000,
                },
            });
        }
    }

    // ...add more dummy data for other models...
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
