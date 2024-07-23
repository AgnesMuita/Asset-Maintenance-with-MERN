/*
  Warnings:

  - You are about to drop the column `perfomedBy` on the `Maintenance` table. All the data in the column will be lost.
  - You are about to drop the column `relatedAsset` on the `Maintenance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Announcement" ADD COLUMN     "title" TEXT,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Maintenance" DROP COLUMN "perfomedBy",
DROP COLUMN "relatedAsset",
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "title" TEXT;

-- AlterTable
ALTER TABLE "News" ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
