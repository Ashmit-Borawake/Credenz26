-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_event_id_fkey";

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
