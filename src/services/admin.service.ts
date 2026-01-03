import prisma from '../prisma/client';

export interface AdminCaseFilters {
    search?: string;
    status?: string;
    email?: string;
    startDate?: string;
    endDate?: string;
}

export class AdminService {
    async getAllCases(filters: AdminCaseFilters) {
        const { search, status, email, startDate, endDate } = filters;

        const where: any = {};

        if (status) {
            where.status = status;
        }

        if (email) {
            where.user = { email: { contains: email, mode: 'insensitive' } };
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { user: { firstName: { contains: search, mode: 'insensitive' } } },
                { user: { lastName: { contains: search, mode: 'insensitive' } } },
                { user: { email: { contains: search, mode: 'insensitive' } } },
            ];
        }

        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = new Date(startDate);
            if (endDate) where.createdAt.lte = new Date(endDate);
        }

        return prisma.payPalCase.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                documents: true,
                notes: {
                    orderBy: { createdAt: 'desc' },
                },
            },
            orderBy: [
                { status: 'asc' }, // This helps group by status if needed, or we can use specific ordering
                { createdAt: 'desc' },
            ],
        });
    }

    async updateCaseStatus(id: string, status: string) {
        return prisma.payPalCase.update({
            where: { id },
            data: { status },
        });
    }

    async updateCaseClassification(id: string, likelihood: string, fundLikelihood: string, recommendation?: string) {
        return prisma.payPalCase.update({
            where: { id },
            data: { likelihood, fundLikelihood, recommendation },
        });
    }

    async deleteCase(id: string) {
        return prisma.payPalCase.delete({
            where: { id },
        });
    }

    async addCaseNote(caseId: string, content: string) {
        return prisma.caseNote.create({
            data: {
                content,
                caseId,
            },
        });
    }

    async getAllUsers(search?: string) {
        const where: any = {};
        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
            ];
        }

        return prisma.user.findMany({
            where,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                accountStatus: true,
                createdAt: true,
                _count: {
                    select: { cases: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getChatMessages(userId: string) {
        return prisma.chatMessage.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId },
                ],
            },
            orderBy: { createdAt: 'asc' },
        });
    }

    async sendChatMessage(receiverId: string, senderId: string, content: string, isAdminSender: boolean) {
        return prisma.chatMessage.create({
            data: {
                content,
                senderId,
                receiverId,
                isAdminSender,
                userId: isAdminSender ? receiverId : senderId, // Associate with the client user for easy lookup
            },
        });
    }
}
