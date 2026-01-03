import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ChatService } from '../services/chat.service';

const chatService = new ChatService();

export class ChatController {
    async getMyMessages(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
            const { caseId } = req.params;

            const messages = await chatService.getMessages(req.user.id, caseId);
            res.json({ success: true, data: messages });
        } catch (error) {
            next(error);
        }
    }

    async sendMessageToAdmin(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
            const { caseId } = req.params;

            const { content } = req.body;
            const admin = await chatService.getAdminUser();

            if (!admin) {
                return res.status(500).json({ success: false, message: 'No admin found to receive message' });
            }

            const message = await chatService.sendMessage(req.user.id, admin.id, content, false, caseId);
            res.status(201).json({ success: true, data: message });
        } catch (error) {
            next(error);
        }
    }

    // Admin endpoints
    async getConversations(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const conversations = await chatService.getAdminConversations();
            res.json({ success: true, data: conversations });
        } catch (error) {
            next(error);
        }
    }

    async getUserMessages(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const messages = await chatService.getMessages(userId);
            res.json({ success: true, data: messages });
        } catch (error) {
            next(error);
        }
    }

    async replyToUser(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
            const { userId } = req.params;
            const { content } = req.body;

            const message = await chatService.sendMessage(req.user.id, userId, content, true);
            res.status(201).json({ success: true, data: message });
        } catch (error) {
            next(error);
        }
    }
}
