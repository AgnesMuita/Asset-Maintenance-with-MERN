/*
  Warnings:

  - The `tags` column on the `Announcement` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tags` column on the `Event` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `keywords` column on the `KnowledgeArticle` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tags` column on the `Maintenance` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tags` column on the `News` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Announcement" DROP COLUMN "tags",
ADD COLUMN     "tags" JSONB[];

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "tags",
ADD COLUMN     "tags" JSONB[];

-- AlterTable
ALTER TABLE "KnowledgeArticle" DROP COLUMN "keywords",
ADD COLUMN     "keywords" JSONB[];

-- AlterTable
ALTER TABLE "Maintenance" DROP COLUMN "tags",
ADD COLUMN     "tags" JSONB[];

-- AlterTable
ALTER TABLE "News" DROP COLUMN "tags",
ADD COLUMN     "tags" JSONB[];
