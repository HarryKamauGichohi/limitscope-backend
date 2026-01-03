import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { authenticate, isAdmin } from '../middleware/auth.middleware';

const router = Router();
const chatController = new ChatController();

// Shared auth
router.use(authenticate);

// Client routes
router.get('/messages', chatController.getMyMessages);
router.post('/messages', chatController.sendMessageToAdmin);
router.get('/case/:caseId/messages', chatController.getMyMessages);
router.post('/case/:caseId/messages', chatController.sendMessageToAdmin);

// Admin routes
router.get('/conversations', isAdmin, chatController.getConversations);
router.get('/user/:userId/messages', isAdmin, chatController.getUserMessages);
router.post('/user/:userId/messages', isAdmin, chatController.replyToUser);

export default router;
