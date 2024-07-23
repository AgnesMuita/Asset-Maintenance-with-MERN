-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'T1';
ALTER TYPE "Role" ADD VALUE 'T2';
ALTER TYPE "Role" ADD VALUE 'SUPER_ADMIN';
ALTER TYPE "Role" ADD VALUE 'DEVELOPER';

-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "KnowledgeArticle" ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "draft" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "announcement" VARCHAR NOT NULL,
    "severity" "Priority" NOT NULL DEFAULT 'NORMAL',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" VARCHAR NOT NULL,
    "eventDate" TIMESTAMPTZ NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" VARCHAR NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Maintenance" (
    "id" TEXT NOT NULL,
    "description" VARCHAR NOT NULL,
    "perfomedBy" TEXT NOT NULL,
    "relatedAsset" TEXT,
    "remarks" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "assetId" TEXT,

    CONSTRAINT "Maintenance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Maintenance" ADD CONSTRAINT "Maintenance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Maintenance" ADD CONSTRAINT "Maintenance_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
