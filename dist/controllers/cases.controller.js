"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasesController = void 0;
const cases_service_1 = require("../services/cases.service");
const casesService = new cases_service_1.CasesService();
class CasesController {
    async getMyCases(req, res, next) {
        try {
            if (!req.user)
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            const cases = await casesService.getAllCases(req.user.id);
            res.json({ success: true, data: cases });
        }
        catch (error) {
            next(error);
        }
    }
    async createCase(req, res, next) {
        try {
            if (!req.user)
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            const data = req.body;
            if (!data.title) {
                return res.status(400).json({ success: false, message: 'Title is required' });
            }
            const newCase = await casesService.createCase(req.user.id, data);
            res.status(201).json({ success: true, data: newCase });
        }
        catch (error) {
            next(error);
        }
    }
    async getCaseDetails(req, res, next) {
        try {
            if (!req.user)
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            const { id } = req.params;
            const caseItem = await casesService.getCaseById(id, req.user.id);
            if (!caseItem) {
                return res.status(404).json({ success: false, message: 'Case not found' });
            }
            res.json({ success: true, data: caseItem });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CasesController = CasesController;
