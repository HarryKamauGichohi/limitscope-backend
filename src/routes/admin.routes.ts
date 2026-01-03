import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticate, isAdmin } from '../middleware/auth.middleware';

const router = Router();
const adminController = new AdminController();

// All admin routes are protected
router.use(authenticate, isAdmin);

router.get('/cases', adminController.getCases);
router.put('/cases/:id/status', adminController.updateStatus);
router.put('/cases/:id/classify', adminController.updateClassification);
router.delete('/cases/:id', adminController.deleteCase);
router.post('/cases/:id/notes', adminController.addNote);

router.get('/users', adminController.getUsers);

router.get('/chat/:userId', adminController.getChat);
router.post('/chat/:userId', adminController.sendMessage);

export default router;
