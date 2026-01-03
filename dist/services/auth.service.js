"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = __importDefault(require("../prisma/client"));
class AuthService {
    /**
     * Register a new user with hashed password
     */
    async register(data) {
        const { email, password } = data;
        // Check if user already exists
        const existingUser = await client_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            const error = new Error('Email already registered');
            error.statusCode = 400;
            throw error;
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Create user
        const user = await client_1.default.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
        // Generate JWT
        const token = this.generateToken(user.id, user.email);
        return {
            user: { id: user.id, email: user.email },
            token,
        };
    }
    /**
     * Authenticate user with email and password
     */
    async login(data) {
        const { email, password } = data;
        // Find user
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
        const token = this.generateToken(user.id, user.email);
        return {
            user: { id: user.id, email: user.email },
            token,
        };
    }
    generateToken(id, email) {
        return jsonwebtoken_1.default.sign({ id, email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    }
}
exports.AuthService = AuthService;
