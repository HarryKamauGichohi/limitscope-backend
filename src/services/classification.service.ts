export interface ClassificationInput {
    restrictionType: string;
    accountType: string;
    freeTextReason?: string;
    [key: string]: any; // Allow for expanded fields
}

export interface ClassificationResult {
    likelihood: 'HIGH' | 'MEDIUM' | 'LOW';
    fundLikelihood: 'HIGH' | 'MEDIUM' | 'LOW';
    recommendation: string;
    classificationDetails: string;
}

export class ClassificationService {
    async classify(input: ClassificationInput): Promise<ClassificationResult> {
        const { restrictionType, accountType } = input;

        // Default values
        let likelihood: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
        let fundLikelihood: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
        let recommendation = 'Provide all requested documentation and wait for our analyst review.';
        let classificationDetails = 'Standard compliance review triggered.';

        // Simplified rules-based logic
        if (restrictionType === 'FUNDS_RELEASE') {
            likelihood = 'HIGH';
            fundLikelihood = 'HIGH';
            recommendation = 'Ensure you have wait exactly 180 days since the limitation. Provide bank account details for withdrawal.';
            classificationDetails = 'Standard 180-day fund release case.';
        } else if (restrictionType === 'PERMANENT') {
            likelihood = 'LOW';
            fundLikelihood = 'MEDIUM';
            recommendation = 'Permanent limitations are difficult to reverse. Focus on professional appeal and clear business model explanation.';
            classificationDetails = 'Permanent account limitation detected.';
        } else if (restrictionType === 'KYC_VERIFICATION') {
            likelihood = 'HIGH';
            fundLikelihood = 'HIGH';
            recommendation = 'Upload your photo ID and a recent utility bill. Avoid blurry images.';
            classificationDetails = 'Standard identity verification request.';
        } else if (restrictionType === 'TEMPORARY') {
            likelihood = 'MEDIUM';
            fundLikelihood = 'MEDIUM';
            recommendation = 'Check your PayPal notification center for specific required steps. Usually resolved within 3-5 business days.';
            classificationDetails = 'Temporary limitation require immediate attention.';
        } else if (restrictionType === 'UNKNOWN') {
            likelihood = 'MEDIUM';
            fundLikelihood = 'LOW';
            recommendation = 'Our analyst will review your narrative to determine the limitation type. Please monitor your dashboard for updates.';
            classificationDetails = 'Unidentified restriction type - expert analysis required.';
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
