-- AlterTable
ALTER TABLE "KnowledgeArticle" ADD COLUMN     "articleSubject" TEXT,
ADD COLUMN     "keywords" TEXT,
ALTER COLUMN "majorVNo" SET DEFAULT 0,
ALTER COLUMN "minorVNo" SET DEFAULT 0;
