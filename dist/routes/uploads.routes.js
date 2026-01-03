"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploads_controller_1 = require("../controllers/uploads.controller");
const multer_config_1 = require("../utils/multer.config");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const uploadsController = new uploads_controller_1.UploadsController();
// Protected routes
router.use(auth_middleware_1.authenticate);
// @route POST /api/uploads
// @desc Upload a file associated with a case
router.post('/', multer_config_1.upload.single('file'), uploadsController.uploadFile);
exports.default = router;
