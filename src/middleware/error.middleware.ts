import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Log error details
    // Suppress stack traces for 401 errors to keep console clean during auth checks
    if (statusCode === 401) {
        console.warn(`[Auth] 401: ${message} - ${req.method} ${req.path}`);
    } else {
        console.error(`[Error] ${statusCode}: ${message}`);
        if (err.stack) {
            console.error(err.stack);
        }
    }

    res.status(statusCode).json({
        success: false,
        message,
        // only include stack trace in development for non-401 errors
        stack: (process.env.NODE_ENV === 'development' && statusCode !== 401) ? err.stack : undefined,
    });
};
