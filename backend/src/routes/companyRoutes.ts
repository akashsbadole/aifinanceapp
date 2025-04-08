import express from 'express';
import multer from 'multer';
import { getCompanies, getCompanyDetails, importCSV } from '../controllers/companyController';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/companies', getCompanies);
router.get('/companies/:id', getCompanyDetails);
router.post('/companies/import', upload.single('file'), importCSV);

export default router;