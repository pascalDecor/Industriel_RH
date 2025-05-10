/*
  Warnings:

  - Added the required column `description` to the `Sector` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sector" ADD COLUMN     "description" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "SectionUI" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "libelle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "sectorId" TEXT NOT NULL,

    CONSTRAINT "SectionUI_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SectionUI_sectorId_idx" ON "SectionUI"("sectorId");
