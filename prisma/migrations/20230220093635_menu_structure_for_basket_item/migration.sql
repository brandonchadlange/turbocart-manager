/*
  Warnings:

  - You are about to drop the column `categoryId` on the `BasketItem` table. All the data in the column will be lost.
  - You are about to drop the column `listingId` on the `BasketItem` table. All the data in the column will be lost.
  - You are about to drop the column `menuId` on the `BasketItem` table. All the data in the column will be lost.
  - Added the required column `menuStructureId` to the `BasketItem` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BasketItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "basketId" TEXT NOT NULL,
    "menuStructureId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    CONSTRAINT "BasketItem_basketId_fkey" FOREIGN KEY ("basketId") REFERENCES "Basket" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BasketItem_menuStructureId_fkey" FOREIGN KEY ("menuStructureId") REFERENCES "MenuStructure" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BasketItem" ("basketId", "id", "quantity") SELECT "basketId", "id", "quantity" FROM "BasketItem";
DROP TABLE "BasketItem";
ALTER TABLE "new_BasketItem" RENAME TO "BasketItem";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
