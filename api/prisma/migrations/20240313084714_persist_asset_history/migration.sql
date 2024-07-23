/*
  Warnings:

  - Added the required column `assetConditionalNotes` to the `AssetHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assetCondtion` to the `AssetHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assetLocation` to the `AssetHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assetStatus` to the `AssetHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AssetHistory" DROP CONSTRAINT "AssetHistory_assetId_fkey";

-- AlterTable
ALTER TABLE "AssetHistory" ADD COLUMN     "assetConditionalNotes" TEXT NOT NULL,
ADD COLUMN     "assetCondtion" TEXT NOT NULL,
ADD COLUMN     "assetLocation" TEXT NOT NULL,
ADD COLUMN     "assetStatus" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "AssetHistory" ADD CONSTRAINT "AssetHistory_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
