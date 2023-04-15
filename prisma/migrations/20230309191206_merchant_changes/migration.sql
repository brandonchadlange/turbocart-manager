/*
  Warnings:

  - You are about to drop the `Basket` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BasketItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MerchantUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `merchantId` to the `Menu` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Basket";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "BasketItem";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "MerchantUser";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "EventBasket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "EventBasketItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "basketId" TEXT NOT NULL,
    "menuStructureId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    CONSTRAINT "EventBasketItem_basketId_fkey" FOREIGN KEY ("basketId") REFERENCES "EventBasket" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EventBasketItem_menuStructureId_fkey" FOREIGN KEY ("menuStructureId") REFERENCES "MenuStructure" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StudentBasket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "StudentBasketItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "basketId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "menuStructureId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    CONSTRAINT "StudentBasketItem_basketId_fkey" FOREIGN KEY ("basketId") REFERENCES "StudentBasket" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StudentBasketItem_menuStructureId_fkey" FOREIGN KEY ("menuStructureId") REFERENCES "MenuStructure" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "StudentBasketItem_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Menu" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "merchantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    CONSTRAINT "Menu_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Menu" ("description", "id", "name") SELECT "description", "id", "name" FROM "Menu";
DROP TABLE "Menu";
ALTER TABLE "new_Menu" RENAME TO "Menu";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
