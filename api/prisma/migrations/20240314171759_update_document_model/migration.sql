/*
  Warnings:

  - You are about to drop the column `title` on the `Document` table. All the data in the column will be lost.
  - Added the required column `fileSize` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "title",
ADD COLUMN     "fileSize" TEXT NOT NULL,
ADD COLUMN     "modifierId" TEXT,
ALTER COLUMN "data" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_modifierId_fkey" FOREIGN KEY ("modifierId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
