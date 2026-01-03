"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = __importDefault(require("../prisma/client"));
// Hardcoded admin credentials for demo
const ADMIN_EMAIL = 'demo@gmail.com';
const ADMIN_PASSWORD = 'password123';
class AuthService {
    /**
     * Register a new user with hashed password
     */
    async register(data) {
        const { email, password, firstName, lastName } = data;
        // Check if user already exists
        const existingUser = await client_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            const error = new Error('Email already registered');
            error.statusCode = 400;
            throw error;
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Check if this is the admin email
        const isAdminUser = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
        // Create user
        const user = await client_1.default.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                isAdmin: isAdminUser,
            },
        });
        // Generate JWT
        const token = this.generateToken(user.id, user.email, isAdminUser);
        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                accountStatus: user.accountStatus,
                isAdmin: isAdminUser
            },
            token,
        };
    }
    /**
     * Authenticate user with email and password
     */
    async login(data) {
        const { email, password } = data;
        // Check for hardcoded admin login
        if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
            // Find or create admin user
            let user = await client_1.default.user.findUnique({ where: { email: ADMIN_EMAIL } });
            if (!user) {
                // Create admin user if doesn't exist
                const hashedPassword = await bcryptjs_1.default.hash(ADMIN_PASSWORD, 10);
                user = await client_1.default.user.create({
                    data: {
                        email: ADMIN_EMAIL,
                        password: hashedPassword,
                        firstName: 'System',
                        lastName: 'Admin',
                        isAdmin: true,
                    },
                });
            }
            const token = this.generateToken(user.id, user.email, true);
            return {
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    accountStatus: user.accountStatus,
                    isAdmin: true
                },
                token,
            };
        }
        // Regular user login
        const user = await client_1.default.user.findUnique({ where: { email } });
        if (!user) {
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            throw error;
        }
        // Verify password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            const error = new Error('Invalid email or password');
            error.statusCode = 401;
            throw error;
        }
        // Generate JWT
        const token = this.generateToken(user.id, user.email, user.isAdmin);
        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                accountStatus: user.accountStatus,
                isAdmin: user.isAdmin
            },
            token,
        };
    }
    /**
     * Update admin email
     */
    async updateEmail(userId, newEmail) {
        // Check if email already exists
        const existingUser = await client_1.default.user.findUnique({ where: { email: newEmail } });
        if (existingUser && existingUser.id !== userId) {
            const error = new Error('Email already in use');
            error.statusCode = 400;
            throw error;
        }
        const user = await client_1.default.user.update({
            where: { id: userId },
            data: { email: newEmail },
        });
        return { id: user.id, email: user.email, accountStatus: user.accountStatus, isAdmin: user.isAdmin || false };
    }
    /**
     * Update admin password
     */
    async updatePassword(userId, currentPassword, newPassword) {
        const user = await client_1.default.user.findUnique({ where: { id: userId } });
        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }
        // Verify current password
        const isPasswordValid = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            const error = new Error('Current password is incorrect');
            error.statusCode = 401;
            throw error;
        }
        // Hash new password
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await client_1.default.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        return { success: true };
    }
    generateToken(id, email, isAdmin = false) {
        return jsonwebtoken_1.default.sign({ id, email, isAdmin }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    }
}
exports.AuthService = AuthService;
