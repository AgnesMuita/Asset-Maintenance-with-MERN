-- DropForeignKey
ALTER TABLE "Case" DROP CONSTRAINT "Case_assetId_fkey";

-- DropForeignKey
ALTER TABLE "Case" DROP CONSTRAINT "Case_ownerId_fkey";

-- AlterTable
ALTER TABLE "Case" ALTER COLUMN "ownerId" DROP NOT NULL,
ALTER COLUMN "assetId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
