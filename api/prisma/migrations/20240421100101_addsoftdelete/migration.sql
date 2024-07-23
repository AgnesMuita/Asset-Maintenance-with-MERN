-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "deletedAt" TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "Case" ADD COLUMN     "deletedAt" TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "KnowledgeArticle" ADD COLUMN     "deletedAt" TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deletedAt" TIMESTAMPTZ;
