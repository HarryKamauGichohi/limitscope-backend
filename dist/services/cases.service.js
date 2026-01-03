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
        // Run rules-based classification
        const classification = await classificationService.classify({
            restrictionType: data.restrictionType || 'TEMPORARY',
            accountType: data.accountType || 'PERSONAL',
            freeTextReason: data.freeTextReason,
        });
        return client_1.default.payPalCase.create({
            data: {
                ...data,
                ...classification,
                userId,
                status: 'UNDER_REVIEW', // Automatically move to under review after classification
            },
        });
    }
    async getCaseById(id, userId) {
        return client_1.default.payPalCase.findFirst({
            where: { id, userId },
            include: { documents: true },
        });
    }
}
exports.CasesService = CasesService;
