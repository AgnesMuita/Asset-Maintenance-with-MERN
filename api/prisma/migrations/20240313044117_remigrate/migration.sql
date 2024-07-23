/*
  Warnings:

  - You are about to drop the column `ports` on the `Asset` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "ports",
ADD COLUMN     "issuedBy" TEXT;
