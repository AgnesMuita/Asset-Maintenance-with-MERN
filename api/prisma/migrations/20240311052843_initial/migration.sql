/*
  Warnings:

  - You are about to drop the column `description` on the `Document` table. All the data in the column will be lost.
  - Added the required column `data` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Announcement" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "description",
ADD COLUMN     "data" BYTEA NOT NULL,
ALTER COLUMN "department" SET DEFAULT 'GLOBAL';

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "News" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;
