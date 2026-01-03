"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const client_1 = __importDefault(require("../prisma/client"));
class AdminService {
    async getAllCases(filters) {
        const { search, status, email, startDate, endDate } = filters;
        const where = {};
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
            if (startDate)
                where.createdAt.gte = new Date(startDate);
            if (endDate)
                where.createdAt.lte = new Date(endDate);
        }
        return client_1.default.payPalCase.findMany({
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
    async updateCaseStatus(id, status) {
        return client_1.default.payPalCase.update({
            where: { id },
            data: { status },
        });
    }
    async updateCaseClassification(id, likelihood, fundLikelihood, recommendation) {
        return client_1.default.payPalCase.update({
            where: { id },
            data: { likelihood, fundLikelihood, recommendation },
        });
    }
    async deleteCase(id) {
        return client_1.default.payPalCase.delete({
            where: { id },
        });
    }
    async addCaseNote(caseId, content) {
        return client_1.default.caseNote.create({
            data: {
                content,
                caseId,
            },
        });
    }
    async getAllUsers(search) {
        const where = {};
        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
            ];
        }
        return client_1.default.user.findMany({
            where,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                accountStatus: true,
                createdAt: true,
                _count: {
                    select: {
                        cases: true,
                        messages: {
                            where: { isRead: false, isAdminSender: false }
                        }
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
}
exports.AdminService = AdminService;
