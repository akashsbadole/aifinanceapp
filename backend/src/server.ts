import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import expenseRoutes from './routes/expenseRoutes';
import inventoryRoutes from './routes/inventoryRoutes';

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/inventory', inventoryRoutes);

// Default categories for expenses
const defaultCategories = [
  { name: 'Food & Dining', description: 'Groceries, restaurants, and food-related expenses' },
  { name: 'Transportation', description: 'Fuel, public transport, and vehicle maintenance' },
  { name: 'Housing', description: 'Rent, utilities, and home maintenance' },
  { name: 'Healthcare', description: 'Medical expenses, prescriptions, and health insurance' },
  { name: 'Entertainment', description: 'Movies, games, and leisure activities' },
  { name: 'Shopping', description: 'Clothing, electronics, and other purchases' },
  { name: 'Education', description: 'Books, courses, and educational materials' },
  { name: 'Utilities', description: 'Electricity, water, and other utility bills' },
  { name: 'Insurance', description: 'Life, health, and property insurance' },
  { name: 'Other', description: 'Miscellaneous expenses' },
];

// Initialize default categories
async function initializeDefaultCategories() {
  try {
    for (const category of defaultCategories) {
      await prisma.category.upsert({
        where: { name: category.name },
        update: {},
        create: category,
      });
    }
    console.log('Default categories initialized successfully');
  } catch (error) {
    console.error('Error initializing default categories:', error);
  }
}

// Start server
async function startServer() {
  try {
    // Initialize database and default data
    await initializeDefaultCategories();

    // Start listening for requests
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
}); 