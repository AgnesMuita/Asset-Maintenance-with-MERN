/*
  Warnings:

  - The `articlePNumber` column on the `KnowledgeArticle` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "KnowledgeArticle" DROP CONSTRAINT "KnowledgeArticle_ownerId_fkey";

-- AlterTable
ALTER TABLE "KnowledgeArticle" ALTER COLUMN "title" SET DATA TYPE VARCHAR,
DROP COLUMN "articlePNumber",
ADD COLUMN     "articlePNumber" SERIAL NOT NULL,
ALTER COLUMN "description" SET DATA TYPE VARCHAR,
ALTER COLUMN "majorVNo" DROP NOT NULL,
ALTER COLUMN "minorVNo" DROP NOT NULL,
ALTER COLUMN "ownerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "KnowledgeArticle" ADD CONSTRAINT "KnowledgeArticle_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
