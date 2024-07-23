/*
  Warnings:

  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('BASIC', 'ADMIN', 'TECHNICIAN');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('HIGH', 'NORMAL', 'LOW');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('IN_PROGRESS', 'ON_HOLD', 'WAITING_FOR_DETAILS', 'RESEARCHING', 'PROBLEM_SOLVED', 'INFORMATION_PROVIDED');

-- AlterTable
ALTER TABLE "Case" ALTER COLUMN "assetId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'BASIC';
