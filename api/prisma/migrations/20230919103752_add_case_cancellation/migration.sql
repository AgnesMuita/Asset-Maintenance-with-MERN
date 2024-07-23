-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Case" DROP CONSTRAINT "Case_assetId_fkey";

-- DropForeignKey
ALTER TABLE "Case" DROP CONSTRAINT "Case_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Queue" DROP CONSTRAINT "Queue_assetId_fkey";

-- DropForeignKey
ALTER TABLE "Queue" DROP CONSTRAINT "Queue_caseId_fkey";

-- DropForeignKey
ALTER TABLE "Queue" DROP CONSTRAINT "Queue_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_userId_fkey";

-- AlterTable
ALTER TABLE "Case" ADD COLUMN     "cancelled" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
