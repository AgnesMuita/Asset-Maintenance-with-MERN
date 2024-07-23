-- DropIndex
DROP INDEX "Trash_trashedById_key";

-- AlterTable
ALTER TABLE "Trash" ALTER COLUMN "trashedById" DROP NOT NULL;
