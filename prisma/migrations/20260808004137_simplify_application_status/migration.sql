/*
  Warnings:

  - The values [BOOKMARKED,OFFER,GHOSTED] on the enum `ApplicationStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ApplicationStatus_new" AS ENUM ('APPLYING', 'APPLIED', 'SCREENING', 'INTERVIEW', 'TEST', 'OFFERING', 'ACCEPTED', 'REJECTED');
ALTER TABLE "public"."Application" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Application" ALTER COLUMN "status" TYPE "ApplicationStatus_new" USING ("status"::text::"ApplicationStatus_new");
ALTER TYPE "ApplicationStatus" RENAME TO "ApplicationStatus_old";
ALTER TYPE "ApplicationStatus_new" RENAME TO "ApplicationStatus";
DROP TYPE "public"."ApplicationStatus_old";
ALTER TABLE "Application" ALTER COLUMN "status" SET DEFAULT 'APPLIED';
COMMIT;

-- AlterTable
ALTER TABLE "Application" ALTER COLUMN "status" SET DEFAULT 'APPLIED';
