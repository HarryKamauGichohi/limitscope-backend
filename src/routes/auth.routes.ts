import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const authController = new AuthController();

// @route POST /api/auth/register
// @desc Register a new user
router.post('/register', authController.register);

// @route POST /api/auth/login
// @desc Login user and return JWT
router.post('/login', authController.login);

// @route GET /api/auth/me
// @desc Get current user profile
router.get('/me', authenticate, authController.getMe);

// @route POST /api/auth/logout
// @desc Logout user
router.post('/logout', authController.logout);

// @route PUT /api/auth/email
// @desc Update user email (admin settings)
router.put('/email', authenticate, authController.updateEmail);

// @route PUT /api/auth/password
// @desc Update user password (admin settings)
router.put('/password', authenticate, authController.updatePassword);

export default router;
