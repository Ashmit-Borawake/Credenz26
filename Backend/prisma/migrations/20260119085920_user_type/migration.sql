-- CreateEnum
CREATE TYPE "userType" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "user_type" "userType" NOT NULL DEFAULT 'USER';
