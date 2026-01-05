import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import prisma from '../prisma/client';

const authService = new AuthService();

export interface RegisterDTO {
    email: string;
    password?: any;
}

export interface LoginDTO {
    email: string;
    password?: any;
}

const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions: any = {
    httpOnly: true,
    secure: isProduction, // true in production (requires HTTPS)
    sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-site in prod, 'lax' for local dev
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    path: '/', // Cookie available for all paths
    domain: isProduction ? '.limitscope.xyz' : undefined,
};

export class AuthController {
    async register(req: Request, res: Response, next: NextFunction) {
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
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
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
        } catch (error) {
            next(error);
        }
    }

    async getMe(req: any, res: Response, next: NextFunction) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }

            const user = await prisma.user.findUnique({
                where: { id: req.user.id },
                select: { id: true, email: true, accountStatus: true, createdAt: true }
            });

            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            // Add isAdmin from raw query or default to false
            const userWithAdmin = { ...user, isAdmin: (user as any).isAdmin || req.user.isAdmin || false };

            res.json({
                success: true,
                data: { user: userWithAdmin },
            });
        } catch (error) {
            next(error);
        }
    }

    async logout(req: Request, res: Response) {
        res.clearCookie('access_token');
        res.json({ success: true, message: 'Logged out successfully' });
    }

    async updateEmail(req: any, res: Response, next: NextFunction) {
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
        } catch (error) {
            next(error);
        }
    }

    async updatePassword(req: any, res: Response, next: NextFunction) {
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
        } catch (error) {
            next(error);
        }
    }
}
