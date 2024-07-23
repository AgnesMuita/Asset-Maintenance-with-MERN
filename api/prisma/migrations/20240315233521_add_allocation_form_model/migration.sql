-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdById" TEXT;

-- CreateTable
CREATE TABLE "AllocationForm" (
    "id" TEXT NOT NULL,
    "fileMeta" JSONB[],
    "data" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "userId" TEXT,
    "modifierId" TEXT,

    CONSTRAINT "AllocationForm_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllocationForm" ADD CONSTRAINT "AllocationForm_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AllocationForm" ADD CONSTRAINT "AllocationForm_modifierId_fkey" FOREIGN KEY ("modifierId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
