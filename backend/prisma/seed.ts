import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Clear existing data to avoid conflicts
    await prisma.expense.deleteMany({});
    await prisma.category.deleteMany({});

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
