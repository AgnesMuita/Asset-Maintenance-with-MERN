/*
  Warnings:

  - You are about to drop the column `name` on the `Media` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Media" DROP COLUMN "name",
ADD COLUMN     "createdOn" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "data" SET DATA TYPE TEXT;
