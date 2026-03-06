-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "actual_price" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "price_paid" INTEGER NOT NULL DEFAULT 0;
