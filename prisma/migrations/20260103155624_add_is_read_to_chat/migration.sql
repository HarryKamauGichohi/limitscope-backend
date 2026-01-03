-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN     "caseId" TEXT,
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PayPalCase" ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "paidPlan" TEXT;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "PayPalCase"("id") ON DELETE SET NULL ON UPDATE CASCADE;
