-- AlterEnum
ALTER TYPE "Department" ADD VALUE 'GLOBAL';

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "docType" TEXT NOT NULL,
    "docCategory" TEXT NOT NULL,
    "department" "Department" NOT NULL DEFAULT 'ADMINISTRATION',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
