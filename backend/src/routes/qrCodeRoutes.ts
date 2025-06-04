import { Router } from 'express';
import { qrCodeController } from '../controllers/qrCodeController';

const router = Router();

// Get all QR codes with filtering and pagination
router.get('/', qrCodeController.getAllQRCodes);

// Get QR code statistics
router.get('/stats', qrCodeController.getQRCodeStats);

// Get single QR code by ID
router.get('/:id', qrCodeController.getQRCodeById);

// Create new QR code
router.post('/', qrCodeController.createQRCode);

// Update QR code
router.put('/:id', qrCodeController.updateQRCode);

// Delete QR code
router.delete('/:id', qrCodeController.deleteQRCode);

export default router;
