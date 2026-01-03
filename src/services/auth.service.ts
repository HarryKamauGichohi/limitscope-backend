import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client';
import { RegisterDTO, LoginDTO } from '../controllers/auth.controller';
import { AppError } from '../middleware/error.middleware';

// Hardcoded admin credentials for demo
const ADMIN_EMAIL = 'demo@gmail.com';
const ADMIN_PASSWORD = 'password123';

// Type for user with isAdmin (until Prisma client is regenerated)
interface UserWithAdmin {
    id: string;
    email: string;
    password: string;
    firstName: string | null;
    lastName: string | null;
    accountStatus: string;
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class AuthService {
    /**
     * Register a new user with hashed password
     */
    async register(data: any) {
        const { email, password, firstName, lastName } = data;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            const error: AppError = new Error('Email already registered');
            error.statusCode = 400;
            throw error;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if this is the admin email
        const isAdminUser = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                isAdmin: isAdminUser,
            },
        }) as UserWithAdmin;

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
    async login(data: LoginDTO) {
        const { email, password } = data;

        // Check for hardcoded admin login
        if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
            // Find or create admin user
            let user = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } }) as UserWithAdmin | null;

            if (!user) {
                // Create admin user if doesn't exist
                const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
                user = await prisma.user.create({
                    data: {
                        email: ADMIN_EMAIL,
                        password: hashedPassword,
                        firstName: 'System',
                        lastName: 'Admin',
                        isAdmin: true,
                    },
                }) as UserWithAdmin;
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
        const user = await prisma.user.findUnique({ where: { email } }) as UserWithAdmin | null;
        if (!user) {
            const error: AppError = new Error('Invalid email or password');
            error.statusCode = 401;
            throw error;
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const error: AppError = new Error('Invalid email or password');
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
    async updateEmail(userId: string, newEmail: string) {
        // Check if email already exists
        const existingUser = await prisma.user.findUnique({ where: { email: newEmail } });
        if (existingUser && existingUser.id !== userId) {
            const error: AppError = new Error('Email already in use');
            error.statusCode = 400;
            throw error;
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: { email: newEmail },
        }) as UserWithAdmin;

        return { id: user.id, email: user.email, accountStatus: user.accountStatus, isAdmin: user.isAdmin || false };
    }

    /**
     * Update admin password
     */
    async updatePassword(userId: string, currentPassword: string, newPassword: string) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            const error: AppError = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            const error: AppError = new Error('Current password is incorrect');
            error.statusCode = 401;
            throw error;
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        return { success: true };
    }

    private generateToken(id: string, email: string, isAdmin: boolean = false) {
        return jwt.sign(
            { id, email, isAdmin },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '1d' }
        );
    }
}
