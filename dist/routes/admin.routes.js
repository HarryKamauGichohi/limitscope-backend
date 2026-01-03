"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const adminController = new admin_controller_1.AdminController();
// All admin routes are protected
router.use(auth_middleware_1.authenticate, auth_middleware_1.isAdmin);
router.get('/cases', adminController.getCases);
router.put('/cases/:id/status', adminController.updateStatus);
router.put('/cases/:id/classify', adminController.updateClassification);
router.delete('/cases/:id', adminController.deleteCase);
router.post('/cases/:id/notes', adminController.addNote);
router.get('/users', adminController.getUsers);
router.get('/chat/:userId', adminController.getChat);
router.post('/chat/:userId', adminController.sendMessage);
exports.default = router;
