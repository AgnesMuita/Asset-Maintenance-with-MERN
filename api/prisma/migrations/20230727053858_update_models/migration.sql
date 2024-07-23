/*
  Warnings:

  - You are about to alter the column `description` on the `Activity` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(500)`.
  - You are about to alter the column `name` on the `Asset` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(100)`.
  - You are about to alter the column `specification` on the `Asset` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(500)`.
  - You are about to alter the column `title` on the `KnowledgeArticle` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(100)`.
  - You are about to alter the column `description` on the `KnowledgeArticle` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(500)`.
  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `phone` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(25)`.
  - Added the required column `updatedAt` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `department` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Department" AS ENUM ('FINANCE_ICT', 'PLANT_OPERATIONS', 'LOGISTICS_SUPPLY', 'SALES_MARKETING', 'HUMAN_RESOURCES');

-- AlterTable
ALTER TABLE "Activity" ALTER COLUMN "description" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "Asset" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "specification" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "Case" ADD COLUMN     "resolved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "KnowledgeArticle" ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "password" VARCHAR(255) NOT NULL,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(25),
DROP COLUMN "department",
ADD COLUMN     "department" "Department" NOT NULL,
ALTER COLUMN "jobTitle" DROP NOT NULL,
ALTER COLUMN "contactMethod" DROP NOT NULL;

-- CreateTable
CREATE TABLE "_Followers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Followers_AB_unique" ON "_Followers"("A", "B");

-- CreateIndex
CREATE INDEX "_Followers_B_index" ON "_Followers"("B");

-- AddForeignKey
ALTER TABLE "_Followers" ADD CONSTRAINT "_Followers_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Followers" ADD CONSTRAINT "_Followers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
