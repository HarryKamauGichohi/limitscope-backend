import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { CasesService } from '../services/cases.service';

const casesService = new CasesService();

export interface CreateCaseDTO {
    title: string;
    description?: string;
    country?: string;
    accountType?: string;
    restrictionType?: string;
    freeTextReason?: string;
    transactionSummary?: string;

    // Expanded Intake Questions
    hasUploadedIDBefore?: boolean;
    nameMatchesID?: boolean;
    hasHadUploadRejected?: boolean;
    sellingGoodsOrServices?: string;
    customerCount30Days?: string;
    issuesInvoices?: boolean;
    isFirstTimeReceiving?: boolean;
    providedTrackingOrReason?: boolean;
    disputeCount90Days?: string;
    deliveryComplaints?: boolean;
    whatExactlyDoYouSell?: string;
    sellsProhibitedItems?: boolean;
    declaredBusiness?: string;
    actualCustomerPaymentFor?: string;
    hadOtherAccounts?: string;
    otherPersonUsingDevice?: string;
    reachedOutToPayPal?: string;
    whatDidYouTellPayPal?: string;
    changedExplanation?: boolean;
    movedFundsBetweenAccounts?: boolean;
    transferredToSameDevice?: boolean;
    attemptedEarlyWithdrawal?: boolean;
    physicalLocation?: string;
    usedVPN?: boolean;
    suddenVolumeIncrease?: boolean;
    whyVolumeIncreased?: string;
    viralSaleOrContract?: boolean;
    longTermInactive?: boolean;
    inactiveDuration?: string;
}

export class CasesController {
    async getMyCases(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

            const cases = await casesService.getAllCases(req.user.id);
            res.json({ success: true, data: cases });
        } catch (error) {
            next(error);
        }
    }

    async createCase(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

            const data: CreateCaseDTO = req.body;
            if (!data.title) {
                return res.status(400).json({ success: false, message: 'Title is required' });
            }

            const newCase = await casesService.createCase(req.user.id, data);
            res.status(201).json({ success: true, data: newCase });
        } catch (error) {
            next(error);
        }
    }

    async getCaseDetails(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

            const { id } = req.params;
            const caseItem = await casesService.getCaseById(id, req.user.id);

            if (!caseItem) {
                return res.status(404).json({ success: false, message: 'Case not found' });
            }

            res.json({ success: true, data: caseItem });
        } catch (error) {
            next(error);
        }
    }

    async viewResults(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

            const { id } = req.params;
            await casesService.markAsViewed(id, req.user.id);
            res.json({ success: true, message: 'Classification marked as viewed' });
        } catch (error) {
            next(error);
        }
    }

    async payCase(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

            const { id } = req.params;
            const { plan } = req.body;
            await casesService.payCase(id, req.user.id, plan);
            res.json({ success: true, message: 'Payment verified and case updated' });
        } catch (error) {
            next(error);
        }
    }
}
