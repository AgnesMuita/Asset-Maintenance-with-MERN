/*
  Warnings:

  - A unique constraint covering the columns `[historyId]` on the table `AllocationForm` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `historyId` to the `AllocationForm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AllocationForm" ADD COLUMN     "historyId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AllocationForm_historyId_key" ON "AllocationForm"("historyId");

-- AddForeignKey
ALTER TABLE "AllocationForm" ADD CONSTRAINT "AllocationForm_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "AssetHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
