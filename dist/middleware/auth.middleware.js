"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
    // Check for token in cookies first (primary method), then fallback to Authorization header
    const token = req.cookies?.access_token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        console.log('[Auth] No token found. Cookies:', Object.keys(req.cookies || {}));
        console.log('[Auth] Authorization header:', req.headers.authorization || 'none');
        const error = new Error('No token provided');
        error.statusCode = 401;
        // Don't log full stack trace for "No token" as it's common for initial page loads
        error.isOperational = true;
        return next(error);
    }
    console.log('[Auth] Token found, authenticating...');
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded;
        next();
    }
    catch (err) {
        const error = new Error('Invalid or expired token');
        error.statusCode = 401;
        error.isOperational = true;
        next(error);
    }
};
exports.authenticate = authenticate;
const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    }
    else {
        const error = new Error('Forbidden: Admin access required');
        error.statusCode = 403;
        next(error);
    }
};
exports.isAdmin = isAdmin;
