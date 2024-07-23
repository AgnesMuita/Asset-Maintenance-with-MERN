/*
  Warnings:

  - Added the required column `title` to the `Queue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Queue" ADD COLUMN     "title" VARCHAR NOT NULL;
