import prisma from '../prisma/client';

export class ChatService {
    async getMessages(userId: string, caseId?: string, markAsRead: boolean = false) {
        // Find all messages involving this user (either as sender or receiver)
        // We avoid strict caseId filtering by default to ensure no messages are missed
        const where: any = {
            OR: [
                { senderId: userId },
                { receiverId: userId },
            ],
            // If we want to strictly filter by case, we can, but usually we want the whole thread
            // caseId: caseId || undefined 
        };

        if (markAsRead) {
            await prisma.chatMessage.updateMany({
                where: {
                    senderId: userId,
                    isAdminSender: false,
                    isRead: false
                },
                data: { isRead: true }
            });
        }

        return prisma.chatMessage.findMany({
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

    async sendMessage(senderId: string, receiverId: string, content: string, isAdminSender: boolean, caseId?: string) {
        return prisma.chatMessage.create({
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
        // Get all users who have at least one case or at least one message
        // This ensures the admin can see every relevant client
        const users = await prisma.user.findMany({
            where: {
                isAdmin: false,
                OR: [
                    { cases: { some: {} } },
                    { messages: { some: {} } }
                ]
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
            orderBy: { createdAt: 'desc' }
        });

        console.log('[DEBUG] Found conversations for users:', users.length);
        return users;
    }

    async getAdminUser() {
        return prisma.user.findFirst({
            where: { isAdmin: true }
        });
    }
}
