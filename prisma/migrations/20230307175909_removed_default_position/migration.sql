-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MerchantGrade" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL
);
INSERT INTO "new_MerchantGrade" ("id", "name", "position") SELECT "id", "name", "position" FROM "MerchantGrade";
DROP TABLE "MerchantGrade";
ALTER TABLE "new_MerchantGrade" RENAME TO "MerchantGrade";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
