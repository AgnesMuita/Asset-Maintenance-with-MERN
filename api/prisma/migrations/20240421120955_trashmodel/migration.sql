-- CreateTable
CREATE TABLE "Trash" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trashedById" TEXT NOT NULL,
    "trashedCaseId" TEXT,
    "trashedUserId" TEXT,
    "trashedAssetId" TEXT,
    "trashedArticleId" TEXT,

    CONSTRAINT "Trash_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Trash_trashedById_key" ON "Trash"("trashedById");

-- AddForeignKey
ALTER TABLE "Trash" ADD CONSTRAINT "Trash_trashedById_fkey" FOREIGN KEY ("trashedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trash" ADD CONSTRAINT "Trash_trashedCaseId_fkey" FOREIGN KEY ("trashedCaseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trash" ADD CONSTRAINT "Trash_trashedUserId_fkey" FOREIGN KEY ("trashedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trash" ADD CONSTRAINT "Trash_trashedAssetId_fkey" FOREIGN KEY ("trashedAssetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trash" ADD CONSTRAINT "Trash_trashedArticleId_fkey" FOREIGN KEY ("trashedArticleId") REFERENCES "KnowledgeArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
