-- DropForeignKey
ALTER TABLE "AssetHistory" DROP CONSTRAINT "AssetHistory_assetId_fkey";

-- AddForeignKey
ALTER TABLE "AssetHistory" ADD CONSTRAINT "AssetHistory_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
