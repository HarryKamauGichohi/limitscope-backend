"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const chat_service_1 = require("../services/chat.service");
const chatService = new chat_service_1.ChatService();
class ChatController {
    async getMyMessages(req, res, next) {
        try {
            if (!req.user)
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            const { caseId } = req.params;
            const messages = await chatService.getMessages(req.user.id, caseId);
            res.json({ success: true, data: messages });
        }
        catch (error) {
            next(error);
        }
    }
    async sendMessageToAdmin(req, res, next) {
        try {
            if (!req.user)
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            const { caseId } = req.params;
            const { content } = req.body;
            const admin = await chatService.getAdminUser();
            if (!admin) {
                return res.status(500).json({ success: false, message: 'No admin found to receive message' });
            }
            const message = await chatService.sendMessage(req.user.id, admin.id, content, false, caseId);
            res.status(201).json({ success: true, data: message });
        }
        catch (error) {
            next(error);
        }
    }
    // Admin endpoints
    async getConversations(req, res, next) {
        try {
            const conversations = await chatService.getAdminConversations();
            res.json({ success: true, data: conversations });
        }
        catch (error) {
            next(error);
        }
    }
    async getUserMessages(req, res, next) {
        try {
            const { userId } = req.params;
            console.log(`[Chat] Admin fetching messages for user ${userId}. Marking as read.`);
            const messages = await chatService.getMessages(userId, undefined, true);
            res.json({ success: true, data: messages });
        }
        catch (error) {
            next(error);
        }
    }
    async replyToUser(req, res, next) {
        try {
            if (!req.user)
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            const { userId } = req.params;
            const { content } = req.body;
            const message = await chatService.sendMessage(req.user.id, userId, content, true);
            res.status(201).json({ success: true, data: message });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ChatController = ChatController;
