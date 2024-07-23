/*
  Warnings:

  - Made the column `majorVNo` on table `KnowledgeArticle` required. This step will fail if there are existing NULL values in that column.
  - Made the column `minorVNo` on table `KnowledgeArticle` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "KnowledgeArticle" ADD COLUMN     "expirationDate" TIMESTAMPTZ,
ADD COLUMN     "reviewStatus" TEXT,
ADD COLUMN     "stage" TEXT,
ALTER COLUMN "majorVNo" SET NOT NULL,
ALTER COLUMN "minorVNo" SET NOT NULL;
