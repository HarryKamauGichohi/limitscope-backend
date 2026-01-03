import prisma from '../prisma/client';

export class UploadsService {
    async saveFileInfo(data: {
        fileName: string;
        filePath: string;
        fileType: string;
        caseId: string;
    }) {
        return prisma.uploadedDocument.create({
            data,
        });
    }
}
