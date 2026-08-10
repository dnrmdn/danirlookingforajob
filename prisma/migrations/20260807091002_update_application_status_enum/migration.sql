-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ApplicationStatus" ADD VALUE 'SCREENING';
ALTER TYPE "ApplicationStatus" ADD VALUE 'TEST';
ALTER TYPE "ApplicationStatus" ADD VALUE 'OFFERING';
ALTER TYPE "ApplicationStatus" ADD VALUE 'ACCEPTED';
