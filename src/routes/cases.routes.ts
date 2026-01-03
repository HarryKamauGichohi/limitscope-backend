import { Router } from 'express';
import { CasesController } from '../controllers/cases.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const casesController = new CasesController();

// All routes here are protected
router.use(authenticate);

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

export default router;
