"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const admin_service_1 = require("../services/admin.service");
const chat_service_1 = require("../services/chat.service");
const adminService = new admin_service_1.AdminService();
const chatService = new chat_service_1.ChatService();
class AdminController {
    async getCases(req, res, next) {
        try {
            const filters = {
                search: req.query.search,
                status: req.query.status,
                email: req.query.email,
                startDate: req.query.startDate,
                endDate: req.query.endDate,
            };
            const cases = await adminService.getAllCases(filters);
            res.status(200).json({ success: true, data: cases });
        }
        catch (err) {
            next(err);
        }
    }
    async updateStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const result = await adminService.updateCaseStatus(id, status);
            res.status(200).json({ success: true, data: result });
        }
        catch (err) {
            next(err);
        }
    }
    async updateClassification(req, res, next) {
        try {
            const { id } = req.params;
            const { likelihood, fundLikelihood, recommendation } = req.body;
            const result = await adminService.updateCaseClassification(id, likelihood, fundLikelihood, recommendation);
            res.status(200).json({ success: true, data: result });
        }
        catch (err) {
            next(err);
        }
    }
    async deleteCase(req, res, next) {
        try {
            const { id } = req.params;
            await adminService.deleteCase(id);
            res.status(200).json({ success: true, message: 'Case deleted' });
        }
        catch (err) {
            next(err);
        }
    }
    async addNote(req, res, next) {
        try {
            const { id } = req.params;
            const { content } = req.body;
            const note = await adminService.addCaseNote(id, content);
            res.status(201).json({ success: true, data: note });
        }
        catch (err) {
            next(err);
        }
    }
    async getUsers(req, res, next) {
        try {
            const search = req.query.search;
            const users = await adminService.getAllUsers(search);
            res.status(200).json({ success: true, data: users });
        }
        catch (err) {
            next(err);
        }
    }
    async getChat(req, res, next) {
        try {
            const { userId } = req.params;
            console.log(`[AdminAPI] Fetching chat for ${userId}`);
            const messages = await chatService.getMessages(userId, undefined, true);
            res.status(200).json({ success: true, data: messages });
        }
        catch (err) {
            next(err);
        }
    }
    async sendMessage(req, res, next) {
        try {
            const { userId } = req.params;
            const { content } = req.body;
            const senderId = req.user.id;
            const isAdmin = req.user.isAdmin;
            const message = await chatService.sendMessage(senderId, userId, content, isAdmin);
            res.status(201).json({ success: true, data: message });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.AdminController = AdminController;
