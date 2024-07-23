/*
  Warnings:

  - You are about to drop the column `media` on the `KnowledgeArticle` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "KnowledgeArticle" DROP COLUMN "media";

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "articleId" TEXT,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "KnowledgeArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
