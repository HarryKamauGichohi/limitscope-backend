"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
// @route POST /api/auth/register
// @desc Register a new user
router.post('/register', authController.register);
// @route POST /api/auth/login
// @desc Login user and return JWT
router.post('/login', authController.login);
// @route GET /api/auth/me
// @desc Get current user profile
router.get('/me', auth_middleware_1.authenticate, authController.getMe);
// @route POST /api/auth/logout
// @desc Logout user
router.post('/logout', authController.logout);
// @route PUT /api/auth/email
// @desc Update user email (admin settings)
router.put('/email', auth_middleware_1.authenticate, authController.updateEmail);
// @route PUT /api/auth/password
// @desc Update user password (admin settings)
router.put('/password', auth_middleware_1.authenticate, authController.updatePassword);
exports.default = router;
