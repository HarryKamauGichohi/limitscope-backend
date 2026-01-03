import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';

const adminService = new AdminService();

export class AdminController {
    async getCases(req: Request, res: Response, next: NextFunction) {
        try {
            const filters = {
                search: req.query.search as string,
                status: req.query.status as string,
                email: req.query.email as string,
                startDate: req.query.startDate as string,
                endDate: req.query.endDate as string,
            };

            const cases = await adminService.getAllCases(filters);
            res.status(200).json({ success: true, data: cases });
        } catch (err) {
            next(err);
        }
    }

    async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const result = await adminService.updateCaseStatus(id, status);
            res.status(200).json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }

    async updateClassification(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { likelihood, fundLikelihood, recommendation } = req.body;
            const result = await adminService.updateCaseClassification(id, likelihood, fundLikelihood, recommendation);
            res.status(200).json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }

    async deleteCase(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await adminService.deleteCase(id);
            res.status(200).json({ success: true, message: 'Case deleted' });
        } catch (err) {
            next(err);
        }
    }

    async addNote(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { content } = req.body;
            const note = await adminService.addCaseNote(id, content);
            res.status(201).json({ success: true, data: note });
        } catch (err) {
            next(err);
        }
    }

    async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const search = req.query.search as string;
            const users = await adminService.getAllUsers(search);
            res.status(200).json({ success: true, data: users });
        } catch (err) {
            next(err);
        }
    }

    async getChat(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const messages = await adminService.getChatMessages(userId);
            res.status(200).json({ success: true, data: messages });
        } catch (err) {
            next(err);
        }
    }

    async sendMessage(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const { content } = req.body;
            const senderId = (req as any).user.id;
            const isAdmin = (req as any).user.isAdmin;

            const message = await adminService.sendChatMessage(userId, senderId, content, isAdmin);
            res.status(201).json({ success: true, data: message });
        } catch (err) {
            next(err);
        }
    }
}
