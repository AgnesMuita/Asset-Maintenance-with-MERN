/*
  Warnings:

  - You are about to drop the column `masterAsset` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `parentAsset` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `product` on the `Asset` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tag]` on the table `Asset` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "masterAsset",
DROP COLUMN "parentAsset",
DROP COLUMN "product",
ADD COLUMN     "color" TEXT,
ADD COLUMN     "conditionalNotes" VARCHAR,
ADD COLUMN     "issuedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "manufacturer" TEXT,
ADD COLUMN     "model" TEXT,
ADD COLUMN     "owner" TEXT,
ADD COLUMN     "serialNo" TEXT,
ADD COLUMN     "tag" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Asset_tag_key" ON "Asset"("tag");
