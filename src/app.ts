import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';

import authRoutes from './routes/auth.routes';
import casesRoutes from './routes/cases.routes';
import uploadsRoutes from './routes/uploads.routes';
import adminRoutes from './routes/admin.routes';
import chatRoutes from './routes/chat.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();
const isProduction = process.env.NODE_ENV === 'production';

/**
 * ======================
 * SECURITY MIDDLEWARE
 * ======================
 */
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
);

/**
 * ======================
 * CORS CONFIG
 * ======================
 */
const allowedOrigins = [
    process.env.FRONTEND_URL || 'https://www.limitscope.xyz',
    'https://limitscope.xyz',
    'http://localhost:3000',
];

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like Postman or server-to-server)
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error(`CORS policy: Origin ${origin} not allowed`));
            }
        },
        credentials: true, // Allow cookies/auth headers
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
        exposedHeaders: ['Set-Cookie'],
    })
);

/**
 * ======================
 * BODY PARSERS & COOKIE
 * ======================
 */
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * ======================
 * STATIC FILES
 * ======================
 */
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

/**
 * ======================
 * ROUTES
 * ======================
 */
app.use('/api/auth', authRoutes);
app.use('/api/cases', casesRoutes);
app.use('/api/uploads', uploadsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);

/**
 * ======================
 * ERROR HANDLER
 * ======================
 */
app.use(errorHandler);

export default app;
