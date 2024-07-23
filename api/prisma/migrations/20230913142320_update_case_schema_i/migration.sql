/*
  Warnings:

  - The `priority` column on the `Case` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `origin` column on the `Case` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `status` to the `Case` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Origin" AS ENUM ('EMAIL', 'WEB', 'PHONE');

-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'OPEN';

-- AlterTable
ALTER TABLE "Case" DROP COLUMN "priority",
ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'NORMAL',
DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL,
DROP COLUMN "origin",
ADD COLUMN     "origin" "Origin" NOT NULL DEFAULT 'WEB';
