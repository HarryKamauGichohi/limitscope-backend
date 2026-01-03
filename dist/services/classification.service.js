"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassificationService = void 0;
class ClassificationService {
    async classify(input) {
        const { restrictionType, accountType } = input;
        // Default values
        let likelihood = 'MEDIUM';
        let fundLikelihood = 'MEDIUM';
        let recommendation = 'Provide all requested documentation and wait for our analyst review.';
        let classificationDetails = 'Standard compliance review triggered.';
        // Simplified rules-based logic
        if (restrictionType === 'FUNDS_RELEASE') {
            likelihood = 'HIGH';
            fundLikelihood = 'HIGH';
            recommendation = 'Ensure you have wait exactly 180 days since the limitation. Provide bank account details for withdrawal.';
            classificationDetails = 'Standard 180-day fund release case.';
        }
        else if (restrictionType === 'PERMANENT') {
            likelihood = 'LOW';
            fundLikelihood = 'MEDIUM';
            recommendation = 'Permanent limitations are difficult to reverse. Focus on professional appeal and clear business model explanation.';
            classificationDetails = 'Permanent account limitation detected.';
        }
        else if (restrictionType === 'KYC_VERIFICATION') {
            likelihood = 'HIGH';
            fundLikelihood = 'HIGH';
            recommendation = 'Upload your photo ID and a recent utility bill. Avoid blurry images.';
            classificationDetails = 'Standard identity verification request.';
        }
        else if (restrictionType === 'TEMPORARY') {
            likelihood = 'MEDIUM';
            fundLikelihood = 'MEDIUM';
            recommendation = 'Check your PayPal notification center for specific required steps. Usually resolved within 3-5 business days.';
            classificationDetails = 'Temporary limitation require immediate attention.';
        }
        // Adjust based on account type
        if (accountType === 'BUSINESS' && likelihood === 'MEDIUM') {
            recommendation += ' Be ready to provide supplier invoices and business license.';
        }
        return {
            likelihood,
            fundLikelihood,
            recommendation,
            classificationDetails
        };
    }
}
exports.ClassificationService = ClassificationService;
