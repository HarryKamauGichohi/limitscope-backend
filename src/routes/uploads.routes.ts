import { Router } from 'express';
import { UploadsController } from '../controllers/uploads.controller';
import { upload } from '../utils/multer.config';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const uploadsController = new UploadsController();

// Protected routes
router.use(authenticate);

// @route POST /api/uploads
// @desc Upload a file associated with a case
router.post('/', upload.single('file'), uploadsController.uploadFile);

export default router;
