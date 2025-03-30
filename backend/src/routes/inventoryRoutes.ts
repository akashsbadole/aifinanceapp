import { Router } from 'express';
import { inventoryController } from '../controllers/inventoryController';

const router = Router();

// Product routes
router.get('/products', inventoryController.getAllProducts);
router.get('/products/:id', inventoryController.getProductById);
router.post('/products', inventoryController.createProduct);
router.put('/products/:id', inventoryController.updateProduct);
router.delete('/products/:id', inventoryController.deleteProduct);

// Stock routes
router.get('/stock-transactions', inventoryController.getAllStockTransactions);
router.get('/products/:productId/transactions', inventoryController.getProductTransactions);
router.post('/stock-adjustments', inventoryController.adjustStock);

// Sales routes
router.get('/sales', inventoryController.getAllSales);
router.get('/sales/:id', inventoryController.getSaleById);
router.post('/sales', inventoryController.createSale);

// Category routes
router.get('/categories', inventoryController.getAllCategories);
router.post('/categories', inventoryController.createCategory);
router.put('/categories/:id', inventoryController.updateCategory);
router.delete('/categories/:id', inventoryController.deleteCategory);

export default router; 