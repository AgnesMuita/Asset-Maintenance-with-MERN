/*
  Warnings:

  - A unique constraint covering the columns `[assetId,userId]` on the table `AssetHistory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AssetHistory_assetId_userId_key" ON "AssetHistory"("assetId", "userId");
