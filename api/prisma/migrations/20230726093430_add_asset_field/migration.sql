-- AlterTable
ALTER TABLE "Case" ADD COLUMN     "assetId" TEXT NOT NULL DEFAULT '3bdhg 7377hg 309hfaj';

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
