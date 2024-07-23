-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "allocationCheck" TEXT,
ADD COLUMN     "approvalStatus" BOOLEAN DEFAULT false,
ADD COLUMN     "outsidePolicy" BOOLEAN DEFAULT false,
ADD COLUMN     "reason" VARCHAR,
ADD COLUMN     "returnActualDate" TIMESTAMPTZ,
ADD COLUMN     "returnDueDate" TIMESTAMPTZ;

-- CreateTable
CREATE TABLE "AssetCheck" (
    "id" TEXT NOT NULL,
    "name" VARCHAR NOT NULL,
    "rating" INTEGER NOT NULL,
    "notes" VARCHAR NOT NULL,
    "checkType" TEXT NOT NULL,
    "checkResult" TEXT NOT NULL,
    "checkedDate" TIMESTAMPTZ NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "assetId" TEXT NOT NULL,
    "checkedById" TEXT,
    "createdById" TEXT,
    "relatedAllocationId" TEXT,

    CONSTRAINT "AssetCheck_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AssetCheck" ADD CONSTRAINT "AssetCheck_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetCheck" ADD CONSTRAINT "AssetCheck_checkedById_fkey" FOREIGN KEY ("checkedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetCheck" ADD CONSTRAINT "AssetCheck_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetCheck" ADD CONSTRAINT "AssetCheck_relatedAllocationId_fkey" FOREIGN KEY ("relatedAllocationId") REFERENCES "AssetHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
