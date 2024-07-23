-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "accessories" TEXT,
ADD COLUMN     "adaptorRatings" TEXT,
ADD COLUMN     "assetStatus" TEXT,
ADD COLUMN     "batterySNo" TEXT,
ADD COLUMN     "condition" TEXT,
ADD COLUMN     "department" "Department" NOT NULL DEFAULT 'ADMINISTRATION';

-- CreateTable
CREATE TABLE "AssetHistory" (
    "issuedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMPTZ NOT NULL,
    "assetId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "issuedById" TEXT NOT NULL,

    CONSTRAINT "AssetHistory_pkey" PRIMARY KEY ("assetId","userId")
);

-- CreateIndex
CREATE INDEX "AssetHistory_assetId_idx" ON "AssetHistory"("assetId");

-- AddForeignKey
ALTER TABLE "AssetHistory" ADD CONSTRAINT "AssetHistory_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetHistory" ADD CONSTRAINT "AssetHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetHistory" ADD CONSTRAINT "AssetHistory_issuedById_fkey" FOREIGN KEY ("issuedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
