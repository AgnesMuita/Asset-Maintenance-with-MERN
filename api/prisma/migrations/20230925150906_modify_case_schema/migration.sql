-- CreateEnum
CREATE TYPE "CurrStatus" AS ENUM ('ACTIVE', 'RESOLVED', 'CANCELLED', 'MERGED');

-- AlterTable
ALTER TABLE "Case" ADD COLUMN     "currStatus" "CurrStatus" NOT NULL DEFAULT 'ACTIVE';
