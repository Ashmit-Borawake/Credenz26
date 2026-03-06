/*
  Warnings:

  - You are about to drop the column `event_id` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `event_id` on the `orders` table. All the data in the column will be lost.
  - Added the required column `event_slug` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_event_id_fkey";

-- AlterTable
ALTER TABLE "cart_items" DROP COLUMN "event_id";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "event_id",
ADD COLUMN     "event_slug" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_event_slug_fkey" FOREIGN KEY ("event_slug") REFERENCES "events"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
