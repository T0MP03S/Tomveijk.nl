-- CreateTable
CREATE TABLE "Prospect" (
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
    "inhoud" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DemoWeergave" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "prospectId" TEXT NOT NULL,
    "bekekenOp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT,
    "browser" TEXT,
    "verwijzer" TEXT,
    CONSTRAINT "DemoWeergave_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "Prospect" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Prospect_slug_key" ON "Prospect"("slug");

-- CreateIndex
CREATE INDEX "Prospect_status_updatedAt_idx" ON "Prospect"("status", "updatedAt");

-- CreateIndex
CREATE INDEX "DemoWeergave_prospectId_bekekenOp_idx" ON "DemoWeergave"("prospectId", "bekekenOp");

