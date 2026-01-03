import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { authenticate, isAdmin } from '../middleware/auth.middleware';

const router = Router();
const chatController = new ChatController();

// Shared auth
router.use(authenticate);

// Client routes
router.get('/messages/:caseId', chatController.getMyMessages);
router.post('/messages/:caseId', chatController.sendMessageToAdmin);

// Admin routes
router.get('/conversations', isAdmin, chatController.getConversations);
router.get('/messages/:userId', isAdmin, chatController.getUserMessages);
router.post('/messages/:userId', isAdmin, chatController.replyToUser);

export default router;
