import prisma from '../prisma/client';
import { CreateCaseDTO } from '../controllers/cases.controller';
import { ClassificationService } from './classification.service';

const classificationService = new ClassificationService();

export class CasesService {
    async getAllCases(userId: string) {
        return prisma.payPalCase.findMany({
            where: { userId },
            include: { documents: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async createCase(userId: string, data: CreateCaseDTO) {
        return prisma.payPalCase.create({
            data: {
                ...data,
                userId,
                status: 'UNDER_REVIEW',
            },
        });
    }

    async getCaseById(id: string, userId: string) {
        return prisma.payPalCase.findFirst({
            where: { id, userId },
            include: { documents: true },
        });
    }

    async markAsViewed(id: string, userId: string) {
        return prisma.payPalCase.updateMany({
            where: { id, userId },
            data: { classificationViewed: true },
        });
    }

    async payCase(id: string, userId: string, plan: string) {
        return prisma.payPalCase.updateMany({
            where: { id, userId },
            data: {
                isPaid: true,
                paidPlan: plan
            },
        });
    }
}
