/*
  Warnings:

  - The primary key for the `AssetHistory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `AssetHistory` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "AssetHistory" DROP CONSTRAINT "AssetHistory_issuedById_fkey";

-- DropForeignKey
ALTER TABLE "AssetHistory" DROP CONSTRAINT "AssetHistory_userId_fkey";

-- DropIndex
DROP INDEX "AssetHistory_assetId_userId_key";

-- AlterTable
ALTER TABLE "AssetHistory" DROP CONSTRAINT "AssetHistory_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "issuedById" DROP NOT NULL,
ADD CONSTRAINT "AssetHistory_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "AssetHistory" ADD CONSTRAINT "AssetHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetHistory" ADD CONSTRAINT "AssetHistory_issuedById_fkey" FOREIGN KEY ("issuedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
