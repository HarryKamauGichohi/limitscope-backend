"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const client_1 = __importDefault(require("../prisma/client"));
const authService = new auth_service_1.AuthService();
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
};
class AuthController {
    async register(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ success: false, message: 'Email and password are required' });
            }
            const result = await authService.register({ email, password });
            res.cookie('access_token', result.token, cookieOptions);
            res.status(201).json({
                success: true,
                data: { user: result.user },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ success: false, message: 'Email and password are required' });
            }
            const result = await authService.login({ email, password });
            res.cookie('access_token', result.token, cookieOptions);
            res.status(200).json({
                success: true,
                data: { user: result.user },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getMe(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const user = await client_1.default.user.findUnique({
                where: { id: req.user.id },
                select: { id: true, email: true, accountStatus: true, createdAt: true }
            });
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            res.json({
                success: true,
                data: { user },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async logout(req, res) {
        res.clearCookie('access_token');
        res.json({ success: true, message: 'Logged out successfully' });
    }
}
exports.AuthController = AuthController;
