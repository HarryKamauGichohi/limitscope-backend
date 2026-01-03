"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cases_controller_1 = require("../controllers/cases.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const casesController = new cases_controller_1.CasesController();
// All routes here are protected
router.use(auth_middleware_1.authenticate);
// @route GET /api/cases
// @desc Get all cases for the logged-in user
router.get('/', casesController.getMyCases);
// @route POST /api/cases
// @desc Create a new case
router.post('/', casesController.createCase);
// @route GET /api/cases/:id
// @desc Get case details by ID
router.get('/:id', casesController.getCaseDetails);
// @route PUT /api/cases/:id/view-results
// @desc Mark classification results as viewed
router.put('/:id/view-results', casesController.viewResults);
// @route PUT /api/cases/:id/pay
// @desc Verify payment for recovery steps
router.put('/:id/pay', casesController.payCase);
exports.default = router;
