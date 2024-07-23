/*
  Warnings:

  - You are about to drop the column `expiration` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `valid` on the `Token` table. All the data in the column will be lost.
  - Added the required column `hashedToken` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Token" DROP COLUMN "expiration",
DROP COLUMN "type",
DROP COLUMN "valid",
ADD COLUMN     "hashedToken" TEXT NOT NULL,
ADD COLUMN     "revoked" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropEnum
DROP TYPE "TokenType";
