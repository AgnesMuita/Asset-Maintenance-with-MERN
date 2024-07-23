/*
  Warnings:

  - A unique constraint covering the columns `[firstName,lastName]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ItemCount" ADD COLUMN     "fixed" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "cases" SET DEFAULT 0,
ALTER COLUMN "users" SET DEFAULT 0,
ALTER COLUMN "assets" SET DEFAULT 0,
ALTER COLUMN "articles" SET DEFAULT 0,
ALTER COLUMN "documents" SET DEFAULT 0,
ALTER COLUMN "logs" SET DEFAULT 0,
ALTER COLUMN "announcements" SET DEFAULT 0,
ALTER COLUMN "news" SET DEFAULT 0,
ALTER COLUMN "events" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "User_firstName_lastName_key" ON "User"("firstName", "lastName");
