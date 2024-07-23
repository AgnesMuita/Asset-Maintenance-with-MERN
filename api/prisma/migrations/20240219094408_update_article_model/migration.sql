/*
  Warnings:

  - A unique constraint covering the columns `[relatedArticleId]` on the table `KnowledgeArticle` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "KnowledgeArticle" ADD COLUMN     "relatedArticleId" TEXT;

-- AlterTable
ALTER TABLE "Maintenance" ADD COLUMN     "createdById" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "KnowledgeArticle_relatedArticleId_key" ON "KnowledgeArticle"("relatedArticleId");

-- AddForeignKey
ALTER TABLE "KnowledgeArticle" ADD CONSTRAINT "KnowledgeArticle_relatedArticleId_fkey" FOREIGN KEY ("relatedArticleId") REFERENCES "KnowledgeArticle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Maintenance" ADD CONSTRAINT "Maintenance_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
