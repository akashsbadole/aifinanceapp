import { Router } from 'express';
import { invoiceController } from '../controllers/invoiceController';

const router = Router();

// Get all invoices with filtering and pagination
router.get('/', invoiceController.getAllInvoices);

// Get invoice statistics
router.get('/stats', invoiceController.getInvoiceStats);

// Get single invoice by ID
router.get('/:id', invoiceController.getInvoiceById);

// Create new invoice
router.post('/', invoiceController.createInvoice);

// Update invoice
router.put('/:id', invoiceController.updateInvoice);

// Update invoice status only
router.patch('/:id/status', invoiceController.updateInvoiceStatus);

// Delete invoice
router.delete('/:id', invoiceController.deleteInvoice);

export default router;
