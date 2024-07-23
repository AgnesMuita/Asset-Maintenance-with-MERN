/*
  Warnings:

  - The values [PHONE] on the enum `Origin` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Origin_new" AS ENUM ('EMAIL', 'WEB', 'MOBILE');
ALTER TABLE "Case" ALTER COLUMN "origin" DROP DEFAULT;
ALTER TABLE "Case" ALTER COLUMN "origin" TYPE "Origin_new" USING ("origin"::text::"Origin_new");
ALTER TYPE "Origin" RENAME TO "Origin_old";
ALTER TYPE "Origin_new" RENAME TO "Origin";
DROP TYPE "Origin_old";
ALTER TABLE "Case" ALTER COLUMN "origin" SET DEFAULT 'WEB';
COMMIT;
