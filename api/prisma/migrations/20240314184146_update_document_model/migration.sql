/*
  Warnings:

  - You are about to drop the column `fileSize` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `filename` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `mimeType` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `path` on the `Document` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "fileSize",
DROP COLUMN "filename",
DROP COLUMN "mimeType",
DROP COLUMN "path",
ADD COLUMN     "fileMeta" JSONB[];
