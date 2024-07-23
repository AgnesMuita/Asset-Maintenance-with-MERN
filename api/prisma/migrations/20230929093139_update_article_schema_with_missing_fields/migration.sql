-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('INTERNAL', 'EXTERNAL');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('ENGLISH', 'SPANISH', 'RUSSIAN', 'FRENCH');

-- AlterTable
ALTER TABLE "KnowledgeArticle" ADD COLUMN     "language" "Language" NOT NULL DEFAULT 'ENGLISH',
ADD COLUMN     "modifierId" TEXT,
ADD COLUMN     "publishSubject" TEXT,
ADD COLUMN     "publishedOn" TIMESTAMPTZ,
ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT 'EXTERNAL';

-- AddForeignKey
ALTER TABLE "KnowledgeArticle" ADD CONSTRAINT "KnowledgeArticle_modifierId_fkey" FOREIGN KEY ("modifierId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
