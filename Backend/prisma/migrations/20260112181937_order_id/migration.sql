/*
  Warnings:

  - Added the required column `order_id` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "order_id" TEXT NOT NULL;
