-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Prospect" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "bedrijf" TEXT NOT NULL,
    "branche" TEXT NOT NULL,
    "plaats" TEXT NOT NULL,
    "regio" TEXT NOT NULL,
    "huidigeSite" TEXT,
    "contact" TEXT,
    "email" TEXT,
    "telefoon" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NIEUW',
    "pakket" TEXT,
    "bedrag" INTEGER,
    "perMaand" INTEGER,
    "gemaildOp" DATETIME,
    "opgevolgdOp" DATETIME,
    "gereageerdOp" DATETIME,
    "notitie" TEXT,
    "gepubliceerd" BOOLEAN NOT NULL DEFAULT false,
    "pitchActief" BOOLEAN NOT NULL DEFAULT true,
    "pitchPrijs" INTEGER NOT NULL DEFAULT 750,
    "pitchPerMaand" INTEGER NOT NULL DEFAULT 20,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Prospect" ("bedrag", "bedrijf", "branche", "contact", "createdAt", "email", "gemaildOp", "gepubliceerd", "gereageerdOp", "huidigeSite", "id", "notitie", "opgevolgdOp", "pakket", "perMaand", "plaats", "regio", "slug", "status", "telefoon", "updatedAt") SELECT "bedrag", "bedrijf", "branche", "contact", "createdAt", "email", "gemaildOp", "gepubliceerd", "gereageerdOp", "huidigeSite", "id", "notitie", "opgevolgdOp", "pakket", "perMaand", "plaats", "regio", "slug", "status", "telefoon", "updatedAt" FROM "Prospect";
DROP TABLE "Prospect";
ALTER TABLE "new_Prospect" RENAME TO "Prospect";
CREATE UNIQUE INDEX "Prospect_slug_key" ON "Prospect"("slug");
CREATE INDEX "Prospect_status_updatedAt_idx" ON "Prospect"("status", "updatedAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

