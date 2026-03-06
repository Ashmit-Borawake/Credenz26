-- DropForeignKey
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_event_id_fkey";

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
