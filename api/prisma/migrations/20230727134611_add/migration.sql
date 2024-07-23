/*
  Warnings:

  - You are about to drop the column `emailToken` on the `Token` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Token" DROP COLUMN "emailToken",
ALTER COLUMN "type" DROP NOT NULL,
ALTER COLUMN "type" SET DEFAULT 'API';
