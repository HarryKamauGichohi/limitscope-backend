import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './error.middleware';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        isAdmin?: boolean;
    };
}

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    // Check for token in cookies first (primary method), then fallback to Authorization header
    const token = req.cookies?.access_token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        console.log('[Auth] No token found. Cookies:', Object.keys(req.cookies || {}));
        console.log('[Auth] Authorization header:', req.headers.authorization || 'none');
        const error: AppError = new Error('No token provided');
        error.statusCode = 401;
        // Don't log full stack trace for "No token" as it's common for initial page loads
        (error as any).isOperational = true;
        return next(error);
    }

    console.log('[Auth] Token found, authenticating...');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
            id: string;
            email: string;
            isAdmin?: boolean;
        };
        req.user = decoded;
        next();
    } catch (err) {
        const error: AppError = new Error('Invalid or expired token');
        error.statusCode = 401;
        (error as any).isOperational = true;
        next(error);
    }
};

export const isAdmin = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        const error: AppError = new Error('Forbidden: Admin access required');
        error.statusCode = 403;
        next(error);
    }
};
