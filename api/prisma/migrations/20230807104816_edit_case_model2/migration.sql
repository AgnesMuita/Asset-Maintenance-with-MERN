/*
  Warnings:

  - A unique constraint covering the columns `[caseNumber]` on the table `Case` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Queue" ALTER COLUMN "caseTitle" SET DATA TYPE VARCHAR,
ALTER COLUMN "caseNumber" SET DATA TYPE VARCHAR,
ALTER COLUMN "subject" SET DATA TYPE VARCHAR;

-- CreateIndex
CREATE UNIQUE INDEX "Case_caseNumber_key" ON "Case"("caseNumber");
