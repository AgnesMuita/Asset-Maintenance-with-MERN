/*
  Warnings:

  - The values [FINANCE_ICT] on the enum `Department` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Department_new" AS ENUM ('ADMINISTRATION', 'PLANT', 'LOGISTICS', 'SALES');
ALTER TABLE "User" ALTER COLUMN "department" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "department" TYPE "Department_new" USING ("department"::text::"Department_new");
ALTER TYPE "Department" RENAME TO "Department_old";
ALTER TYPE "Department_new" RENAME TO "Department";
DROP TYPE "Department_old";
ALTER TABLE "User" ALTER COLUMN "department" SET DEFAULT 'ADMINISTRATION';
COMMIT;
