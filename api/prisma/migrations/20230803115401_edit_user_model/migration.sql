-- AlterTable
ALTER TABLE "Activity" ALTER COLUMN "startDate" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "dueDate" SET DATA TYPE TIMESTAMPTZ;

-- CreateTable
CREATE TABLE "Queue" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "caseTitle" VARCHAR(255) NOT NULL,
    "caseNumber" VARCHAR(50) NOT NULL,
    "subject" VARCHAR(100) NOT NULL,
    "priority" TEXT NOT NULL,
    "status" TEXT,
    "origin" TEXT NOT NULL,
    "Description" VARCHAR(255) NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "technician" TEXT,
    "ownerId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,

    CONSTRAINT "Queue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
