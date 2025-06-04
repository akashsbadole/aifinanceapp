import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import expenseRoutes from "./routes/expenseRoutes";
import inventoryRoutes from "./routes/inventoryRoutes";
import companyRoutes from "./routes/companyRoutes";
import posRoutes from "./routes/pos";
import invoiceRoutes from "./routes/invoiceRoutes";
import businessProfileRoutes from "./routes/businessProfileRoutes";
import qrCodeRoutes from "./routes/qrCodeRoutes";

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/expenses", expenseRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api", companyRoutes); // Adding company routes
app.use("/pos", posRoutes); // Adding POS routes
app.use("/api/invoices", invoiceRoutes);
app.use("/api/business-profiles", businessProfileRoutes);
app.use("/api/qr-codes", qrCodeRoutes);

// Default categories for expenses
const defaultCategories = [
  {
    name: "Food & Dining",
    description: "Groceries, restaurants, and food-related expenses",
  },
  {
    name: "Transportation",
    description: "Fuel, public transport, and vehicle maintenance",
  },
  { name: "Housing", description: "Rent, utilities, and home maintenance" },
  {
    name: "Healthcare",
    description: "Medical expenses, prescriptions, and health insurance",
  },
  {
    name: "Entertainment",
    description: "Movies, games, and leisure activities",
  },
  {
    name: "Shopping",
    description: "Clothing, electronics, and other purchases",
  },
  {
    name: "Education",
    description: "Books, courses, and educational materials",
  },
  {
    name: "Utilities",
    description: "Electricity, water, and other utility bills",
  },
  { name: "Insurance", description: "Life, health, and property insurance" },
  { name: "Other", description: "Miscellaneous expenses" },
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
    console.log("Default categories initialized successfully");
  } catch (error) {
    console.error("Error initializing default categories:", error);
  }
}

// API Endpoints

// Create a category
app.post("/api/categories", async (req, res) => {
  const { name, description, budget } = req.body;
  try {
    const category = await prisma.category.create({
      data: { name, description, budget },
    });
    res.status(201).json(category);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(400).json({ error: errorMessage });
  }
});

// Get all categories
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { expenses: true },
        },
      },
    });
    res.json(categories);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(500).json({ error: errorMessage });
  }
});

// Update a category
app.put("/api/categories/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, budget } = req.body;
  try {
    const category = await prisma.category.update({
      where: { id },
      data: { name, description, budget },
      include: {
        _count: {
          select: { expenses: true },
        },
      },
    });
    res.json(category);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(400).json({ error: errorMessage });
  }
});

// Delete a category
app.delete("/api/categories/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.category.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.status(400).json({ error: errorMessage });
  }
});

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
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

startServer();

// Handle graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
