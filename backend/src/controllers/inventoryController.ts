import { Request, Response } from 'express';
import { inventoryService } from '../services/inventoryService';

export const inventoryController = {
  // Product operations
  async getAllProducts(req: Request, res: Response) {
    try {
      const products = await inventoryService.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  },

  async getProductById(req: Request, res: Response) {
    try {
      const product = await inventoryService.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  },

  async createProduct(req: Request, res: Response) {
    try {
      const product = await inventoryService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create product' });
    }
  },

  async updateProduct(req: Request, res: Response) {
    try {
      const product = await inventoryService.updateProduct(req.params.id, req.body);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update product' });
    }
  },

  async deleteProduct(req: Request, res: Response) {
    try {
      await inventoryService.deleteProduct(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  },

  // Stock operations
  async getAllStockTransactions(req: Request, res: Response) {
    try {
      const transactions = await inventoryService.getAllStockTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch stock transactions' });
    }
  },

  async getProductTransactions(req: Request, res: Response) {
    try {
      const transactions = await inventoryService.getProductTransactions(req.params.productId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product transactions' });
    }
  },

  async adjustStock(req: Request, res: Response) {
    try {
      const transaction = await inventoryService.adjustStock(req.body);
      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ error: 'Failed to adjust stock' });
    }
  },

  // Sales operations
  async getAllSales(req: Request, res: Response) {
    try {
      const sales = await inventoryService.getAllSales();
      res.json(sales);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch sales' });
    }
  },

  async getSaleById(req: Request, res: Response) {
    try {
      const sale = await inventoryService.getSaleById(req.params.id);
      if (!sale) {
        return res.status(404).json({ error: 'Sale not found' });
      }
      res.json(sale);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch sale' });
    }
  },

  async createSale(req: Request, res: Response) {
    try {
      const sale = await inventoryService.createSale(req.body);
      res.status(201).json(sale);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create sale' });
    }
  },

  // Category operations
  async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await inventoryService.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  },

  async createCategory(req: Request, res: Response) {
    try {
      const category = await inventoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create category' });
    }
  },

  async updateCategory(req: Request, res: Response) {
    try {
      const category = await inventoryService.updateCategory(req.params.id, req.body);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update category' });
    }
  },

  async deleteCategory(req: Request, res: Response) {
    try {
      await inventoryService.deleteCategory(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete category' });
    }
  },
}; 