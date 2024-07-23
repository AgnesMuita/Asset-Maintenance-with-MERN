/*
  Warnings:

  - Added the required column `updatedAt` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Asset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "updatedAt" TIMESTAMPTZ NOT NULL,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "Case" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "KnowledgeArticle" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "modifiedAt" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "Token" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ;
