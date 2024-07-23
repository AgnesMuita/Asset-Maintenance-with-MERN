-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "logId" TEXT;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_logId_fkey" FOREIGN KEY ("logId") REFERENCES "Maintenance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
