/*
  Warnings:

  - You are about to drop the column `Description` on the `Queue` table. All the data in the column will be lost.
  - You are about to drop the column `caseNumber` on the `Queue` table. All the data in the column will be lost.
  - You are about to drop the column `caseTitle` on the `Queue` table. All the data in the column will be lost.
  - You are about to drop the column `origin` on the `Queue` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `Queue` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `Queue` table. All the data in the column will be lost.
  - Added the required column `description` to the `Queue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Queue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Queue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Asset" DROP CONSTRAINT "Asset_userId_fkey";

-- DropForeignKey
ALTER TABLE "Queue" DROP CONSTRAINT "Queue_assetId_fkey";

-- DropForeignKey
ALTER TABLE "Queue" DROP CONSTRAINT "Queue_ownerId_fkey";

-- AlterTable
ALTER TABLE "Activity" ALTER COLUMN "ownerId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Asset" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Queue" DROP COLUMN "Description",
DROP COLUMN "caseNumber",
DROP COLUMN "caseTitle",
DROP COLUMN "origin",
DROP COLUMN "priority",
DROP COLUMN "subject",
ADD COLUMN     "caseId" TEXT,
ADD COLUMN     "description" VARCHAR NOT NULL,
ADD COLUMN     "name" VARCHAR NOT NULL,
ADD COLUMN     "type" VARCHAR NOT NULL,
ALTER COLUMN "ownerId" DROP NOT NULL,
ALTER COLUMN "assetId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
