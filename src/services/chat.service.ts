import prisma from '../prisma/client';

export class ChatService {
    async getMessages(userId: string, caseId?: string) {
        return prisma.chatMessage.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId },
                ],
                caseId: caseId || null
            },
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
                caseId,
                userId: isAdminSender ? receiverId : senderId,
            },
        });
    }

    async getAdminConversations() {
        // Get unique users who have sent messages or are associated with messages
        const usersWithMessages = await prisma.user.findMany({
            where: {
                isAdmin: false,
                messages: {
                    some: {}
                }
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                }
            }
        });

        return usersWithMessages;
    }

    async getAdminUser() {
        return prisma.user.findFirst({
            where: { isAdmin: true }
        });
    }
}
