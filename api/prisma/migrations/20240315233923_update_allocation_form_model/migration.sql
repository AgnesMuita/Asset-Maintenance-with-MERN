/*
  Warnings:

  - Added the required column `relatedId` to the `AllocationForm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AllocationForm" ADD COLUMN     "relatedId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "AllocationForm" ADD CONSTRAINT "AllocationForm_relatedId_fkey" FOREIGN KEY ("relatedId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
