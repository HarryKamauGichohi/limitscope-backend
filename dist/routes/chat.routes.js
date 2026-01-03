"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_controller_1 = require("../controllers/chat.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const chatController = new chat_controller_1.ChatController();
// Shared auth
router.use(auth_middleware_1.authenticate);
// Client routes
router.get('/messages/:caseId', chatController.getMyMessages);
router.post('/messages/:caseId', chatController.sendMessageToAdmin);
// Admin routes
router.get('/conversations', auth_middleware_1.isAdmin, chatController.getConversations);
router.get('/messages/:userId', auth_middleware_1.isAdmin, chatController.getUserMessages);
router.post('/messages/:userId', auth_middleware_1.isAdmin, chatController.replyToUser);
exports.default = router;
