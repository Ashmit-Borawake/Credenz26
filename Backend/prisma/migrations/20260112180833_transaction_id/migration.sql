/*
  Warnings:

  - Added the required column `transaction_id` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "transaction_id" TEXT NOT NULL;
