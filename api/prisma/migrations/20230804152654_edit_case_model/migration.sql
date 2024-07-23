/*
  Warnings:

  - You are about to alter the column `subject` on the `Queue` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE "Case" ALTER COLUMN "Description" SET DATA TYPE VARCHAR;

-- AlterTable
ALTER TABLE "Queue" ALTER COLUMN "subject" SET DATA TYPE VARCHAR(100);
