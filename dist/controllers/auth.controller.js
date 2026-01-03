"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const client_1 = __importDefault(require("../prisma/client"));
const authService = new auth_service_1.AuthService();
const isProduction = process.env.NODE_ENV === 'production';
const cookieOptions = {
    httpOnly: true,
    secure: false, // Set to false for development (HTTP), true for production (HTTPS)
    sameSite: 'lax', // 'lax' works for same-site requests in development
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    path: '/', // Cookie available for all paths
};
class AuthController {
    async register(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ success: false, message: 'Email and password are required' });
            }
            const result = await authService.register({ email, password });
            console.log(`[Auth] Setting cookie for ${email}`);
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
            console.log(`[Auth] Setting cookie for ${email}`);
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
            // Add isAdmin from raw query or default to false
            const userWithAdmin = { ...user, isAdmin: user.isAdmin || req.user.isAdmin || false };
            res.json({
                success: true,
                data: { user: userWithAdmin },
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
    async updateEmail(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ success: false, message: 'Email is required' });
            }
            const user = await authService.updateEmail(req.user.id, email);
            res.json({
                success: true,
                data: { user },
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updatePassword(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) {
                return res.status(400).json({ success: false, message: 'Current password and new password are required' });
            }
            await authService.updatePassword(req.user.id, currentPassword, newPassword);
            res.json({
                success: true,
                message: 'Password updated successfully',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
