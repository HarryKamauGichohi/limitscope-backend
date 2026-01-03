import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { UploadsService } from '../services/uploads.service';

const uploadsService = new UploadsService();

export class UploadsController {
    async uploadFile(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
            if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

            const { caseId, fileType } = req.body;
            if (!caseId || !fileType) {
                return res.status(400).json({ success: false, message: 'caseId and fileType are required' });
            }

            const fileInfo = await uploadsService.saveFileInfo({
                fileName: req.file.originalname,
                filePath: req.file.path,
                fileType,
                caseId,
            });

            res.status(201).json({
                success: true,
                data: fileInfo,
            });
        } catch (error) {
            next(error);
        }
    }
}
