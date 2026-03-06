-- CreateEnum
CREATE TYPE "PassStatus" AS ENUM ('NONE', 'PENDING', 'APPROVED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "is_junior" BOOLEAN NOT NULL DEFAULT true,
    "pass_status" "PassStatus" NOT NULL DEFAULT 'NONE',
    "otp" TEXT,
    "otp_expiration" TIMESTAMP(3),
    "password" TEXT NOT NULL,
    "college_name" TEXT NOT NULL DEFAULT 'PICT',
    "profile_pic" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");
