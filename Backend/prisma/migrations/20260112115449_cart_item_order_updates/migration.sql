/*
  Warnings:

  - You are about to drop the column `user_id` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `user_id_1` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `user_id_2` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `user_id_3` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `user_id_4` on the `orders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_user_id_fkey";

-- DropIndex
DROP INDEX "cart_items_user_id_event_id_key";

-- AlterTable
ALTER TABLE "cart_items" DROP COLUMN "user_id",
ADD COLUMN     "teamname" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "username_1" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "username_2" TEXT,
ADD COLUMN     "username_3" TEXT,
ADD COLUMN     "username_4" TEXT;

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "max_team_size" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "user_id_1",
DROP COLUMN "user_id_2",
DROP COLUMN "user_id_3",
DROP COLUMN "user_id_4",
ADD COLUMN     "teamname" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "username_1" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "username_2" TEXT,
ADD COLUMN     "username_3" TEXT,
ADD COLUMN     "username_4" TEXT;
