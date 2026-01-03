"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const client_1 = __importDefault(require("../prisma/client"));
class ChatService {
    async getMessages(userId, caseId, markAsRead = false) {
        // Find all messages involving this user (either as sender or receiver)
        // We avoid strict caseId filtering by default to ensure no messages are missed
        const where = {
            OR: [
                { senderId: userId },
                { receiverId: userId },
            ],
            // If we want to strictly filter by case, we can, but usually we want the whole thread
            // caseId: caseId || undefined 
        };
        if (markAsRead) {
            await client_1.default.chatMessage.updateMany({
                where: {
                    senderId: userId,
                    isAdminSender: false,
                    isRead: false
                },
                data: { isRead: true }
            });
        }
        return client_1.default.chatMessage.findMany({
            where,
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        isAdmin: true
                    }
                }
            },
            orderBy: { createdAt: 'asc' },
        });
    }
    async sendMessage(senderId, receiverId, content, isAdminSender, caseId) {
        return client_1.default.chatMessage.create({
            data: {
                content,
                senderId,
                receiverId,
                isAdminSender,
                caseId: caseId || null,
                userId: isAdminSender ? receiverId : senderId,
                isRead: false
            },
        });
    }
    async getAdminConversations() {
        // Get all chat messages to find unique users who have communicated
        const allMessages = await client_1.default.chatMessage.findMany({
            select: {
                senderId: true,
                receiverId: true,
                isAdminSender: true,
            },
        });
        console.log('[DEBUG] Total messages found:', allMessages.length);
        // Extract unique user IDs (excluding admins)
        const userIds = new Set();
        allMessages.forEach(msg => {
            if (!msg.isAdminSender) {
                // If message is from client, add the sender
                userIds.add(msg.senderId);
                console.log('[DEBUG] Added client sender:', msg.senderId);
            }
            else {
                // If message is from admin, add the receiver (client)
                userIds.add(msg.receiverId);
                console.log('[DEBUG] Added client receiver:', msg.receiverId);
            }
        });
        console.log('[DEBUG] Unique user IDs:', Array.from(userIds));
        // Fetch full user details for these users
        const usersWithMessages = await client_1.default.user.findMany({
            where: {
                id: { in: Array.from(userIds) },
                isAdmin: false,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                _count: {
                    select: {
                        messages: {
                            where: { isRead: false, isAdminSender: false }
                        }
                    }
                }
            },
        });
        console.log('[DEBUG] Users with messages:', usersWithMessages.length);
        return usersWithMessages;
    }
    async getAdminUser() {
        return client_1.default.user.findFirst({
            where: { isAdmin: true }
        });
    }
}
exports.ChatService = ChatService;
