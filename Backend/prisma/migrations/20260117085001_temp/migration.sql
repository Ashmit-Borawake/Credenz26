/*
  Warnings:

  - Added the required column `event_slug` to the `cart_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_event_id_fkey";

-- AlterTable
ALTER TABLE "cart_items" ADD COLUMN     "event_slug" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_event_slug_fkey" FOREIGN KEY ("event_slug") REFERENCES "events"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
