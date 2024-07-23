-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "caseId" TEXT,
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "parent" TEXT;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
