"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasesService = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const classification_service_1 = require("./classification.service");
const classificationService = new classification_service_1.ClassificationService();
class CasesService {
    async getAllCases(userId) {
        return client_1.default.payPalCase.findMany({
            where: { userId },
            include: { documents: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async createCase(userId, data) {
        return client_1.default.payPalCase.create({
            data: {
                ...data,
                userId,
                status: 'UNDER_REVIEW',
            },
        });
    }
    async getCaseById(id, userId) {
        return client_1.default.payPalCase.findFirst({
            where: { id, userId },
            include: { documents: true },
        });
    }
    async markAsViewed(id, userId) {
        return client_1.default.payPalCase.updateMany({
            where: { id, userId },
            data: { classificationViewed: true },
        });
    }
    async payCase(id, userId, plan) {
        return client_1.default.payPalCase.updateMany({
            where: { id, userId },
            data: {
                isPaid: true,
                paidPlan: plan
            },
        });
    }
}
exports.CasesService = CasesService;
